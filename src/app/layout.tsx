import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "L68 Navigator — orientarsi verso il lavoro",
  description:
    "Un percorso chiaro e accessibile per orientarsi tra collocamento mirato, documenti e ricerca di lavoro.",
  applicationName: "L68 Navigator",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f7fb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
