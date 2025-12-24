# Automated Daily Prayer Generation Setup

This directory contains scripts for automated daily prayer generation.

## Overview

The system automatically generates prayers for all 4 languages (English, Spanish, French, Portuguese) at midnight every day using PM2's cron functionality.

## Files

- `generate-daily-prayers.mjs` - Main script that generates prayers for all languages
- `setup-cron.sh` - Deployment script to set up the cron job on production server
- `../ecosystem.cron.config.cjs` - PM2 configuration for cron scheduling

## Setup on Production Server

1. SSH into the production server:
   ```bash
   ssh root@praywith.faith
   ```

2. Navigate to the project directory:
   ```bash
   cd /root/praywith-faith
   ```

3. Run the setup script:
   ```bash
   bash scripts/setup-cron.sh
   ```

4. Verify the cron job is running:
   ```bash
   pm2 list
   pm2 logs praywith-faith-cron
   ```

## Manual Execution

To manually generate prayers for today:

```bash
cd /root/praywith-faith
node scripts/generate-daily-prayers.mjs
```

## Monitoring

- View cron job status: `pm2 list`
- View logs: `pm2 logs praywith-faith-cron`
- View error logs: `tail -f /root/praywith-faith/logs/cron-error.log`
- View output logs: `tail -f /root/praywith-faith/logs/cron-out.log`

## Troubleshooting

If prayers are not being generated:

1. Check PM2 status: `pm2 list`
2. Check logs for errors: `pm2 logs praywith-faith-cron --err`
3. Manually run the script to test: `node scripts/generate-daily-prayers.mjs`
4. Verify database connection and environment variables
5. Restart the cron job: `pm2 restart praywith-faith-cron`

## Timezone

The cron job runs at midnight in the server's timezone. To check the server timezone:

```bash
timedatectl
```

To change the timezone (if needed):

```bash
timedatectl set-timezone America/New_York
```
