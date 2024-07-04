import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { OrderBy } from '@shopifize/helpers';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { PaginationDto } from 'src/dtos';

export const Pagination = <T>(klass?: ClassConstructor<T>) =>
  createParamDecorator<
    Partial<Record<keyof T, true>>,
    ExecutionContext,
    PaginationDto<T>
  >((object: Partial<Record<keyof T, true>>, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const {
      skip = 0,
      limit = 20,
      sortBy = '',
      orderBy = OrderBy.DESC,
      ...queries
    } = request.query as unknown as PaginationDto<unknown>;

    const search = {};

    for (const [key, v] of Object.entries(queries)) {
      const value = v as unknown as string;
      const parsedValue = value.indexOf(',') !== -1 ? value.split(',') : value;
      if (key in object) {
        search[key] = parsedValue;
      }
    }

    const searchResult = klass ? plainToInstance(klass, search) : null;

    const result = plainToInstance(
      PaginationDto<T>,
      { skip, limit, sortBy, orderBy, search },
      { enableImplicitConversion: true },
    );

    result.search = searchResult ? searchResult : result.search;

    if (result.limit === -1) {
      result.limit = undefined;
    }

    return result;
  });
