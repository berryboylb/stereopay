import { AppModule } from './app.module';
import { HttpExceptionFilter, TypeOrmFilter } from './exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidatorOptions, ValidationError } from 'class-validator';


export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: true;
  disableErrorMessages?: false;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('v1');

  app.useGlobalFilters(new TypeOrmFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
