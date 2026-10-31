import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

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
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-ghost_white text-charcoal-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
