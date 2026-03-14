import type { Metadata } from "next";

import "@/app/globals.css";
import "@/app/themes.css";

import { ToastProvider } from "@/components/shared/ToastProvider";
import {
  buildThemeInitScript,
  DEFAULT_THEME_STATE
} from "@/components/ui/theme/theme";

export const metadata: Metadata = {
  title: "Lalalaunchboard",
  description: "Prep, launch, and grow — all on one board."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      data-visual-theme={DEFAULT_THEME_STATE.visualTheme}
      data-color-mode={DEFAULT_THEME_STATE.colorMode}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <script dangerouslySetInnerHTML={{ __html: buildThemeInitScript() }} />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
