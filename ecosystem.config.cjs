module.exports = {
  apps: [
    {
      name: 'immohub-api',
      cwd: '/opt/immohub/server',
      script: 'src/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3011,
        DATABASE_PATH: '/opt/immohub/data/immohub.sqlite',
        CORS_ORIGIN: 'https://immohub.topcenter.cg',
      },
    },
  ],
};
