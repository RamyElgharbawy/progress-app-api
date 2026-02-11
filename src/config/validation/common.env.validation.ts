import { Environment } from 'src/common/enums/env.enum';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CommonEnvValidation {
  // Application Environment Config
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Type(() => Number)
  PORT: number;

  // Database Config
  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  @Type(() => Number)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING?: boolean;

  // JWT Config
  @IsString()
  @IsOptional()
  JWT_SECRET?: string;

  @IsNumber()
  @IsOptional()
  JWT_EXPIRATION?: number;

  // API Config
  @IsString()
  @IsOptional()
  API_PREFIX?: string;

  @IsString()
  @IsOptional()
  API_VERSION?: string;

  // Cors Config
  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;
}
