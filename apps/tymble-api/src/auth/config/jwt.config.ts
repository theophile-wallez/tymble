import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import z from 'zod';

export default registerAs('jwt', (): JwtModuleOptions => {
  const schema = z.object({
    JWT_SECRET: z
      .string()
      .min(30, 'JWT_SECRET must be provided and at least 30 characters long'),
    JWT_EXPIRES_IN: z.string(),
  });

  const parsedEnv = schema.parse(process.env);
  return {
    secret: parsedEnv.JWT_SECRET,
    // @ts-expect-error Nest expects a `${number}${string}` but zod only ensures it's a string
    signOptions: { expiresIn: parsedEnv.JWT_EXPIRES_IN },
  };
});
