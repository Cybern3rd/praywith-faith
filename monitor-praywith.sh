#!/bin/bash
# PrayWith-Faith Monitoring Script

LOG_FILE="/var/log/praywith-monitor.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo "[$TIMESTAMP] === System Health Check ===" >> $LOG_FILE

# Check PM2 process
echo "[$TIMESTAMP] Checking PM2 process..." >> $LOG_FILE
PM2_STATUS=$(pm2 jlist | jq -r '.[0].pm2_env.status' 2>/dev/null || echo "unknown")
if [ "$PM2_STATUS" != "online" ]; then
    echo "[$TIMESTAMP] WARNING: PM2 process is $PM2_STATUS" >> $LOG_FILE
    pm2 restart praywith-faith >> $LOG_FILE 2>&1
else
    echo "[$TIMESTAMP] PM2 process is running normally" >> $LOG_FILE
fi

# Check Nginx
echo "[$TIMESTAMP] Checking Nginx..." >> $LOG_FILE
if systemctl is-active --quiet nginx; then
    echo "[$TIMESTAMP] Nginx is running" >> $LOG_FILE
else
    echo "[$TIMESTAMP] WARNING: Nginx is not running" >> $LOG_FILE
    systemctl start nginx >> $LOG_FILE 2>&1
fi

# Check PostgreSQL container
echo "[$TIMESTAMP] Checking PostgreSQL..." >> $LOG_FILE
if docker ps | grep -q praywith-postgres; then
    echo "[$TIMESTAMP] PostgreSQL container is running" >> $LOG_FILE
else
    echo "[$TIMESTAMP] WARNING: PostgreSQL container is not running" >> $LOG_FILE
fi

# Check disk space
echo "[$TIMESTAMP] Checking disk space..." >> $LOG_FILE
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "[$TIMESTAMP] WARNING: Disk usage is ${DISK_USAGE}%" >> $LOG_FILE
else
    echo "[$TIMESTAMP] Disk usage: ${DISK_USAGE}%" >> $LOG_FILE
fi

# Check memory
echo "[$TIMESTAMP] Checking memory..." >> $LOG_FILE
MEM_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3/$2 * 100}')
echo "[$TIMESTAMP] Memory usage: ${MEM_USAGE}%" >> $LOG_FILE

echo "[$TIMESTAMP] === Health Check Complete ===" >> $LOG_FILE
echo "" >> $LOG_FILE
