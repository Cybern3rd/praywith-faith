module.exports = {
  apps: [{
    name: 'praywith-faith-cron',
    script: './scripts/generate-daily-prayers.mjs',
    cron_restart: '0 0 * * *', // Run at midnight every day
    watch: false,
    autorestart: false,
    exec_mode: 'fork',
    instances: 1,
    env: {
      NODE_ENV: 'production',
    },
    error_file: './logs/cron-error.log',
    out_file: './logs/cron-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
