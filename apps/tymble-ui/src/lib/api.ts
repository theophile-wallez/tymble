import type { ZodType } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class ApiValidationError extends Error {
  data?: unknown;
  issues?: unknown;

  constructor(message: string, data?: unknown, issues?: unknown) {
    super(message);
    this.name = 'ApiValidationError';
    this.data = data;
    this.issues = issues;
  }
}

type GenericParams = Record<string, string | number | boolean>;

type ApiRequestOptions<T, P extends GenericParams> = RequestInit & {
  params?: P;
  schema?: ZodType<T>;
  paramSchema?: ZodType<P>;
  bodySchema?: ZodType<unknown>;
};

export async function apiRequest<T, P extends GenericParams = GenericParams>(
  endpoint: string,
  options?: ApiRequestOptions<T, P>
): Promise<T> {
  const { schema, paramSchema, ...fetchOptions } = options ?? {};

  const finalUrl = new URLSearchParams(`${API_BASE_URL}${endpoint}`);

  if (paramSchema) {
    const result = paramSchema.safeParse(options?.params);
    if (!result.success) {
      throw new ApiValidationError(
        'Invalid parameters',
        options?.params,
        result.error.issues
      );
    }
  }

  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      finalUrl.set(key, String(value));
    }
  }

  const response = await fetch(finalUrl.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
    credentials: 'include', // Always send cookies
    ...fetchOptions,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.message || 'An error occurred',
      response.status,
      errorData
    );
  }

  const data = await response.json();

  // Validate response if schema provided
  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error('API response validation failed:', result.error);
      throw new ApiValidationError(
        'Invalid API response format',
        data,
        result.error.issues
      );
    }
    return result.data;
  }

  return data;
}
