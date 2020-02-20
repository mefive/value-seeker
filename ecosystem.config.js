function generateScheduleApp(name) {
  return {
    name,
    script: `npm run ${name}`,
    log_file: `./logs/${name}.log`,
    instances: 1,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    autorestart: name === 'start',
  };
}

module.exports = {
  apps: [
    'load-basic',
    'load-daily',
    'load-cal',
    'load-fina',
    'load-dividend',
    'buy-date',
    'stock-collect',
    'start',
  ].map((name) => generateScheduleApp(name)),
};
