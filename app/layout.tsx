import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'OpenSolve NG | Gemma 4 AI Platform',
  description: 'Nigeria\'s First Open-Source Multimodal Learning Platform. Solve handwritten past questions instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-zinc-950 text-zinc-100 antialiased overflow-x-hidden w-full m-0 p-0 box-border`}>
        {children}
      </body>
    </html>
  );
}
