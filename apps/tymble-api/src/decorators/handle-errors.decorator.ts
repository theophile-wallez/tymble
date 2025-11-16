import { HttpException, InternalServerErrorException } from '@nestjs/common';

import {
  DrizzleError,
  DrizzleQueryError,
  TransactionRollbackError,
} from 'drizzle-orm/errors';

function isHttpException(err: unknown): err is HttpException {
  return err instanceof HttpException;
}

export function HandleErrors() {
  return (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    descriptor.value = async function <TArgs>(...args: TArgs[]) {
      try {
        return await original.apply(this, args);
      } catch (err: unknown) {
        // -------------------------------------
        // 6. Query errors → 500
        // -------------------------------------
        if (err instanceof DrizzleQueryError) {
          throw new InternalServerErrorException(err.message);
        }

        // -------------------------------------
        // 8. Base drizzle error → 500
        // -------------------------------------
        if (err instanceof DrizzleError) {
          throw new InternalServerErrorException(err.message);
        }

        if (err instanceof TransactionRollbackError) {
          throw new InternalServerErrorException('Transaction was rolled back');
        }

        // -------------------------------------
        // 9. HttpExceptions → rethrow
        // -------------------------------------
        if (isHttpException(err)) {
          throw err;
        }

        // -------------------------------------
        // 10. Unknown errors → 500
        // -------------------------------------
        const message =
          typeof err === 'object' &&
          err !== null &&
          'message' in err &&
          typeof (err as { message: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Unexpected server error';

        throw new InternalServerErrorException(message);
      }
    };
  };
}
