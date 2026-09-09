# Restaurant setup guide

Use this checklist when creating a menu site from the template.

## 1. Create repository

Create a new repository from the GitHub template. Do not edit application source code for branding — only replace `public/restaurant/`.

## 2. Prepare menu.json

Copy the sample file and adapt it:

- Set restaurant name, contacts, and timezone
- Choose two RGB colors for `theme.accent` and `theme.background`
- Enable only the features you need
- Add categories and dishes in display order

See [MENU_FORMAT.md](./MENU_FORMAT.md) for the full contract.

## 3. Add assets

```
public/restaurant/assets/
├── logo.svg
├── cover.webp
├── placeholder.webp
├── documents/
│   ├── menu.pdf
│   ├── offer.pdf
│   └── privacy.pdf
└── dishes/
    ├── 1001.webp
    └── ...
```

Rules:

- Dish filenames must match dish IDs exactly
- Do not leave extra dish images without a menu item
- Keep images under 5 MB each
- Use WebP for photos when possible

Optional optimization:

```bash
npm run optimize:images
```

## 4. Validate locally

```bash
node scripts/create-demo-assets.js   # only for first clone if demo images missing
npm run validate
npm test
npm run build
npm run preview
```

Fix every validation error before pushing.

## 5. Deploy

Push to `main`. GitHub Actions runs validation, lint, tests, and build, then publishes `dist/` to GitHub Pages.

Configure Pages in repository settings:

- Source: **GitHub Actions**

## 6. Generate QR code

Use the final public URL:

```bash
npm run generate:qr -- --url=https://username.github.io/repository-name/
```

Print `output/qr-menu.png` or use `output/qr-menu.svg`.

## Legal documents

If you enable `legal.enabled`, provide your own PDF documents. The template is not legal advice — have a lawyer review privacy policy and public offer texts before publishing.

## Map embed

`restaurant.mapUrl` must be a safe HTTPS embed URL. The map iframe loads only after the visitor clicks “Show map”.
