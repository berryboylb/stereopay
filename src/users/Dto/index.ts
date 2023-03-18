import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  readonly description: string;

//   @IsNotEmpty()
//   @IsIn(['audio', 'image'])
//   @Type(() => String)
//   @IsString()
//   readonly type: string;
}

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  perPage?: number;
}


export class QueryMediaDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  readonly query: string;
}

export class StatusMediaDto {
  @IsNotEmpty()
  @IsIn(['active', 'inactive'])
  @Type(() => String)
  @IsString()
  readonly status: string;
}