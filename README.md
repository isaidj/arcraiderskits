# 🎮 Arc Raiders Kits

A comprehensive, multilingual web application for Arc Raiders game data. Browse items, quests, hideout modules, skill nodes and more with interactive tools and real-time countdown timers.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🌍 **18 Languages**: Full support for EN, ES, DE, FR, PT, PL, NO, DA, IT, UK, KR, RU, ZH-CN, JA, TR, ZH-TW, SR, HR
- 📦 **Items Database**: Comprehensive item catalog with filtering, sorting, and search
- 📜 **Quests & Missions**: Complete quest database with objectives, rewards, and requirements
- 🏠 **Hideout Modules**: Browse and plan your hideout upgrades
- 🎯 **Skill Nodes**: Explore the skill tree system
- ⏱️ **Expedition Countdown**: Real-time countdown to next game expedition
- 🔍 **Advanced Search**: Instant search with debouncing and URL state persistence
- 🎨 **Interactive UI**: Smooth animations, tooltips, and responsive design
- 🔗 **SEO Optimized**: Human-readable URLs with slug-based routing
- 📱 **Mobile First**: Fully responsive across all devices
- 🚀 **Performance**: Static generation with on-demand ISR for optimal loading
- 📲 **Progressive Web App (PWA)**: Installable app with offline support powered by Serwist

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/isaidj/arcraiderskits.git
cd arcraiderskits

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run data update script
npm run update-data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for all available options:

```bash
# Required: Expedition countdown end date
NEXT_PUBLIC_EXPEDITION_END_DATE=2025-12-21T23:59:59

# Optional: Google AdSense (if using ads)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ENABLED=false

# Optional: Custom API base URL
NEXT_PUBLIC_API_BASE_URL=https://cdn.arctracker.io
```

**Note**: Vercel Analytics and Speed Insights are automatically enabled when deployed to Vercel—no additional configuration needed.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```plaintext
arcraiderskits/
├── src/
│   ├── app/
│   │   ├── [lang]/              # Internationalized routes
│   │   │   ├── items/           # Items pages
│   │   │   │   ├── [id]/        # Dynamic item detail pages (slug-based)
│   │   │   │   └── page.tsx     # Items list page
│   │   │   ├── quests/          # Quests pages
│   │   │   │   ├── [id]/        # Dynamic quest detail pages (slug-based)
│   │   │   │   └── page.tsx     # Quests list page
│   │   │   ├── hideout/         # Hideout modules
│   │   │   ├── skills/          # Skill nodes
│   │   │   └── page.tsx         # Home page
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   ├── items/               # Item-related components
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemDetailView.tsx
│   │   │   ├── ItemsFilter.tsx
│   │   │   └── utils.ts         # Slug generation & helpers
│   │   ├── quests/              # Quest-related components
│   │   │   ├── QuestCard.tsx
│   │   │   ├── QuestDetailView.tsx
│   │   │   ├── QuestsFilter.tsx
│   │   │   └── utils.ts         # Slug generation & helpers
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── config/
│   │   └── i18n.ts              # i18n configuration
│   └── contexts/
│       └── AdsContext.tsx       # Ad management context
├── public/
│   └── data/
│       ├── items.json           # Items database
│       ├── quests.json          # Quests database
│       ├── hideoutModules.json  # Hideout data
│       └── skillNodes.json      # Skills data
├── scripts/
│   └── update-data.js           # Data fetching script
└── next.config.ts               # Next.js configuration
```

## 🛠️ Technologies

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Analytics**: Vercel Analytics & Speed Insights
- **Sitemap**: next-sitemap
- **Linting**: ESLint with Next.js config

## 🌐 Internationalization

The app supports 18 languages with automatic route generation:

```typescript
// Available locales
const locales = [
  "en", "es", "de", "fr", "pt", "pl", "no", "da", 
  "it", "uk", "kr", "ru", "zh-CN", "ja", "tr", 
  "zh-TW", "sr", "hr"
];
```

URLs follow the pattern: `/{lang}/items/{slug}` or `/{lang}/quests/{slug}`

## 🔗 SEO & Routing

### Slug Generation

All items and quests use SEO-friendly slugs:

```typescript
// Example: "Health Potion" + id "abc123" → "health-potion-abc123"
generateSlug(item.name, item.id);
```

Features:

- Unicode normalization (removes diacritics)
- Lowercase conversion
- Special character removal
- Space-to-hyphen conversion
- Unique ID suffix for collision prevention

### Static Generation Strategy

- **Primary languages** (EN, ES, DE, FR, PT): Pre-rendered at build time
- **Secondary languages**: Generated on-demand (ISR)
- **Dynamic params**: Enabled for flexible route handling

## 📊 Data Management

Data is fetched from external API and stored in JSON files:

```bash
# Update all game data
npm run update-data
```

The script (`scripts/update-data.js`) fetches:

- Items from Arc Raiders API
- Quests and missions
- Hideout modules
- Skill nodes

## 📲 Progressive Web App (PWA)

This application is a fully functional PWA powered by [Serwist](https://serwist.pages.dev/):

### PWA Features
- **Installable**: Users can install the app on their devices (mobile & desktop)
- **Offline Support**: Works offline with cached content and custom offline page
- **Service Worker**: Automatic caching and update strategies
- **App-like Experience**: Standalone mode without browser UI
- **Fast Loading**: Pre-cached static assets for instant navigation

### Installation
Users can install the app by:
1. Visiting the website on a supported browser
2. Clicking the "Install" button in the browser's address bar
3. Or using the browser's "Add to Home Screen" option

For more details, see [PWA_SETUP.md](PWA_SETUP.md).

## 🎨 Features in Detail

### Items Database

- **Search**: Real-time search with 300ms debounce
- **Filters**: Category, rarity, location
- **Sorting**: Name, value, weight, rarity
- **View Modes**: Normal and compact grid layouts
- **Item Details**: Full stats, recycling info, related items

### Quests System

- **Trader Filtering**: Filter by quest giver (Shani, Celeste, Tian Wen, Apollo)
- **Quest Chains**: Visual indication of previous/next quests
- **Video Guides**: Integration for video tutorials
- **Requirements**: Clear display of needed items
- **Rewards**: XP and item rewards tracking

### UI/UX Features

- Interactive tooltips on hover
- Smooth page transitions
- Loading states and skeletons
- Error boundaries
- Responsive navigation
- Dark mode optimized design
- Cyberpunk-inspired aesthetics

## 🚀 Performance Optimizations

- Static page generation for 5 primary languages
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Debounced search inputs
- URL state persistence
- ISR (Incremental Static Regeneration) for secondary languages
- Increased Node.js memory for large builds (`--max-old-space-size=4096`)

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production (with data update)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run update-data  # Fetch latest game data
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Arc Raiders game data provided by [Arc Raiders API](https://cdn.arctracker.io)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Contact

- GitHub: [@isaidj](https://github.com/isaidj)
- Repository: [arcraiderskits](https://github.com/isaidj/arcraiderskits)

---

**Note**: This is a fan-made database and is not officially affiliated with Arc Raiders or Embark Studios.
