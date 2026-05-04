const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`ImmoHub API démarré sur le port ${config.port}`);
  console.log(`Environnement : ${config.nodeEnv}`);
  console.log(`Base de données : ${config.databasePath}`);
  console.log(`CORS origin : ${config.corsOrigin}`);
});
