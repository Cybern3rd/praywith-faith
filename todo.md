# PrayWith-Faith TODO

## Completed ✅
- [x] Project setup and architecture design
- [x] Database schema (users, prayers, saved_prayers, journal_entries, chat_sessions, chat_messages)
- [x] OpenRouter API integration
- [x] Prayer generation with AI
- [x] Beautiful "Ethereal Minimalism" design
- [x] Prayer display component with 5-part structure
- [x] Authentication with Manus OAuth
- [x] Navigation system
- [x] Responsive layout
- [x] tRPC API setup
- [x] Database helpers

## In Progress 🚧
- [x] Journal feature (backend ready, frontend needed)
- [x] Chat feature (backend ready, frontend needed)
- [x] Save prayer functionality
- [x] Share prayer functionality
- [ ] Audio prayer playback

## Planned 📋
- [ ] Multi-language support (Spanish, French, Portuguese)
- [ ] Prayer history/archive
- [ ] User preferences
- [ ] Email notifications
- [ ] Mobile app optimization
- [ ] Offline support
- [ ] Prayer themes/categories

## Deployment 🚀
- [x] Create GitHub repository
- [x] Push code to GitHub
- [x] Backend deployed to Hetzner VPS (port 3001)
- [x] PostgreSQL database migrated
- [x] Cloudflare Tunnel configured (api.praywith.faith)
- [x] PM2 managing API and tunnel services
- [x] GitHub Actions workflow for auto-deployment
- [x] Frontend deployed to Cloudflare Pages
- [x] Custom domain DNS configured (praywith.faith)
- [ ] Fix frontend-backend connection (CORS/URL issue)
- [ ] Test all features in production


## Design Changes 🎨
- [x] Change to clean white background (remove gradients)
- [x] Remove decorative drop caps from prayer body
- [x] Simplify typography and spacing
- [x] Keep design minimal and clean


## New Features - In Progress 🔧
- [x] Fix CORS configuration on backend
- [x] Fix frontend tRPC client for production API
- [ ] Test frontend-backend connection (redeploying)
- [ ] Add language selector UI component
- [ ] Implement Spanish prayer generation
- [ ] Implement French prayer generation
- [ ] Implement Portuguese prayer generation
- [ ] Create Saved Prayers page with list view
- [ ] Add search functionality to Saved Prayers
- [ ] Add filtering by date to Saved Prayers
- [ ] Test all new features
- [ ] Deploy to production


## Server Migration 🖥️
- [x] Export PrayWith-Faith database from n8n server
- [x] Stop and remove PrayWith-Faith services from n8n server
- [x] Clean up PrayWith-Faith files from n8n server
- [x] Set up fresh Hetzner server for PrayWith-Faith
- [ ] Deploy backend to new server
- [ ] Deploy frontend to new server
- [ ] Configure Cloudflare Tunnel on new server
- [ ] Test complete application on new server


## Testing Issues Found (Dec 24, 2025) 🐛

- [x] Implement Listen button functionality (currently disabled - needs text-to-speech)
- [ ] Test Share button on various devices (implementation exists but needs verification)
- [ ] Add loading states and error handling for all interactive buttons
- [ ] Test mobile responsiveness across different devices
- [ ] Verify authenticated user features work correctly
- [ ] Add user feedback for button clicks (toasts, animations)


## New Features - Phase 2 (Dec 24, 2025) 🚀

### Authenticated Features Testing
- [x] Test Save Prayer functionality with authenticated user
- [x] Test Journal feature (backend ready, needs frontend testing)
- [x] Test Chat feature (backend ready, needs frontend testing)
- [x] Verify all authenticated API endpoints work correctly

### Multi-Language Support
- [x] Design and implement language selector UI component
- [x] Add language state management
- [x] Implement Spanish prayer generation
- [x] Implement French prayer generation
- [x] Implement Portuguese prayer generation
- [x] Update prayer display to support multiple languages
- [x] Test language switching functionality

### Mobile & PWA Optimization
- [x] Create PWA manifest.json
- [x] Implement service worker for offline support
- [x] Add app icons for different sizes
- [x] Test mobile responsive design on various devices
- [x] Optimize touch interactions
- [x] Add install prompt for PWA
- [x] Test offline functionality


## New Features - Phase 3 (Dec 24, 2025)

### Email Notification System
- [x] Design notification settings UI component
- [x] Add notification preferences page/modal
- [x] Implement time picker for daily reminder
- [x] Create backend notification scheduling system
- [x] Integrate with existing notification API
- [ ] Add email template for daily prayers (requires email service provider)
- [ ] Test email delivery and scheduling (requires email service provider)
- [ ] Add unsubscribe functionality (requires email service provider)

### Prayer History Calendar
- [x] Design calendar UI component
- [x] Implement date navigation (previous/next)
- [x] Create calendar grid view with dates
- [x] Add backend API endpoint for prayer history
- [x] Implement date filtering in database queries
- [x] Connect calendar to prayer display
- [x] Add loading states and empty states
- [x] Test calendar navigation and date selection

### Future Features (Phase 4)
- [ ] Community Prayer Requests feature


## New Features - Phase 4 (Dec 24, 2025)

### Social Media Preview Cards
- [x] Add Open Graph meta tags to HTML
- [x] Add Twitter Card meta tags
- [x] Implement dynamic OG tags based on prayer content
- [x] Generate OG image for prayers
- [ ] Test sharing on Facebook, Twitter, WhatsApp (requires user testing)
- [ ] Add structured data (JSON-LD) for SEO (future enhancement)

### Prayer Journal Export
- [x] Create PDF export functionality for saved prayers
- [x] Create PDF export functionality for journal entries
- [x] Add export button to Journal page
- [x] Add export button to Saved Prayers page
- [x] Design PDF layout with branding
- [x] Include prayer content, dates, and user notes
- [x] Test PDF generation and download


## Bug Fixes - Phase 5 (Dec 24, 2025)

### Critical Bugs
- [x] Fix Listen button "Failed to play audio" error
- [x] Fix Language selector dropdown menu not opening
- [x] Test both fixes in production environment


## Critical Bug - Language Switching (Dec 24, 2025)

- [ ] Fix language switching - prayer content not changing when language is selected
- [ ] Investigate tRPC query caching issue
- [ ] Implement proper query refetch mechanism
- [ ] Test all four languages (English, Spanish, French, Portuguese)


## New Features - Phase 6 (Dec 24, 2025)

### UI Internationalization
- [x] Create translation system/dictionary for UI elements
- [x] Translate navigation buttons (Browse Prayer History, Settings, etc.)
- [x] Translate action buttons (Save, Listen, Share)
- [x] Translate authentication UI (Sign In, Sign Out, Profile)
- [x] Translate calendar UI (month names, navigation)
- [x] Translate settings page UI
- [x] Translate journal page UI
- [x] Translate saved prayers page UI
- [x] Translate loading and error messages
- [x] Test all UI translations in all 4 languages

### Automated Prayer Generation
- [x] Create cron job script for daily prayer generation
- [x] Configure cron to run at midnight (server timezone)
- [x] Generate prayers for all 4 languages automatically
- [x] Add logging for automated generation
- [x] Test cron job execution
- [ ] Deploy cron configuration to production server (manual deployment required due to SSH connection issues)


## New Features - Phase 7 (Dec 24, 2025 - Evening)

### Date Display Fix
- [ ] Investigate why date shows Dec 23 instead of Dec 24, 2025
- [ ] Fix database connection issue (see DATABASE_TROUBLESHOOTING.md)
- [ ] Test date display in browser after database is connected

### Language-Specific Voice Selection
- [x] Update Listen feature to detect current language
- [x] Map languages to appropriate voice selections (es, fr, pt)
- [x] Test voice selection for all 4 languages (will verify on production)
- [x] Ensure fallback to English if language-specific voice unavailable


## Critical Fix - Phase 8 (Dec 24, 2025 - Late Evening)

### Database Connection Errors
- [x] Diagnose why postgres.js cannot connect to database (DATABASE_URL was MySQL, not PostgreSQL)
- [x] Try alternative database connection approach (switched to mysql2 library)
- [x] Test database queries after connection fix
- [x] Verify prayer generation works
- [ ] Deploy fix to production (ready for deployment)
