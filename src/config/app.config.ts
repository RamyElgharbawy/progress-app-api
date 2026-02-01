import { registerAs } from '@nestjs/config';
import { CommonConfig } from './common.config';

export interface IAppConfig {
  name: string;
  env: string;
  port: number;
  apiPrefix: string;
  apiVersion?: string;
  corsOrigin?: string;
}

class AppConfig extends CommonConfig {
  load(): IAppConfig {
    return {
      name: this.getEnvString('APP_NAME', 'Progress-App-Api'),
      env: this.getEnvString('NODE_ENV', 'development'),
      port: this.getEnvNumber('PORT', 3000),
      apiPrefix: this.getEnvString('API_PREFIX', 'api'),
      apiVersion: this.getEnvString('API_VERSION', 'v1'),
      corsOrigin: this.getEnvString('CORS_ORIGIN', '*'),
    };
  }
}

export default registerAs('app', () => new AppConfig().load());
