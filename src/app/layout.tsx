import type { Metadata } from "next";
// 1. Import Font tulisan tangan (Indie Flower)
import { Indie_Flower, Inter } from "next/font/google";
import "./globals.css";

// --- IMPORT CSS SWIPER (TETAP ADA) ---
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
// -------------------------------------

const inter = Inter({ subsets: ["latin"] });

// 2. Setup Font Estetik
const indieFlower = Indie_Flower({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-handwriting', 
});

export const metadata: Metadata = {
  title: "Album Kenangan Angkatan",
  description: "Dibuat dengan Next.js & Google Drive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* --- BAGIAN PENTING YANG KURANG TADI --- */}
      <head>
        {/* Kita paksa browser ambil font Digital dari sini */}
        <link href="https://cdn.jsdelivr.net/npm/dseg@0.46.0/css/dseg.css" rel="stylesheet" />
      </head>
      {/* --------------------------------------- */}

      <body className={`${inter.className} ${indieFlower.variable}`}>
        {children}
      </body>
    </html>
  );
}