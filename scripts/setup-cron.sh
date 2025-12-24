#!/bin/bash

# Setup script for automated daily prayer generation
# This script should be run on the production server after deployment

set -e

echo "Setting up automated daily prayer generation..."

# Create logs directory if it doesn't exist
mkdir -p /root/praywith-faith/logs

# Install PM2 cron module if not already installed
cd /root/praywith-faith
npm install pm2 -g 2>/dev/null || true

# Stop existing cron job if running
pm2 delete praywith-faith-cron 2>/dev/null || true

# Start the cron job with PM2
pm2 start ecosystem.cron.config.cjs

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo "✓ Cron job setup complete!"
echo "  - Prayers will be generated daily at midnight (server time)"
echo "  - Logs: /root/praywith-faith/logs/cron-*.log"
echo "  - Check status: pm2 list"
echo "  - View logs: pm2 logs praywith-faith-cron"
