import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Prisma } from '@prisma/client';

export function handleErrors(e: unknown): never {
  if (Array.isArray(e) && e[0] instanceof ValidationError) {
    const errorMessages = e.map((error) =>
      Object.values(error.constraints || {}).join(', '),
    );

    throw new BadRequestException({
      message: errorMessages,
      errors: e,
    });
  }

  if (e instanceof Prisma.PrismaClientUnknownRequestError) {
    throw e;
  }

  throw new BadRequestException('Erro ao processar a requisição');
}
