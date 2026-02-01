import { Environment } from 'src/common/enums/env.enum';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CommonEnvValidation {
  // Application Environment Config
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  // Database Config
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsBoolean()
  @IsOptional()
  DB_SYNCHRONIZE?: boolean;

  @IsBoolean()
  @IsOptional()
  DB_LOGGING?: boolean;

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
