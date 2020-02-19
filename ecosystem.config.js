const scheduleWorkCommon = {
  instances: 1,
  watch: false,
  max_memory_restart: '1G',
  env: {
    NODE_ENV: 'development',
  },
  env_production: {
    NODE_ENV: 'production',
  },
};

module.exports = {
  apps: [
    {
      name: 'load-basic',
      script: 'npm run load-basic',
      autorestart: false,
      ...scheduleWorkCommon,
    },
    {
      name: 'load-daily',
      script: 'npm run load-daily',
      autorestart: false,
      ...scheduleWorkCommon,
    },
  ],
};
