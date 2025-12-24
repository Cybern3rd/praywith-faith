# Deployment Instructions for UI Translations & Automated Prayer Generation

## Overview

This deployment includes:
1. **UI Internationalization** - Complete translation system for all 4 languages (English, Spanish, French, Portuguese)
2. **Automated Daily Prayer Generation** - Cron job to generate prayers at midnight for all languages

## What's New

### UI Translations
- Created `client/src/lib/translations.ts` with comprehensive translation dictionary
- Updated all pages to use translations:
  - Home page (navigation, buttons, loading states)
  - Prayer Display (action buttons, section headers, messages)
  - Journal page
  - Saved Prayers page
  - Settings page
- All UI elements now dynamically translate based on selected language

### Automated Prayer Generation
- Created `scripts/generate-daily-prayers.mjs` - Script to generate prayers for all languages
- Created `ecosystem.cron.config.cjs` - PM2 configuration for cron scheduling
- Created `scripts/setup-cron.sh` - Automated setup script for production
- Created `scripts/CRON_SETUP.md` - Detailed documentation

## Deployment Steps

### 1. Deploy Frontend Changes

The build has been completed locally. To deploy to production:

```bash
# On your local machine or CI/CD
cd /path/to/praywith-faith
pnpm build

# Copy to production server
scp -r dist/* root@praywith.faith:/root/praywith-faith/dist/

# Restart PM2 on production
ssh root@praywith.faith "cd /root/praywith-faith && pm2 restart praywith-faith-api"
```

### 2. Set Up Automated Prayer Generation

SSH into the production server and run the setup script:

```bash
ssh root@praywith.faith
cd /root/praywith-faith
bash scripts/setup-cron.sh
```

This will:
- Create logs directory
- Install PM2 (if needed)
- Start the cron job
- Configure PM2 to start on system boot

### 3. Verify Deployment

#### Test UI Translations
Visit the site and test each language:
- https://praywith.faith/?lang=en
- https://praywith.faith/?lang=es
- https://praywith.faith/?lang=fr
- https://praywith.faith/?lang=pt

Check that:
- Navigation buttons are translated
- Action buttons (Save, Listen, Share) are translated
- Loading messages are translated
- Calendar UI is translated

#### Test Automated Generation
```bash
# Check cron job status
ssh root@praywith.faith "pm2 list"

# View cron logs
ssh root@praywith.faith "pm2 logs praywith-faith-cron"

# Manually test the script
ssh root@praywith.faith "cd /root/praywith-faith && node scripts/generate-daily-prayers.mjs"
```

## Files Changed

### New Files
- `client/src/lib/translations.ts` - Translation dictionary
- `scripts/generate-daily-prayers.mjs` - Prayer generation script
- `ecosystem.cron.config.cjs` - PM2 cron configuration
- `scripts/setup-cron.sh` - Setup automation script
- `scripts/CRON_SETUP.md` - Cron documentation

### Modified Files
- `client/src/pages/Home.tsx` - Added translation hooks
- `client/src/components/PrayerDisplay.tsx` - Translated UI elements
- `client/src/pages/Journal.tsx` - Translated UI elements
- `client/src/pages/SavedPrayers.tsx` - Translated UI elements
- `client/src/pages/Settings.tsx` - Translated UI elements
- `server/db.ts` - Fixed language query bug (already deployed)

## Troubleshooting

### If translations don't appear:
1. Clear browser cache and hard refresh (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify language parameter in URL

### If cron job doesn't run:
1. Check PM2 status: `pm2 list`
2. View logs: `pm2 logs praywith-faith-cron --err`
3. Manually test: `node scripts/generate-daily-prayers.mjs`
4. Verify server timezone: `timedatectl`

### If SSH connection fails:
- The production server may have firewall rules or rate limiting
- Try connecting from a different IP or wait a few minutes
- Contact server administrator to whitelist your IP

## Notes

- The cron job runs at midnight server time
- Prayers are only generated if they don't already exist for that date
- All 4 languages are generated automatically
- Logs are stored in `/root/praywith-faith/logs/`
- The translation system uses React Context for language state management
- Language preference is stored in URL parameters and localStorage
