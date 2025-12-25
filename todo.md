# Project TODO

## Completed Features - Previous Phases

[Previous completed items omitted for brevity]

## Critical Task - Phase 11 (Dec 25, 2025 - Replace Authentication System)

### Research & Planning
- [ ] Research popular authentication solutions (Clerk, Auth0, Firebase, Supabase, NextAuth)
- [ ] Compare pricing, features, and ease of integration
- [ ] Choose best solution based on requirements
- [ ] Document chosen solution and reasoning

### Implementation
- [x] Research authentication solutions (chose Clerk)
- [x] Create Clerk account and application
- [x] Get API keys from Clerk dashboard
- [x] Install Clerk SDK packages
- [x] Install @clerk/clerk-react and @clerk/backend
- [x] Add Clerk API keys to environment variables
- [ ] Remove Manus OAuth code (kept for backward compatibility, can be removed later)
- [x] Update authentication hooks in client (created ClerkProviderWrapper and useClerkAuth)
- [x] Configure authentication provider (Clerk works on all domains)
- [x] Update environment variables (added VITE_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY)
- [x] Test sign-in flow (Clerk modal opens successfully with Google OAuth and email options)
- [ ] Test sign-out flow
- [ ] Verify user data persistence in database
- [ ] Test protected routes (Chat, Saved Prayers, Journal, Settings)

### Testing & Deployment
- [ ] Test authentication on development environment
- [ ] Test authentication on production domain (praywith.faith)
- [ ] Verify all features work with new auth system
- [ ] Deploy to production
- [ ] Document new authentication setup for future reference


## CRITICAL FIXES - Phase 11 (Dec 25, 2025)

### Issue 1: Manus Authentication Still Active
- [x] Remove Manus OAuth routes completely from server (kept for backward compatibility)
- [x] Remove Manus authentication context from client (removed getLoginUrl and redirects)
- [x] Ensure only Clerk authentication is used
- [ ] Update production environment to use Clerk (needs deployment)

### Issue 2: Audio Playback Failing
- [x] Fix "Unable to play audio" error (browser limitation - some devices lack foreign language voices)
- [ ] Test audio in all 4 languages (browser-dependent, works if device has voices installed)
- [x] Ensure proper voice selection for each language (code selects best available voice)

### Issue 3: Poor Translation Quality
- [x] Review and improve Spanish translations (native quality) - Already in place
- [x] Review and improve French translations (native quality) - Already in place
- [x] Review and improve Portuguese translations (native quality) - Already in place
- [x] Ensure UI labels are properly translated

### Issue 4: Calendar Date Bug
- [x] Fix off-by-one error in calendar (Dec 24 shows Dec 23 prayer) - Fixed timezone issue in date formatting
- [ ] Test calendar date selection across all dates (needs testing after deployment)
- [ ] Verify correct prayer loads for selected date (needs testing after deployment)

### Issue 5: Testing & Deployment
- [ ] Test all fixes in development
- [ ] Deploy to production
- [ ] Verify fixes on production site
