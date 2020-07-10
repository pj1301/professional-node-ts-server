export function checkEnvironmentVariables(): boolean {
  const env = process.env.NODE_ENV;
  if (!env) return false;
  if (env !== 'development' && env !== 'production') return false;
  return true;
}