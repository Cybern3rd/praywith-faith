# Current DNS Records for praywith.faith

## Records to Update

### Current Configuration:
1. **CNAME** `api` → `da0ae88c-f69e-4d13-ace7-bf985457d2ef.cfargotunnel.com` (Proxied)
2. **CNAME** `praywith.faith` → `praywith-faith.pages.dev` (Proxied) - **NEEDS TO BE CHANGED TO A RECORD**
3. **CNAME** `www` → `praywith.faith` (Proxied)

### Target Configuration:
1. Keep **CNAME** `api` → Cloudflare Tunnel (for future use if needed)
2. **Change** root domain to **A record** `praywith.faith` → `5.161.49.163` (Hetzner server)
3. **Change** `www` to **A record** `www` → `5.161.49.163` (Hetzner server)

### Action Plan:
1. Delete the CNAME record for `praywith.faith` pointing to `praywith-faith.pages.dev`
2. Add A record for `praywith.faith` pointing to `5.161.49.163`
3. Change www CNAME to A record pointing to `5.161.49.163`
4. Keep proxy status enabled (orange cloud) for DDoS protection and CDN benefits
