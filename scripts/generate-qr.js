import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "output");

function parseArgs(argv) {
  const urlArg = argv.find((arg) => arg.startsWith("--url="));
  if (!urlArg) {
    console.error("Usage: npm run generate:qr -- --url=https://example.com/");
    process.exit(1);
  }
  return urlArg.slice("--url=".length);
}

function validateUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("URL must use HTTP or HTTPS");
  }

  return parsed.toString();
}

async function main() {
  const url = validateUrl(parseArgs(process.argv.slice(2)));
  await fs.mkdir(outputDir, { recursive: true });

  const svgPath = path.join(outputDir, "qr-menu.svg");
  const pngPath = path.join(outputDir, "qr-menu.png");

  await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 4,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  }).then((svg) => fs.writeFile(svgPath, svg, "utf8"));

  await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 4,
    width: 1024,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  }).then((buffer) => fs.writeFile(pngPath, buffer));

  console.log(`QR SVG: ${svgPath}`);
  console.log(`QR PNG: ${pngPath}`);
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
