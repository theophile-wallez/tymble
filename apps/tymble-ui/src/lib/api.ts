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
type GenericBody = Record<string, unknown>;
type ApiRequestOptions<
  T,
  P extends GenericParams,
  B extends GenericBody,
> = Omit<RequestInit, 'body'> & {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: P;
  schema?: ZodType<T>;
  paramSchema?: ZodType<P>;
  body?: B;
  bodySchema?: ZodType<B>;
};

export async function apiRequest<
  T,
  P extends GenericParams = GenericParams,
  B extends GenericBody = GenericBody,
>(endpoint: string, options?: ApiRequestOptions<T, P, B>): Promise<T> {
  const { schema, paramSchema, bodySchema, body, ...fetchOptions } =
    options ?? {};

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

  const urlString = `${API_BASE_URL}${endpoint}`;
  const url = API_BASE_URL.startsWith('http')
    ? new URL(urlString)
    : new URL(urlString, window.location.origin);
  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, String(value));
    }
  }

  if (bodySchema && body) {
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      throw new ApiValidationError('Invalid body', body, result.error.issues);
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
    credentials: 'include', // Always send cookies
    body: body ? JSON.stringify(body) : undefined,
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
      console.error('API response validation failed:', result.error, data);
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
