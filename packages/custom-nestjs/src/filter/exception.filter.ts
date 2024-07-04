import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ShopifizedError, generateResponse } from '@shopifize/helpers';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  public catch(
    exception: UnauthorizedException,
    host: ArgumentsHost,
  ): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response
      .status(401)
      .json({ statusCode: 401, message: exception.message });
  }
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  public catch(exception: BadRequestException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.status(400).json({
      statusCode: 400,
      message: (exception.getResponse() as { message: Array<any> }).message,
    });
  }
}

@Catch(ShopifizedError)
export class ShopifizedExeptionFilter implements ExceptionFilter {
  public catch(exception: ShopifizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response
      .status(200)
      .json(generateResponse(null, false, exception.message));
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error | Record<string, unknown>, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    if (
      (exception as Record<string, unknown>).status === HttpStatus.BAD_REQUEST
    ) {
      return response.status(400).json({
        statusCode: 400,
        message: (
          (exception as BadRequestException).getResponse() as {
            message: Array<any>;
          }
        ).message,
      });
    } else if (exception instanceof ShopifizedError) {
      return response
        .status(200)
        .json(generateResponse(null, false, exception.message));
    } else if (exception instanceof UnauthorizedException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      return response
        .status(401)
        .json({ statusCode: 401, message: exception.message });
    } else if (exception instanceof ForbiddenException) {
      return response
        .status(403)
        .json({ statusCode: 403, message: exception.message });
    }

    return response.status(500).json({
      statusCode: 500,
      message: exception.message,
    });
  }
}
