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
      log_file: './logs/load-basic.log',
      ...scheduleWorkCommon,
    },
    {
      name: 'load-daily',
      script: 'npm run load-daily',
      autorestart: false,
      log_file: './logs/load-daily.log',
      ...scheduleWorkCommon,
    },
  ],
};
