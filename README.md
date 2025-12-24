# PrayWith.Faith

A spiritual companion app that provides daily AI-generated prayers, journaling, and chat features.

## Features

- 🙏 **Daily Prayers** - AI-generated prayers with 5-part structure
- 📔 **Journal** - Personal reflections and notes
- 💬 **Chat** - AI-powered spiritual conversation
- 💾 **Save & Share** - Bookmark and share prayers

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Node.js + tRPC + Express
- **Database:** PostgreSQL
- **AI:** OpenRouter (Ministral-8b)
- **Hosting:** Cloudflare Pages (Frontend) + Hetzner VPS (Backend)

## Deployment

- **Frontend:** Automatically deployed to Cloudflare Pages via GitHub Actions
- **Backend:** Running on Hetzner VPS with PM2
- **API:** https://api.praywith.faith
- **Website:** https://praywith.faith

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## License

MIT
