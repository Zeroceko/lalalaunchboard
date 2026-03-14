export const VISUAL_THEMES = ["warm-premium", "liquid-glass"] as const;
export const COLOR_MODES = ["light", "dark"] as const;

export type VisualTheme = (typeof VISUAL_THEMES)[number];
export type ColorMode = (typeof COLOR_MODES)[number];

export interface ThemeState {
  visualTheme: VisualTheme;
  colorMode: ColorMode;
}

export const VISUAL_THEME_OPTIONS = [
  {
    value: "warm-premium",
    label: "Warm Premium",
    description: "Daha sicak, sade ve production-ready varsayilan tema."
  },
  {
    value: "liquid-glass",
    label: "Liquid Glass",
    description: "Daha parlak, katmanli ve deneysel gorunum paketi."
  }
] as const;

export const COLOR_MODE_OPTIONS = [
  {
    value: "light",
    label: "Acik mod",
    description: "Gunluk kullanim icin daha ferah ve okunakli gorunum."
  },
  {
    value: "dark",
    label: "Koyu mod",
    description: "Daha dusuk isikta kontrasti koruyan gorunum."
  }
] as const;

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

function normalizeVisualTheme(value: string | null | undefined): VisualTheme {
  return isVisualTheme(value) ? value : DEFAULT_THEME_STATE.visualTheme;
}

function normalizeColorMode(value: string | null | undefined): ColorMode {
  return isColorMode(value) ? value : DEFAULT_THEME_STATE.colorMode;
}

export function getStoredThemeState(): ThemeState {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_STATE;
  }

  try {
    return {
      visualTheme: normalizeVisualTheme(
        window.localStorage.getItem(THEME_STORAGE_KEYS.visualTheme)
      ),
      colorMode: normalizeColorMode(
        window.localStorage.getItem(THEME_STORAGE_KEYS.colorMode)
      )
    };
  } catch {
    return DEFAULT_THEME_STATE;
  }
}

export function applyThemeState(state: ThemeState) {
  const visualTheme = normalizeVisualTheme(state.visualTheme);
  const colorMode = normalizeColorMode(state.colorMode);

  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.dataset.visualTheme = visualTheme;
    root.dataset.colorMode = colorMode;
    root.style.colorScheme = colorMode;
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEYS.visualTheme, visualTheme);
      window.localStorage.setItem(THEME_STORAGE_KEYS.colorMode, colorMode);
    } catch {}
  }
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
