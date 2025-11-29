import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class TymbleException extends HttpException {
  constructor(
    logger: Logger,
    message: string | string[],
    status: HttpStatus,
    errOrContext?: unknown
  ) {
    logger.error(
      message,
      errOrContext instanceof Error ? errOrContext.stack : undefined
    );

    let context: Record<string, unknown> | undefined;

    if (errOrContext instanceof Error) {
      context = {
        cause: errOrContext.cause,
      };
    } else if (typeof errOrContext === 'object' && errOrContext !== null) {
      context = errOrContext as Record<string, unknown>;
    }

    const response = {
      message,
      timestamp: new Date().toISOString(),
      context: context || undefined,
    };

    super(response, status);
  }
}
