export abstract class CommonConfig {
  protected getEnvString(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  protected getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue || 0;
  }

  protected getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true';
  }

  protected isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  protected isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  protected isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }
}
