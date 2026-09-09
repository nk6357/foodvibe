import { describe, expect, it } from "vitest";
import {
  buildThemeVariables,
  contrastRatio,
  mixRgb,
  readableTextColor,
  relativeLuminance,
  rgbArrayToCss,
} from "@/utils/color";

describe("color utilities", () => {
  it("converts rgb array to css", () => {
    expect(rgbArrayToCss([44, 110, 89])).toBe("rgb(44, 110, 89)");
  });

  it("calculates relative luminance", () => {
    expect(relativeLuminance([255, 255, 255])).toBeGreaterThan(
      relativeLuminance([0, 0, 0]),
    );
  });

  it("calculates contrast ratio", () => {
    const ratio = contrastRatio([255, 255, 255], [0, 0, 0]);
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("picks readable text for light background", () => {
    expect(readableTextColor([247, 246, 242])).toEqual([24, 24, 27]);
  });

  it("picks readable text for dark background", () => {
    expect(readableTextColor([20, 24, 28])).toEqual([255, 255, 255]);
  });

  it("mixes rgb colors", () => {
    expect(mixRgb([0, 0, 0], [255, 255, 255], 0.5)).toEqual([128, 128, 128]);
  });

  it("builds accessible theme variables", () => {
    const theme = buildThemeVariables([44, 110, 89], [247, 246, 242]);
    expect(theme["--color-accent"]).toBe("rgb(44, 110, 89)");
    expect(theme["--color-background"]).toBe("rgb(247, 246, 242)");
    expect(theme["--color-text"]).toMatch(/^rgb\(/);
    expect(theme["--radius-card"]).toBe("16px");
  });
});
