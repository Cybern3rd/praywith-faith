# PrayWith-Faith Quick Reference Guide

## 🚀 Quick Access

**Live Site:** https://praywith.faith  
**Server IP:** 5.161.49.163  
**SSH:** `ssh root@5.161.49.163` (password: PrayWithFaith2025!Server)

---

## 🔧 Common Commands

### **Check Status**
```bash
# All services
pm2 status                    # Backend
systemctl status nginx        # Web server
docker ps                     # Database

# Application health
curl https://praywith.faith
```

### **View Logs**
```bash
pm2 logs praywith-faith              # Backend logs
tail -f /var/log/nginx/error.log     # Nginx errors
tail -f /var/log/praywith-monitor.log # Monitor log
```

### **Restart Services**
```bash
pm2 restart praywith-faith    # Backend
systemctl restart nginx       # Web server
docker restart praywith-postgres # Database
```

### **Deploy Updates**
```bash
cd /var/www/praywith-faith
git pull origin main
pnpm install
pnpm build
pm2 restart praywith-faith
```

---

## 🗄️ Database

### **Access Database**
```bash
docker exec -it praywith-postgres psql -U praywith -d praywith_faith
```

### **Manual Backup**
```bash
/usr/local/bin/backup-praywith-db.sh
```

### **Restore Backup**
```bash
gunzip < /var/backups/postgresql/praywith_faith_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i praywith-postgres psql -U praywith -d praywith_faith
```

---

## 📊 Monitoring

### **Automated Tasks**
- **Backups:** Daily at 2:00 AM → `/var/backups/postgresql/`
- **Monitoring:** Every 5 minutes → `/var/log/praywith-monitor.log`

### **View Cron Jobs**
```bash
crontab -l
```

---

## 🔐 Credentials

### **Server**
- SSH: root@5.161.49.163
- Password: PrayWithFaith2025!Server

### **Database**
- Host: localhost
- Port: 5432
- Database: praywith_faith
- User: praywith
- Password: PrayWithFaith2025!DB

### **Cloudflare**
- Dashboard: https://dash.cloudflare.com
- Zone: praywith.faith

---

## 🆘 Emergency Procedures

### **Site Down**
1. Check Nginx: `systemctl status nginx`
2. Check PM2: `pm2 status`
3. Check logs: `pm2 logs praywith-faith`
4. Restart: `pm2 restart praywith-faith`

### **Database Issues**
1. Check container: `docker ps | grep postgres`
2. Check logs: `docker logs praywith-postgres`
3. Restart: `docker restart praywith-postgres`

### **High Resource Usage**
1. Check metrics: `pm2 monit`
2. Check system: `htop`
3. Restart backend: `pm2 restart praywith-faith`

---

## 📞 Support

**Full Documentation:** See `DEPLOYMENT.md`  
**GitHub:** https://github.com/Cybern3rd/praywith-faith
