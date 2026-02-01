export function getEnvName(): string {
  const env = process.env.NODE_ENV;
  return `.env.${env || 'development'}`;
}
