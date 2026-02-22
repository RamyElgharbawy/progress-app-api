import { registerAs } from '@nestjs/config';
import { CommonConfig } from './common.config';

export interface IJwtConfig {
  secret: string;
  expiresIn: number;
}

class JwtConfig extends CommonConfig {
  load(): IJwtConfig {
    return {
      secret: this.getEnvString(
        'JWT_SECRET',
        'your-secret-key-change-in-production',
      ),
      expiresIn: this.getEnvNumber('JWT_EXPIRES_IN', 604800),
    };
  }
}

export default registerAs('jwt', () => new JwtConfig().load());
