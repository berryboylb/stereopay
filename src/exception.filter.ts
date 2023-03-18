import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
// import { MongoError } from 'mongodb';

export interface ResponseType<T> {
  statusCode?: number;
  message: string;
  data: T;
  status: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseType<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseType<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        // statusCode: context.switchToHttp().getResponse().statusCode,
        message: data.message || '',
        data: data,
      })),
    );
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as {
      message: string;
      status: string;
    };

    response.status(status).json({
      //   statusCode: status,
      status: 'error',
      message: Array.isArray(error?.message)
        ? error?.message[0]
        : error?.message,
      data: {
        statusCode: status,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let message: string = (exception as TypeORMError).message;
    let code: number = (exception as any).code;

    // const customResponse = {
    //   status: 500,
    //   message: 'Something Went Wrong',
    //   type: 'Internal Server Error',
    //   errors: [{ code: code, message: message }],
    //   errorCode: 300,
    //   timestamp: new Date().toISOString(),
    // };

    response.status(500).json({
      status: 'error',
      message: message,
      data: {
        statusCode: 500,
        timestamp: new Date().toISOString(),
        code: code,
        type: 'Internal Server Error',
      },
    });
  }
}

// @Catch(MongoError)
// export class MongoExceptionFilter implements ExceptionFilter {
//   catch(exception: MongoError, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const status = exception.code;

//     switch (status) {
//       case 11000:
//         const err = exception as unknown as { keyPattern: string };
//         response.status(HttpStatus.CONFLICT).json({
//           statusCode: HttpStatus.CONFLICT,
//           message: `${Object.keys(err.keyPattern)[0]} already exist`,
//           timestamp: new Date().toISOString(),
//         });
//     }
//   }
// }

// @Catch(WsException, HttpException)
// export class AllExceptionsFilter extends BaseWsExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     super.catch(exception, host);
//   }
// }
