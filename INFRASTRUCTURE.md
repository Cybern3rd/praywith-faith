# PrayWith-Faith Infrastructure Documentation

**Last Updated:** December 24, 2025  
**Document Version:** 1.0  
**Maintained By:** DevOps Team

---

## 🖥️ Production Server

### Server Details
- **Provider:** Hetzner Cloud
- **Server Name:** PrayWith-Faith
- **Server Type:** CPX11 (Shared vCPU)
- **Location:** Ashburn, VA (us-east)
- **Operating System:** Ubuntu 24.04 LTS

### Server Specifications
- **vCPUs:** 2 AMD cores
- **RAM:** 2 GB
- **Storage:** 40 GB SSD
- **Network:** 1 TB traffic included
- **Cost:** $4.99/month + $1.00/month (backups) = **$5.99/month**

### Network Configuration
- **IPv4 Address:** `5.161.49.163/32`
- **IPv6 Address:** `2a01:4ff:f0:3c02::/64`
- **SSH Access:** Port 22 (root user)

### Authentication
- **Username:** `root`
- **Initial Password:** `MgvcxbkWbKhpmvqUWVsh` (expired)
- **Current Password:** (stored securely, contact admin for access)
- **SSH Key:** Not configured (password authentication only)

### Backup Configuration
- **Enabled:** Yes
- **Frequency:** Daily automatic backups
- **Retention:** 7 days
- **Cost:** 20% of server price (~$1/month)

---

## 🌐 Domain Configuration

### Primary Domain
- **Domain:** `praywith.faith`
- **Registrar:** (To be documented)
- **DNS Provider:** Cloudflare
- **Zone ID:** `680a22e3478d4e14b61dcfd8f6194ea4`
- **Account ID:** `60607093cd8f6aaf43e18835a0a5f5c1`

### DNS Records
| Type | Name | Target | Purpose |
|------|------|--------|---------|
| CNAME | @ | praywith-faith.pages.dev | Frontend (Cloudflare Pages) |
| CNAME | api | Cloudflare Tunnel | Backend API |

### Cloudflare Configuration
- **API Token:** (stored securely in Cloudflare Tunnel config)
- **Tunnel ID:** `da0ae88c-f69e-4d13-ace7-bf985457d2ef`
- **Tunnel Name:** `praywith-faith-api`

---

## 📦 Application Stack

### Backend (Node.js API)
- **Runtime:** Node.js 20.x LTS
- **Framework:** Express + tRPC
- **Port:** 3001 (internal)
- **Process Manager:** PM2
- **Service Name:** `praywith-api`

### Frontend (React SPA)
- **Framework:** React 19 + Vite
- **Hosting:** Cloudflare Pages
- **Deployment:** GitHub Actions (auto-deploy on push)
- **Build Command:** `pnpm build`
- **Output Directory:** `dist/public`

### Database
- **Type:** PostgreSQL 16
- **Container:** Docker (praywith-postgres)
- **Port:** 5432 (internal)
- **Database Name:** `praywith_faith`
- **Username:** `praywith`
- **Password:** (stored securely in environment variables)

### Tunnel Service
- **Service:** Cloudflare Tunnel (cloudflared)
- **Process Manager:** PM2
- **Service Name:** `praywith-tunnel`
- **Configuration:** `/opt/praywith-faith/.cloudflared/config.yml`

---

## 🔐 API Keys & Secrets

### OpenRouter AI
- **API Key:** (stored securely in environment variables)
- **Purpose:** AI-powered prayer generation and chat
- **Model:** `mistralai/ministral-8b`
- **Endpoint:** `https://openrouter.ai/api/v1`

### GitHub Integration
- **Repository:** `https://github.com/Cybern3rd/praywith-faith`
- **Personal Access Token:** (stored securely, not in documentation)
- **Permissions:** repo, workflow, write:packages

### Cloudflare Pages
- **Project Name:** `praywith-faith`
- **Production Branch:** `main`
- **GitHub Actions Secret:** `CLOUDFLARE_API_TOKEN`

---

## 📂 Directory Structure

```
/opt/praywith-faith/
├── dist/                    # Production build
│   ├── prod-server.js      # Backend entry point
│   └── public/             # Frontend static files
├── node_modules/           # Dependencies
├── .cloudflared/           # Tunnel configuration
│   ├── config.yml
│   └── credentials.json
└── ecosystem.config.cjs    # PM2 configuration
```

---

## 🚀 Deployment Workflow

### Development → Production Pipeline

1. **Local Development (Manus)**
   - Develop and test features
   - Create checkpoints for major milestones

2. **Version Control (GitHub)**
   - Push code to `main` branch
   - Triggers GitHub Actions workflow

3. **Automated Deployment**
   - **Frontend:** GitHub Actions → Cloudflare Pages
   - **Backend:** Manual deployment to Hetzner server

4. **Production**
   - Frontend: `https://praywith.faith`
   - API: `https://api.praywith.faith`

---

## 🔧 Service Management

### PM2 Commands
```bash
# View all services
pm2 list

# View logs
pm2 logs praywith-api
pm2 logs praywith-tunnel

# Restart services
pm2 restart praywith-api
pm2 restart praywith-tunnel

# Stop services
pm2 stop praywith-api
pm2 stop praywith-tunnel

# Save PM2 configuration
pm2 save
```

### Database Commands
```bash
# Access database
docker exec -it praywith-postgres psql -U praywith -d praywith_faith

# Backup database
docker exec praywith-postgres pg_dump -U praywith praywith_faith > backup.sql

# Restore database
docker exec -i praywith-postgres psql -U praywith praywith_faith < backup.sql
```

---

## 📊 Monitoring & Logs

### Application Logs
- **PM2 Logs:** `~/.pm2/logs/`
- **API Logs:** `~/.pm2/logs/praywith-api-out.log`
- **Error Logs:** `~/.pm2/logs/praywith-api-error.log`

### System Monitoring
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
pm2 monit
```

---

## 🔒 Security Best Practices

### Implemented
- ✅ HTTPS/SSL via Cloudflare
- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Database password authentication
- ✅ Daily automated backups

### Recommended
- [ ] Set up firewall (ufw)
- [ ] Configure fail2ban for SSH protection
- [ ] Implement rate limiting on API
- [ ] Set up monitoring alerts
- [ ] Regular security updates

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- **Weekly:** Review application logs
- **Monthly:** Update dependencies (`pnpm update`)
- **Quarterly:** Review and rotate API keys
- **As Needed:** Scale server resources if traffic increases

### Troubleshooting Contacts
- **Server Provider:** Hetzner Cloud Support
- **DNS/CDN:** Cloudflare Support
- **Repository:** GitHub Issues

---

## 📝 Change Log

### Version 1.0 - December 24, 2025
- Initial production server setup
- Deployed backend API and frontend
- Configured Cloudflare Tunnel
- Set up PostgreSQL database
- Implemented GitHub Actions CI/CD

---

## 🔗 Quick Links

- **Production Site:** https://praywith.faith
- **API Endpoint:** https://api.praywith.faith
- **GitHub Repository:** https://github.com/Cybern3rd/praywith-faith
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Hetzner Cloud Console:** https://console.hetzner.cloud

---

**⚠️ SECURITY NOTICE:**  
This document contains sensitive credentials. Store securely and restrict access. Do not commit to public repositories.
