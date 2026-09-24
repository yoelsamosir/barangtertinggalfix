import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import { APLIKASI } from "@/lib/aplikasi";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // Hanya dipakai sesekali (kode/nomor), tidak perlu dimuat lebih awal.
  preload: false,
});

export const metadata: Metadata = {
  title: { default: APLIKASI.nama, template: `%s · ${APLIKASI.nama}` },
  description: APLIKASI.deskripsi,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b11e21",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // CSP ber-nonce (proxy.ts) hanya berlaku bila halaman dirender per request.
  // Tanpa ini halaman statis akan memuat script tanpa nonce dan diblokir.
  await connection();

  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
