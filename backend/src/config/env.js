module.exports = {
  PORT: process.env.BACKEND_PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  DATABASE_PATH: process.env.DATABASE_PATH || './data/portal.db',
  CANVA_API_KEY: process.env.CANVA_API_KEY || '',
};
