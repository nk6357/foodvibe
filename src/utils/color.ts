import type { RgbColor } from "@/schema/menuTypes";

export function rgbArrayToCss([r, g, b]: RgbColor): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function relativeLuminance([r, g, b]: RgbColor): number {
  const channels = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

export function contrastRatio(colorA: RgbColor, colorB: RgbColor): number {
  const lumA = relativeLuminance(colorA);
  const lumB = relativeLuminance(colorB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function readableTextColor(background: RgbColor): RgbColor {
  const white: RgbColor = [255, 255, 255];
  const dark: RgbColor = [24, 24, 27];
  return contrastRatio(background, white) >= contrastRatio(background, dark)
    ? white
    : dark;
}

export function mixRgb(a: RgbColor, b: RgbColor, ratio: number): RgbColor {
  const weight = Math.min(Math.max(ratio, 0), 1);
  return [
    Math.round(a[0] + (b[0] - a[0]) * weight),
    Math.round(a[1] + (b[1] - a[1]) * weight),
    Math.round(a[2] + (b[2] - a[2]) * weight),
  ];
}

export function adjustBrightness(color: RgbColor, amount: number): RgbColor {
  return color.map((channel) =>
    Math.min(255, Math.max(0, Math.round(channel + amount))),
  ) as RgbColor;
}

export interface ThemeVariables {
  "--color-accent": string;
  "--color-accent-hover": string;
  "--color-accent-pressed": string;
  "--color-on-accent": string;
  "--color-background": string;
  "--color-surface": string;
  "--color-surface-muted": string;
  "--color-text": string;
  "--color-text-muted": string;
  "--color-border": string;
  "--color-focus": string;
  "--color-overlay": string;
  "--shadow-card": string;
  "--radius-card": string;
}

export function buildThemeVariables(
  accent: RgbColor,
  background: RgbColor,
  cardStyle: "rounded" | "sharp" = "rounded",
): ThemeVariables {
  const isDarkBackground = relativeLuminance(background) < 0.35;
  const text = readableTextColor(background);
  const onAccent = readableTextColor(accent);
  const surfaceBase: RgbColor = isDarkBackground ? [255, 255, 255] : [0, 0, 0];
  const surface = mixRgb(background, surfaceBase, isDarkBackground ? 0.08 : 0.03);
  const surfaceMuted = mixRgb(background, surfaceBase, isDarkBackground ? 0.14 : 0.06);
  const border = mixRgb(background, surfaceBase, isDarkBackground ? 0.22 : 0.12);
  const textMuted = mixRgb(text, background, 0.45);
  const accentHover = adjustBrightness(accent, isDarkBackground ? 18 : -12);
  const accentPressed = adjustBrightness(accent, isDarkBackground ? 28 : -22);
  const focus = mixRgb(accent, text, 0.35);

  return {
    "--color-accent": rgbArrayToCss(accent),
    "--color-accent-hover": rgbArrayToCss(accentHover),
    "--color-accent-pressed": rgbArrayToCss(accentPressed),
    "--color-on-accent": rgbArrayToCss(onAccent),
    "--color-background": rgbArrayToCss(background),
    "--color-surface": rgbArrayToCss(surface),
    "--color-surface-muted": rgbArrayToCss(surfaceMuted),
    "--color-text": rgbArrayToCss(text),
    "--color-text-muted": rgbArrayToCss(textMuted),
    "--color-border": rgbArrayToCss(border),
    "--color-focus": rgbArrayToCss(focus),
    "--color-overlay": isDarkBackground ? "rgba(0, 0, 0, 0.55)" : "rgba(15, 15, 15, 0.45)",
    "--shadow-card": isDarkBackground
      ? "0 1px 2px rgba(0, 0, 0, 0.35)"
      : "0 1px 2px rgba(15, 15, 15, 0.06)",
    "--radius-card": cardStyle === "rounded" ? "16px" : "4px",
  };
}

export function applyThemeVariables(
  accent: RgbColor,
  background: RgbColor,
  cardStyle: "rounded" | "sharp" = "rounded",
): void {
  const variables = buildThemeVariables(accent, background, cardStyle);
  const root = document.documentElement;

  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value);
  }
}
