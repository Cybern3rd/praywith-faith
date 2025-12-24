# PrayWith-Faith Configuration Reference

**Last Updated:** December 24, 2025  
**Version:** 1.0.0  
**Environment:** Production

---

## 📋 Table of Contents

1. [Server Configuration](#server-configuration)
2. [Application Configuration](#application-configuration)
3. [Database Configuration](#database-configuration)
4. [Web Server Configuration](#web-server-configuration)
5. [SSL/TLS Configuration](#ssltls-configuration)
6. [DNS Configuration](#dns-configuration)
7. [Environment Variables](#environment-variables)
8. [Automation Scripts](#automation-scripts)
9. [Monitoring Configuration](#monitoring-configuration)
10. [Security Configuration](#security-configuration)

---

## 🖥️ Server Configuration

### **Provider Details**
```yaml
Provider: Hetzner Cloud
Region: Germany (Falkenstein)
IP Address: 5.161.49.163
Hostname: praywith-faith-server
Operating System: Ubuntu 22.04 LTS
Architecture: x86_64
```

### **Server Access**
```bash
# SSH Access
Host: 5.161.49.163
User: root
Password: PrayWithFaith2025!Server
Port: 22

# SSH Command
ssh root@5.161.49.163
```

### **Server Specifications**
```yaml
CPU: 2 vCPU
RAM: 4 GB
Storage: 40 GB SSD
Bandwidth: 20 TB
```

### **Installed Software**
```yaml
Node.js: v22.13.0
npm: v10.9.2
pnpm: v9.15.4
PM2: Latest
Nginx: v1.18.0
Docker: Latest
Docker Compose: Latest
PostgreSQL: 16 (Docker)
Git: Latest
Certbot: Latest
```

---

## 🚀 Application Configuration

### **Application Paths**
```bash
# Main application directory
/var/www/praywith-faith/

# Frontend build output
/var/www/praywith-faith/dist/public/

# Backend build output
/var/www/praywith-faith/dist/

# Node modules
/var/www/praywith-faith/node_modules/

# Source code
/var/www/praywith-faith/client/      # Frontend
/var/www/praywith-faith/server/      # Backend
/var/www/praywith-faith/shared/      # Shared code
/var/www/praywith-faith/drizzle/     # Database schema
```

### **PM2 Configuration**
**File:** `/var/www/praywith-faith/ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [{
    name: 'praywith-faith',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DATABASE_URL: 'postgresql://praywith:PrayWithFaith2025!DB@localhost:5432/praywith_faith',
      OPENROUTER_API_KEY: '(your-api-key-here)'
    }
  }]
}
```

### **Application Ports**
```yaml
Frontend: Served by Nginx on ports 80/443
Backend API: 3001 (internal, proxied by Nginx)
Database: 5432 (Docker container)
```

### **Build Commands**
```bash
# Install dependencies
pnpm install

# Build frontend and backend
pnpm build

# Run database migrations
pnpm db:push

# Start with PM2
pm2 start ecosystem.config.cjs

# Development mode (local)
pnpm dev
```

---

## 🗄️ Database Configuration

### **PostgreSQL Container**
```yaml
Container Name: praywith-postgres
Image: postgres:16-alpine
Port Mapping: 5432:5432
Restart Policy: always
```

### **Database Credentials**
```yaml
Host: localhost (from server) / 5.161.49.163 (external)
Port: 5432
Database: praywith_faith
Username: praywith
Password: PrayWithFaith2025!DB
```

### **Connection String**
```bash
# Internal (from server)
postgresql://praywith:PrayWithFaith2025!DB@localhost:5432/praywith_faith

# External (requires firewall rules)
postgresql://praywith:PrayWithFaith2025!DB@5.161.49.163:5432/praywith_faith
```

### **Docker Compose Configuration**
**File:** `/var/www/praywith-faith/docker-compose.yml`

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: praywith-postgres
    environment:
      POSTGRES_USER: praywith
      POSTGRES_PASSWORD: PrayWithFaith2025!DB
      POSTGRES_DB: praywith_faith
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

### **Database Schema**
**File:** `/var/www/praywith-faith/drizzle/schema.ts`

```typescript
// Main tables:
- prayers: Daily prayer content
- users: User accounts
- saved_prayers: User saved prayers
- prayer_history: Prayer generation history
```

### **Drizzle Configuration**
**File:** `/var/www/praywith-faith/drizzle.config.ts`

```typescript
export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
}
```

---

## 🌐 Web Server Configuration

### **Nginx Configuration**
**File:** `/etc/nginx/sites-available/praywith-faith`

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name praywith.faith www.praywith.faith;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name praywith.faith www.praywith.faith;

    # SSL certificates
    ssl_certificate /etc/nginx/ssl/praywith.faith.crt;
    ssl_certificate_key /etc/nginx/ssl/praywith.faith.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root directory for frontend
    root /var/www/praywith-faith/dist/public;
    index index.html;

    # Frontend - serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **Nginx Commands**
```bash
# Test configuration
nginx -t

# Reload configuration
systemctl reload nginx

# Restart Nginx
systemctl restart nginx

# Check status
systemctl status nginx

# View error logs
tail -f /var/log/nginx/error.log

# View access logs
tail -f /var/log/nginx/access.log
```

---

## 🔐 SSL/TLS Configuration

### **Certificate Details**
```yaml
Type: Self-signed certificate (for Cloudflare origin)
Certificate Path: /etc/nginx/ssl/praywith.faith.crt
Private Key Path: /etc/nginx/ssl/praywith.faith.key
Validity: 365 days
Subject: CN=praywith.faith
```

### **Certificate Generation Command**
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/praywith.faith.key \
  -out /etc/nginx/ssl/praywith.faith.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=praywith.faith"
```

### **SSL Protocols & Ciphers**
```yaml
Protocols: TLSv1.2, TLSv1.3
Ciphers: HIGH:!aNULL:!MD5
Prefer Server Ciphers: On
```

### **Cloudflare SSL/TLS Settings**
```yaml
Encryption Mode: Full
Edge Certificates: Universal SSL (Cloudflare managed)
Minimum TLS Version: 1.2
Automatic HTTPS Rewrites: Enabled
Always Use HTTPS: Enabled
```

---

## 🌍 DNS Configuration

### **Cloudflare Account**
```yaml
Dashboard: https://dash.cloudflare.com
Zone: praywith.faith
Zone ID: 60607093cd8f6aaf43e18835a0a5f5c1
```

### **DNS Records**
```yaml
# A Record (Root domain)
Type: A
Name: @ (praywith.faith)
Content: 5.161.49.163
Proxy Status: Proxied (Orange cloud)
TTL: Auto

# CNAME Record (www subdomain)
Type: CNAME
Name: www
Content: praywith.faith
Proxy Status: Proxied (Orange cloud)
TTL: Auto

# CNAME Record (API subdomain - legacy)
Type: CNAME
Name: api
Content: da0ae88c-f69e-4d13-ace7-bf985457d2ef.cfargotunnel.com
Proxy Status: Proxied (Orange cloud)
TTL: Auto
```

### **Nameservers**
```yaml
Primary: megan.ns.cloudflare.com
Secondary: skip.ns.cloudflare.com
```

### **DNS Propagation Check**
```bash
# Check DNS resolution
dig praywith.faith +short
nslookup praywith.faith

# Check from specific DNS server
dig @8.8.8.8 praywith.faith
```

---

## 🔧 Environment Variables

### **Production Environment Variables**
**Location:** `/var/www/praywith-faith/ecosystem.config.cjs`

```javascript
env: {
  // Node environment
  NODE_ENV: 'production',
  
  // Server port
  PORT: 3001,
  
  // Database connection
  DATABASE_URL: 'postgresql://praywith:PrayWithFaith2025!DB@localhost:5432/praywith_faith',
  
  // AI API for prayer generation
  OPENROUTER_API_KEY: '(your-api-key)',
  
  // Optional: Additional configuration
  LOG_LEVEL: 'info',
  MAX_CONNECTIONS: 100
}
```

### **Environment Variable Reference**
```yaml
NODE_ENV: Application environment (production/development)
PORT: Backend server port (3001)
DATABASE_URL: PostgreSQL connection string
OPENROUTER_API_KEY: OpenRouter API key for AI prayer generation
```

---

## 🤖 Automation Scripts

### **1. Database Backup Script**
**File:** `/usr/local/bin/backup-praywith-db.sh`

```bash
#!/bin/bash
# PrayWith-Faith Database Backup Script

# Configuration
BACKUP_DIR="/var/backups/postgresql"
DB_NAME="praywith_faith"
DB_USER="praywith"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/praywith_faith_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Create backup
echo "Starting backup of ${DB_NAME} at $(date)"
docker exec praywith-postgres pg_dump -U ${DB_USER} ${DB_NAME} | gzip > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo "Backup completed successfully: ${BACKUP_FILE}"
    echo "Backup size: $(du -h ${BACKUP_FILE} | cut -f1)"
else
    echo "Backup failed!" >&2
    exit 1
fi

# Remove old backups
echo "Removing backups older than ${RETENTION_DAYS} days..."
find ${BACKUP_DIR} -name "praywith_faith_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

echo "Backup process completed at $(date)"
```

**Schedule:** Daily at 2:00 AM  
**Cron:** `0 2 * * * /usr/local/bin/backup-praywith-db.sh >> /var/log/praywith-backup.log 2>&1`

### **2. System Monitoring Script**
**File:** `/usr/local/bin/monitor-praywith.sh`

```bash
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
```

**Schedule:** Every 5 minutes  
**Cron:** `*/5 * * * * /usr/local/bin/monitor-praywith.sh`

---

## 📊 Monitoring Configuration

### **PM2 Monitoring**
```bash
# View process status
pm2 status

# View real-time monitoring
pm2 monit

# View logs
pm2 logs praywith-faith

# View process info
pm2 info praywith-faith

# View process metrics
pm2 describe praywith-faith
```

### **Log Files**
```yaml
Backend Logs: pm2 logs praywith-faith
Nginx Access: /var/log/nginx/access.log
Nginx Error: /var/log/nginx/error.log
Monitor Log: /var/log/praywith-monitor.log
Backup Log: /var/log/praywith-backup.log
System Log: /var/log/syslog
```

### **Cron Jobs**
```bash
# View all cron jobs
crontab -l

# Edit cron jobs
crontab -e

# Current cron schedule:
0 2 * * * /usr/local/bin/backup-praywith-db.sh >> /var/log/praywith-backup.log 2>&1
*/5 * * * * /usr/local/bin/monitor-praywith.sh
```

---

## 🔒 Security Configuration

### **Firewall Rules**
```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

### **SSH Configuration**
```yaml
Port: 22
PasswordAuthentication: yes
PermitRootLogin: yes
PubkeyAuthentication: yes
```

### **Cloudflare Security**
```yaml
DDoS Protection: Enabled (automatic)
WAF: Available (requires upgrade)
Rate Limiting: Available (requires upgrade)
Bot Management: Basic (free tier)
```

### **Database Security**
```yaml
Access: Localhost only (not exposed to internet)
Authentication: Password-based
SSL: Not required (local connection)
```

### **Application Security**
```yaml
HTTPS: Enforced (automatic redirect)
CORS: Configured in backend
Rate Limiting: To be implemented
Input Validation: Implemented in backend
```

---

## 📦 Backup Configuration

### **Backup Location**
```bash
/var/backups/postgresql/
```

### **Backup Naming Convention**
```bash
praywith_faith_YYYYMMDD_HHMMSS.sql.gz
Example: praywith_faith_20251224_020000.sql.gz
```

### **Backup Retention**
```yaml
Retention Period: 30 days
Automatic Cleanup: Yes (via cron script)
Compression: gzip
```

### **Backup Restoration**
```bash
# List available backups
ls -lh /var/backups/postgresql/

# Restore from backup
gunzip < /var/backups/postgresql/praywith_faith_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i praywith-postgres psql -U praywith -d praywith_faith
```

---

## 🔄 Update & Deployment Process

### **Standard Deployment**
```bash
# 1. SSH into server
ssh root@5.161.49.163

# 2. Navigate to project
cd /var/www/praywith-faith

# 3. Pull latest changes
git pull origin main

# 4. Install dependencies
pnpm install

# 5. Build application
pnpm build

# 6. Run migrations (if needed)
pnpm db:push

# 7. Restart backend
pm2 restart praywith-faith

# 8. Verify status
pm2 status
curl https://praywith.faith
```

### **Rollback Procedure**
```bash
# 1. Check git history
git log --oneline

# 2. Revert to previous commit
git reset --hard <commit-hash>

# 3. Rebuild and restart
pnpm install
pnpm build
pm2 restart praywith-faith
```

---

## 📞 Support & Maintenance

### **GitHub Repository**
```yaml
URL: https://github.com/Cybern3rd/praywith-faith
Branch: main
```

### **Key Contacts**
```yaml
Server Provider: Hetzner Cloud
DNS Provider: Cloudflare
Domain Registrar: Cloudflare
```

### **Maintenance Schedule**
```yaml
Daily: Automated backups (2:00 AM)
Every 5 minutes: Health monitoring
Weekly: Log review
Monthly: Security updates
Quarterly: Full system audit
```

---

## 📝 Notes

- All passwords and sensitive credentials are stored in this document
- Keep this document secure and do not commit to public repositories
- Update this document when configuration changes are made
- Regular backups ensure data safety and disaster recovery capability
- Monitoring ensures high availability and quick issue detection

---

**Document Version:** 1.0.0  
**Last Updated:** December 24, 2025  
**Maintained By:** System Administrator
