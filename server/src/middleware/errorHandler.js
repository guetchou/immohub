const config = require('../config');

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Erreur serveur interne',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
