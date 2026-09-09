# Deployment guide

## Static-only architecture

This template produces a static site in `dist/`. No server-side runtime is required.

Supported hosts:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel static hosting
- Any object storage + CDN

No environment variables, SMTP, database, or API endpoints are needed.

## GitHub Pages

GitHub Pages can publish the static QR menu.

Steps:

1. Enable GitHub Pages with source **GitHub Actions**
2. Push to `main`
3. Workflow builds and deploys automatically

The Vite `base` is set to `./`, so assets work on project sites such as:

```
https://username.github.io/repository-name/
```

### GitHub Pages limitations

1. GitHub Pages can host static QR menus technically.
2. GitHub Pages does **not** run Node.js backends.
3. GitHub Pages has restrictions on commercial and SaaS usage.
4. Review current [GitHub Pages terms and limits](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) before paid/commercial projects.
5. Even if the repository is private, published Pages files are public.
6. Everything under `public/restaurant/` is publicly accessible.

## Vercel

You can deploy `dist/` as a static site. Vercel Hobby is intended for non-commercial use; commercial projects may require Vercel Pro. Check current pricing terms before production use.

## Cloudflare Pages

Cloudflare Pages is a common alternative for commercial static hosting. Connect the repository and set:

- Build command: `npm run build`
- Output directory: `dist`

Run `node scripts/create-demo-assets.js` in CI only if demo assets are not committed.

## Subpath-safe assets

Never hardcode absolute paths like `/restaurant/menu.json`. Always use `assetPath()` so the site works on subpaths.

## QR files

QR codes are generated locally or in CI:

```bash
npm run generate:qr -- --url=https://your-public-url/
```

Output:

- `output/qr-menu.svg`
- `output/qr-menu.png`

Use the permanent public URL, not preview or commit-specific URLs.

## Terms change

Hosting provider terms and limits change over time. Verify the current plan before launching a commercial restaurant menu.
