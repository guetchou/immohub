require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3011,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'immohub_dev_secret_change_in_production',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  databasePath: process.env.DATABASE_PATH || './data/immohub.sqlite',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
