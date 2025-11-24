import { HttpException, HttpStatus } from '@nestjs/common';

export class TymbleException extends HttpException {
  constructor(
    code: string,
    message: string | string[],
    status: HttpStatus,
    context?: Record<string, unknown>
  ) {
    const response = {
      code,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    super(response, status);
  }
}
