# QR Menu Template

Production-ready **static** QR menu template for restaurants and cafes. Each repository corresponds to one venue. The application code stays unchanged — only `public/restaurant/` is replaced when launching a new site.

## What this template does

- Shows restaurant info, logo, and cover
- Renders categories and dishes from a single `menu.json`
- Links dish photos by ID (`restaurant/assets/dishes/{id}.webp`)
- Supports search, category navigation, and dish detail modal
- Uses high-resolution WebP images in rounded, non-overlapping media areas
- Shows an optional JSON-configured notice about necessary technical cookies
- Applies a dynamic theme from two RGB colors
- Shows contacts, social links, optional map (after consent), and PDF downloads
- Builds to static files for any CDN or static host

This template is **informational only**. It does not include cart, checkout, reservations, forms, backend, SMTP, or personal data collection.

## Quick start

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`.

## New restaurant workflow

1. Create a repository from this GitHub template
2. Replace everything inside `public/restaurant/`
3. Edit `public/restaurant/menu.json`
4. Add logo, cover, dish photos, and optional PDFs
5. Run checks locally:

```bash
npm run validate
npm test
npm run build
```

6. Push to `main` — GitHub Actions validates, tests, builds, and deploys to
   GitHub Pages
7. Generate a QR code for the permanent URL:

```bash
npm run generate:qr -- --url=https://username.github.io/repository-name/
```

## What to replace for a new restaurant

Only `public/restaurant/`:

```
public/restaurant/
├── menu.json
└── assets/
    ├── logo.svg
    ├── cover.webp
    ├── placeholder.webp
    ├── documents/
    └── dishes/
        └── {dish-id}.webp
```

## Commands

| Command                              | Description                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| `npm run dev`                        | Local development server                                                           |
| `npm run validate`                   | Validate `menu.json` and assets                                                    |
| `npm run build`                      | Validate, update meta, typecheck, build                                            |
| `npm test`                           | Run Vitest tests                                                                   |
| `npm run lint`                       | ESLint                                                                             |
| `npm run generate:qr -- --url=...`   | Create QR PNG/SVG in `output/`                                                     |
| `npm run optimize:images`            | Optional WebP optimization                                                         |
| `node scripts/create-demo-assets.js` | Create only missing sample assets; existing restaurant files are never overwritten |

## Documentation

- [MENU_FORMAT.md](./MENU_FORMAT.md) — `menu.json` contract
- [RESTAURANT_SETUP.md](./RESTAURANT_SETUP.md) — step-by-step restaurant onboarding
- [DEPLOYMENT.md](./DEPLOYMENT.md) — hosting notes and GitHub Pages limits

## GitHub Pages deployment

This template is configured for **GitHub Pages static hosting**:

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite
- No server, database, API, secrets, or environment variables required
- Production asset paths are relative, so project sites work from repository
  subpaths

GitHub Actions validates formatting, linting, tests, menu data, builds the site,
and publishes `dist/` to GitHub Pages.

## QR output

After deployment, generate QR files:

```bash
npm run generate:qr -- --url=https://your-public-url/
```

Files are written to:

- `output/qr-menu.svg`
- `output/qr-menu.png`

## Image preparation

Place restaurant photos in `public/restaurant/assets/dishes/`. Files already in
WebP format are optimized in place. JPG and PNG sources are converted to a WebP
file with the same basename, while the original source is preserved. If the WebP
target already exists, the converter skips it instead of overwriting it.

```bash
npm run optimize:images
```

The site favicon uses `public/restaurant/assets/logo.svg`, so replacing the
restaurant logo also updates the browser-tab icon.

## Template version

See [TEMPLATE_VERSION](./TEMPLATE_VERSION).
