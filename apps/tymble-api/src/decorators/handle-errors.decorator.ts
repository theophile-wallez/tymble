import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

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
        if (err instanceof DrizzleQueryError) {
          throw new BadRequestException(err);
        }

        if (err instanceof DrizzleError) {
          throw new InternalServerErrorException(err, _propertyKey);
        }

        if (err instanceof TransactionRollbackError) {
          throw new InternalServerErrorException('Transaction was rolled back');
        }

        if (isHttpException(err)) {
          throw err;
        }

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
