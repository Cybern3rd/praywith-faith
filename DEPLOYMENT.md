# PrayWith-Faith Production Deployment Documentation

**Deployment Date:** December 24, 2025  
**Live URL:** https://praywith.faith  
**Server:** Hetzner VPS (5.161.49.163)

---

## 🎯 Deployment Overview

The PrayWith-Faith application has been successfully deployed to a production Hetzner server with full SSL/HTTPS, automated backups, monitoring, and auto-restart capabilities.

### **Architecture**

```
Internet → Cloudflare (DNS + SSL Proxy) → Nginx (Reverse Proxy) → Node.js Backend (PM2)
                                                ↓
                                        PostgreSQL (Docker)
```

---

## 🌐 Domain Configuration

### **DNS Records (Cloudflare)**
- **A Record:** `praywith.faith` → `5.161.49.163` (Proxied)
- **CNAME:** `www.praywith.faith` → `praywith.faith` (Proxied)
- **CNAME:** `api.praywith.faith` → Cloudflare Tunnel (for previous setup)

### **SSL/TLS**
- **Mode:** Full (Cloudflare → Origin Server encrypted)
- **Certificate:** Self-signed certificate on origin server
- **Protocols:** TLS 1.2, TLS 1.3
- **Certificate Location:** `/etc/nginx/ssl/praywith.faith.{crt,key}`

---

## 🖥️ Server Configuration

### **Server Details**
- **Provider:** Hetzner
- **IP Address:** 5.161.49.163
- **OS:** Ubuntu 22.04 LTS
- **SSH Access:** root@5.161.49.163 (password: PrayWithFaith2025!Server)

### **Installed Software**
- Node.js 22.x
- PM2 (Process Manager)
- Nginx (Web Server)
- Docker & Docker Compose
- PostgreSQL 16 (Docker container)
- Git

---

## 📁 Application Structure

### **Directories**
- **Application:** `/var/www/praywith-faith/`
- **Frontend Build:** `/var/www/praywith-faith/dist/public/`
- **Backend:** `/var/www/praywith-faith/dist/`
- **Backups:** `/var/backups/postgresql/`
- **Logs:** `/var/log/`

### **Key Files**
- **Nginx Config:** `/etc/nginx/sites-available/praywith-faith`
- **PM2 Config:** `/var/www/praywith-faith/ecosystem.config.cjs`
- **Backup Script:** `/usr/local/bin/backup-praywith-db.sh`
- **Monitor Script:** `/usr/local/bin/monitor-praywith.sh`

---

## 🔧 Services

### **1. Nginx (Web Server)**
```bash
# Status
systemctl status nginx

# Restart
systemctl restart nginx

# Reload config
systemctl reload nginx

# Test config
nginx -t
```

**Configuration:**
- Listens on ports 80 (HTTP) and 443 (HTTPS)
- HTTP automatically redirects to HTTPS
- Serves frontend from `/var/www/praywith-faith/dist/public/`
- Proxies `/api/*` requests to backend on port 3001

### **2. PM2 (Backend Process Manager)**
```bash
# Status
pm2 status

# Logs
pm2 logs praywith-faith

# Restart
pm2 restart praywith-faith

# Stop
pm2 stop praywith-faith

# Start
pm2 start praywith-faith
```

**Configuration:**
- Process name: `praywith-faith`
- Entry point: `/var/www/praywith-faith/dist/index.js`
- Port: 3001
- Auto-restart: Enabled on system boot

### **3. PostgreSQL (Database)**
```bash
# Status
docker ps | grep praywith-postgres

# Access database
docker exec -it praywith-postgres psql -U praywith -d praywith_faith

# Restart container
docker restart praywith-postgres

# View logs
docker logs praywith-postgres
```

**Configuration:**
- Container name: `praywith-postgres`
- Port: 5432
- Database: `praywith_faith`
- User: `praywith`
- Password: `PrayWithFaith2025!DB`

---

## 🔄 Automated Tasks

### **1. Database Backups**
**Schedule:** Daily at 2:00 AM  
**Script:** `/usr/local/bin/backup-praywith-db.sh`  
**Location:** `/var/backups/postgresql/`  
**Retention:** 30 days

**Manual Backup:**
```bash
/usr/local/bin/backup-praywith-db.sh
```

**Restore from Backup:**
```bash
# Find backup file
ls -lh /var/backups/postgresql/

# Restore
gunzip < /var/backups/postgresql/praywith_faith_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i praywith-postgres psql -U praywith -d praywith_faith
```

### **2. System Monitoring**
**Schedule:** Every 5 minutes  
**Script:** `/usr/local/bin/monitor-praywith.sh`  
**Log:** `/var/log/praywith-monitor.log`

**Monitors:**
- PM2 process health (auto-restarts if down)
- Nginx service status
- PostgreSQL container status
- Disk space usage (warns if >80%)
- Memory usage

**View Monitor Log:**
```bash
tail -f /var/log/praywith-monitor.log
```

### **3. Cron Jobs**
```bash
# View all cron jobs
crontab -l

# Edit cron jobs
crontab -e
```

**Current Schedule:**
```
0 2 * * * /usr/local/bin/backup-praywith-db.sh >> /var/log/praywith-backup.log 2>&1
*/5 * * * * /usr/local/bin/monitor-praywith.sh
```

---

## 🚀 Deployment Process

### **Initial Deployment**
1. ✅ Set up server (Node.js, PM2, Nginx, Docker, PostgreSQL)
2. ✅ Clone repository from GitHub
3. ✅ Install dependencies and build application
4. ✅ Configure environment variables
5. ✅ Run database migrations
6. ✅ Start backend with PM2
7. ✅ Configure Nginx
8. ✅ Set up SSL certificates
9. ✅ Configure DNS (Cloudflare)
10. ✅ Set up automated backups
11. ✅ Configure monitoring
12. ✅ Enable auto-restart on boot

### **Future Updates**
```bash
# SSH into server
ssh root@5.161.49.163

# Navigate to project
cd /var/www/praywith-faith

# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Build application
pnpm build

# Run migrations (if needed)
pnpm db:push

# Restart backend
pm2 restart praywith-faith

# Verify status
pm2 status
```

---

## 🔐 Environment Variables

**Location:** `/var/www/praywith-faith/ecosystem.config.cjs`

**Key Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: production
- `PORT`: 3001
- `OPENROUTER_API_KEY`: AI API key for prayer generation

---

## 📊 Monitoring & Logs

### **Application Logs**
```bash
# PM2 logs (backend)
pm2 logs praywith-faith

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# System monitor log
tail -f /var/log/praywith-monitor.log

# Backup log
tail -f /var/log/praywith-backup.log
```

### **Health Checks**
```bash
# Check all services
systemctl status nginx
pm2 status
docker ps

# Check application response
curl -I https://praywith.faith
curl https://praywith.faith/api/health
```

---

## 🛠️ Troubleshooting

### **Application Not Loading**
1. Check Nginx status: `systemctl status nginx`
2. Check PM2 status: `pm2 status`
3. Check backend logs: `pm2 logs praywith-faith`
4. Check Nginx logs: `tail -f /var/log/nginx/error.log`

### **Database Connection Issues**
1. Check PostgreSQL container: `docker ps | grep postgres`
2. Check database logs: `docker logs praywith-postgres`
3. Test connection: `docker exec -it praywith-postgres psql -U praywith -d praywith_faith`

### **SSL/HTTPS Issues**
1. Check Cloudflare SSL mode (should be "Full")
2. Verify certificate: `openssl s_client -connect praywith.faith:443`
3. Check Nginx SSL config: `nginx -t`

### **High Memory/CPU Usage**
1. Check PM2 metrics: `pm2 monit`
2. Check system resources: `htop` or `top`
3. Restart backend: `pm2 restart praywith-faith`

---

## 🔄 Maintenance Tasks

### **Weekly**
- Review monitor logs for warnings
- Check disk space usage
- Verify backups are running

### **Monthly**
- Review and clean old logs
- Update dependencies (if needed)
- Test backup restoration
- Review security updates

### **Quarterly**
- Update Node.js and system packages
- Review and optimize database
- Test disaster recovery procedures

---

## 📞 Support Information

### **GitHub Repository**
- URL: https://github.com/Cybern3rd73/praywith-faith
- Branch: main

### **Server Access**
- SSH: `ssh root@5.161.49.163`
- Password: PrayWithFaith2025!Server

### **Database Access**
- Host: localhost (from server)
- Port: 5432
- Database: praywith_faith
- User: praywith
- Password: PrayWithFaith2025!DB

### **Cloudflare**
- Dashboard: https://dash.cloudflare.com
- Zone: praywith.faith

---

## ✅ Deployment Checklist

- [x] Server provisioned and configured
- [x] Application deployed and running
- [x] Database set up and migrated
- [x] Domain configured (DNS)
- [x] SSL/HTTPS enabled
- [x] Nginx configured and running
- [x] PM2 configured with auto-restart
- [x] Automated backups configured
- [x] Monitoring system active
- [x] Application accessible at https://praywith.faith
- [x] All services verified and operational

---

## 🎉 Deployment Status: **COMPLETE**

**Live URL:** https://praywith.faith  
**Status:** ✅ Operational  
**Last Updated:** December 24, 2025
