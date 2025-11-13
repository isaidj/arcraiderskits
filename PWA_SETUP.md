# PWA Implementation with Serwist

This project has been configured as a Progressive Web App (PWA) using Serwist for Next.js 16 with Turbopack support.

## Features

- ✅ **Offline Support**: The app can work offline using a service worker
- ✅ **Installable**: Users can install the app on their devices
- ✅ **Caching Strategy**: Smart caching for improved performance
- ✅ **Offline Fallback**: Custom offline page shown when network is unavailable
- ✅ **PWA Icons**: Optimized icons for various devices (192x192, 512x512)
- ✅ **Turbopack Compatible**: Works with Next.js 16's Turbopack by default

## Configuration

### Service Worker
The service worker is configured in `src/sw.ts` and uses Serwist's default caching strategies:
- Precaching of static assets
- Runtime caching for dynamic content
- Navigation preload enabled
- Automatic claim of clients on activation

### Manifest
The PWA manifest is located at `public/manifest.json` and includes:
- App name and description
- Display mode: standalone
- Theme colors
- Icons for different sizes

### Build Configuration
This implementation uses `@serwist/turbopack` for Next.js 16 compatibility:
- Service worker is served through a Route Handler at `src/app/sw/[[...path]]/route.ts`
- Compatible with Turbopack (Next.js 16 default)
- No webpack configuration needed
- Works in both development and production modes

## Development

The service worker works in both development and production environments with Turbopack.

### Building
```bash
npm run build
```

This will:
1. Update Arc Raiders data
2. Build the Next.js application with Turbopack
3. Generate the service worker and serve it via Route Handler
4. Create the sitemap

### Testing PWA Locally
To test the PWA functionality locally:

```bash
npm run build
npm start
```

Then visit `http://localhost:3000` and check:
- DevTools > Application > Service Workers
- DevTools > Application > Manifest
- Try going offline and verify the offline page appears

## Icons

PWA icons are automatically generated from `public/logo.png` using the script:
```bash
node scripts/generate-pwa-icons.js
```

This creates:
- `icon-192x192.png` - For Android devices
- `icon-512x512.png` - For larger displays and maskable icon

## Offline Page

A custom offline page is available at `/~offline` and will be shown when users navigate while offline.

## Files Added/Modified

### New Files
- `src/sw.ts` - Service worker configuration
- `src/app/sw/[[...path]]/route.ts` - Route Handler for serving service worker (Turbopack)
- `src/components/PWARegister.tsx` - Client-side service worker registration
- `src/app/~offline/page.tsx` - Offline fallback page
- `public/manifest.json` - PWA manifest
- `public/icon-192x192.png` - PWA icon (192x192)
- `public/icon-512x512.png` - PWA icon (512x512)
- `scripts/generate-pwa-icons.js` - Script to generate PWA icons

### Modified Files
- `next.config.ts` - Clean configuration without webpack plugins
- `src/app/layout.tsx` - Added manifest metadata and PWARegister component
- `tsconfig.json` - Added webworker lib
- `.gitignore` - Excluded generated service worker files
- `package.json` - Added Serwist dependencies (@serwist/turbopack)

## Deployment

When deploying to production:
1. The service worker will be automatically generated
2. Users will be prompted to install the app (on supported devices)
3. The app will cache assets for offline use
4. Updates to the service worker will be detected and applied

## Browser Support

PWA features are supported in:
- Chrome/Edge (desktop and mobile)
- Firefox (desktop and mobile)
- Safari (iOS 11.3+ and macOS)
- Opera

Note: Installation prompts may vary by browser and platform.
