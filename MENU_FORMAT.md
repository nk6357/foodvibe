# menu.json format

The only source of menu data is `public/restaurant/menu.json`.

## Top-level structure

```json
{
  "schemaVersion": 1,
  "restaurant": {},
  "theme": {},
  "features": {},
  "legal": {},
  "seo": {},
  "downloads": [],
  "categories": []
}
```

## restaurant

| Field              | Required | Notes                                           |
| ------------------ | -------- | ----------------------------------------------- |
| `name`             | yes      | Restaurant name                                 |
| `shortDescription` | no       | Shown in header                                 |
| `description`      | no       | Hero section                                    |
| `currency`         | no       | Default `RUB`                                   |
| `locale`           | no       | Default `ru-RU`                                 |
| `timeZone`         | yes      | Valid IANA timezone                             |
| `phone`            | no       | Displayed in contacts                           |
| `email`            | no       | Displayed in contacts                           |
| `address`          | no       |                                                 |
| `workingHours`     | no       |                                                 |
| `mapUrl`           | no       | HTTPS embed URL only; loaded after user consent |
| `socialLinks`      | no       | HTTPS URLs only                                 |

## theme

```json
"theme": {
  "accent": [44, 110, 89],
  "background": [247, 246, 242],
  "cardStyle": "rounded",
  "imageStyle": "cover",
  "density": "comfortable"
}
```

- `accent` and `background` are RGB arrays `[0-255, 0-255, 0-255]`
- All other colors are computed automatically for accessibility

## features

```json
"features": {
  "search": true,
  "categoryNavigation": true,
  "dishModal": true,
  "contacts": true,
  "downloadableMenu": false,
  "showDescriptions": true,
  "showWeights": true,
  "showLabels": true,
  "showAllergens": true,
  "showSpiceLevel": true,
  "showUnavailableItems": false
}
```

If a feature is `false`, the UI hides it completely.

## Dish images

Do not store image paths in JSON. The browser resolves:

```
restaurant/assets/dishes/{dish.id}.webp
```

Set `"hasImage": false` when no photo exists.

For sharp rendering on high-density phone and tablet screens:

- minimum accepted resolution: `800×600` pixels;
- recommended resolution: at least `1200×900` pixels;
- preferred upload size: `1600×1200` pixels;
- format: WebP;
- maximum file size: 5 MB.

The optimization command preserves existing WebP files up to 2000 pixels on the
longest side instead of recompressing them. Larger images and JPG/PNG sources are
converted to high-quality WebP with a maximum edge of 2000 pixels.

## categories

- Category order follows JSON order
- Category `id` must be unique, lowercase, `[a-z0-9-]`
- Dish `id` must be unique across the whole menu
- `price` ≥ 0
- `oldPrice` is `null` or greater than `price`
- `spiceLevel` is `0`–`3`
- HTML is forbidden in all text fields

## legal (optional, static documents only)

```json
"legal": {
  "enabled": true,
  "version": "2026-01-01",
  "organizationName": "LLC Example",
  "privacyEmail": "privacy@example.com",
  "offerDocument": "restaurant/assets/documents/offer.pdf",
  "privacyDocument": "restaurant/assets/documents/privacy.pdf",
  "cookieNotice": {
    "enabled": true,
    "text": "The site may use only necessary technical cookies and local storage for correct operation. Analytics and advertising cookies are not used.",
    "buttonLabel": "OK",
    "privacyLinkLabel": "Learn more"
  }
}
```

Used for footer links and the optional notice about necessary technical cookies
and local storage. Acknowledgement is stored locally in the visitor's browser.
The template does not include analytics, advertising cookies, forms, orders, or
reservation-related consent flows.

## downloads

Required when `features.downloadableMenu` is `true`.

```json
{
  "id": "main-menu",
  "title": "Restaurant menu",
  "description": "Full PDF menu",
  "file": "restaurant/assets/documents/menu.pdf"
}
```

## Validation

Run:

```bash
npm run validate
```

Validation checks schema, IDs, prices, assets, orphan images, file sizes, and suspicious secret patterns in `public/restaurant/`.
