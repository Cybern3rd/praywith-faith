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
- [ ] Test Save Prayer functionality with authenticated user
- [ ] Test Journal feature (backend ready, needs frontend testing)
- [ ] Test Chat feature (backend ready, needs frontend testing)
- [ ] Verify all authenticated API endpoints work correctly

### Multi-Language Support
- [ ] Design and implement language selector UI component
- [ ] Add language state management
- [ ] Implement Spanish prayer generation
- [ ] Implement French prayer generation
- [ ] Implement Portuguese prayer generation
- [ ] Update prayer display to support multiple languages
- [ ] Test language switching functionality

### Mobile & PWA Optimization
- [ ] Create PWA manifest.json
- [ ] Implement service worker for offline support
- [ ] Add app icons for different sizes
- [ ] Test mobile responsive design on various devices
- [ ] Optimize touch interactions
- [ ] Add install prompt for PWA
- [ ] Test offline functionality
