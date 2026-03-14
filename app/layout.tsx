import type { Metadata } from "next";

import "@/app/globals.css";

import { ToastProvider } from "@/components/shared/ToastProvider";

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
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
