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
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  title: 'OpenSolve NG | Multimodal Gemma 4 study engine',
  description: 'Nigeria\'s First Open-Source Multimodal Learning Platform. Solve handwritten past questions instantly.',
  keywords: ['Gemma 4', 'AI Tutor', 'Nigerian Universities', 'Past Questions', 'Open Source', 'Hacktoberfest'],
  authors: [{ name: 'Majeed Abdulwali' }],
  metadataBase: new URL('https://opensolve-ng.vercel.app'),
  
  openGraph: {
    title: 'OpenSolve NG | Multimodal AI Engine',
    description: 'Decode handwritten past questions instantly with Gemma 4. Upload your handouts and chat live with our open-source tutor.',
    url: 'https://opensolve-ng.vercel.app', 
    siteName: 'OpenSolve NG',
    images: [
      {
        url: 'https://opensolve-ng.vercel.app/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'OpenSolve NG Powered by Gemma 4',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'OpenSolve NG | Multimodal AI Engine',
    description: 'Decode handwritten past questions instantly with Gemma 4.',
    images: ['https://opensolve-ng.vercel.app/og-image.jpg'], 
  },
  
  icons: {
    icon: [
      { url: '/favicon.jpg', type: 'image/jpeg' },
    ],
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-zinc-950 text-zinc-100 antialiased overflow-x-hidden w-full m-0 p-0 box-border`}>
        {children}
      </body>
    </html>
  );
}
