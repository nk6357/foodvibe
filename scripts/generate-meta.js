import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const menuPath = path.join(root, "public/restaurant/menu.json");
const indexPath = path.join(root, "index.html");

const menu = JSON.parse(fs.readFileSync(menuPath, "utf8"));
const title = menu.seo?.title ?? menu.restaurant.name;
const description =
  menu.seo?.description ??
  menu.restaurant.shortDescription ??
  menu.restaurant.description ??
  "QR menu";

const [r, g, b] = menu.theme.accent;
const themeColor = `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;

let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
html = html.replace(
  /<meta name="description" content=".*?" \/>/,
  `<meta name="description" content="${escapeAttr(description)}" />`,
);
html = html.replace(
  /<meta name="theme-color" content=".*?" \/>/,
  `<meta name="theme-color" content="${themeColor}" />`,
);

const robotsPattern = /\s*<meta name="robots" content="[^"]*" \/>/;

if (!menu.seo?.index) {
  if (robotsPattern.test(html)) {
    html = html.replace(
      robotsPattern,
      '\n    <meta name="robots" content="noindex, nofollow" />',
    );
  } else {
    html = html.replace(
      "</head>",
      '    <meta name="robots" content="noindex, nofollow" />\n  </head>',
    );
  }
} else {
  html = html.replace(robotsPattern, "");
}

fs.writeFileSync(indexPath, html, "utf8");
console.log("index.html meta updated.");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}
