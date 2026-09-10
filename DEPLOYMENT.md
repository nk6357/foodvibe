# Deployment guide

## Static-only architecture

This template produces a static site in `dist/`. No server-side runtime is required.

Primary host:

- GitHub Pages

No environment variables, SMTP, database, or API endpoints are needed.

## GitHub Pages

GitHub Pages publishes the menu automatically through GitHub Actions.

Steps:

1. Open repository **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push changes to `main`.
4. Wait for the `Deploy static QR menu` workflow to finish.

The workflow validates formatting, menu data, linting and tests before publishing
the generated `dist/` directory.

The production Vite `base` is relative, so assets work on project URLs such as:

```text
https://username.github.io/repository-name/
```

## Other static hosts

The generated `dist/` directory can also be hosted on another static hosting
service or Russian web server. Use:

- Build command: `npm run build`
- Output directory: `dist`

Do not generate demo assets in production CI. Commit the real restaurant assets
before deployment and let `npm run validate` stop the build when anything is missing.

## Asset paths

Never hardcode root paths such as `/restaurant/menu.json`. Continue using
`assetPath()` so menu data, documents, logos, and dish images work from the
repository subpath.

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
