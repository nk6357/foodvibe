# Deployment guide

## Static-only architecture

This template produces a static site in `dist/`. No server-side runtime is required.

Primary host:

- Vercel static hosting

No environment variables, SMTP, database, or API endpoints are needed.

## Vercel

Import the GitHub repository into Vercel and use these settings:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install` or the Vercel default

The same settings are committed in `vercel.json`. No environment variables are
required. Each push to `main` creates a production deployment when the Vercel Git
integration is enabled; other branches and pull requests create preview
deployments.

GitHub Actions performs validation, formatting checks, tests, and a production
build. It does not publish the site; Vercel handles deployment.

Vercel Hobby is intended for non-commercial use; commercial projects may require
Vercel Pro. Check the current Vercel terms before production use.

## Other static hosts

The generated `dist/` directory can also be hosted on another static hosting
service or Russian web server. Use:

- Build command: `npm run build`
- Output directory: `dist`

Do not generate demo assets in production CI. Commit the real restaurant assets
before deployment and let `npm run validate` stop the build when anything is missing.

## Asset paths

Never hardcode deployment-specific hostnames. Continue using `assetPath()` for
menu data, documents, logos, and dish images.

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
