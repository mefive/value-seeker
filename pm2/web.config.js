module.exports = {
  apps: [{
    script: 'npm run start',
    log_file: `./logs/start.log`,
    instances: 1,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
    },
    autorestart: true,
  }]
};
