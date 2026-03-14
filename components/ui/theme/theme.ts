export const VISUAL_THEMES = ["warm-premium", "liquid-glass"] as const;
export const COLOR_MODES = ["light", "dark"] as const;

export type VisualTheme = (typeof VISUAL_THEMES)[number];
export type ColorMode = (typeof COLOR_MODES)[number];

export interface ThemeState {
  visualTheme: VisualTheme;
  colorMode: ColorMode;
}

export const DEFAULT_THEME_STATE: ThemeState = {
  visualTheme: "warm-premium",
  colorMode: "light"
};

export const THEME_STORAGE_KEYS = {
  visualTheme: "lalalaunchboard.visual-theme",
  colorMode: "lalalaunchboard.color-mode"
} as const;

export function isVisualTheme(value: string | null | undefined): value is VisualTheme {
  return VISUAL_THEMES.includes(value as VisualTheme);
}

export function isColorMode(value: string | null | undefined): value is ColorMode {
  return COLOR_MODES.includes(value as ColorMode);
}

export function buildThemeInitScript() {
  return `
    (function () {
      try {
        var root = document.documentElement;
        var visualKey = "${THEME_STORAGE_KEYS.visualTheme}";
        var modeKey = "${THEME_STORAGE_KEYS.colorMode}";
        var visual = window.localStorage.getItem(visualKey);
        var mode = window.localStorage.getItem(modeKey);
        var normalizedVisual = visual === "liquid-glass" ? visual : "warm-premium";
        var normalizedMode = mode === "dark" || mode === "light" ? mode : "light";
        root.dataset.visualTheme = normalizedVisual;
        root.dataset.colorMode = normalizedMode;
        root.style.colorScheme = normalizedMode;
      } catch (error) {}
    })();
  `;
}
