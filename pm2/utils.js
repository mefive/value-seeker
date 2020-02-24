exports.generateScheduleApp = (name, command, arv) => {
  return {
    name,
    script: `npm run value-seeker ${command}${arv ? ` -- ${arv}` : ''}`,
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
};
