import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrafficPulse AI",
  description: "See the road ahead before you reach it.",
  icons: {
    icon: [
      { url: '/brand/favicon-app-icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-app-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-app-icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/brand/favicon-app-icon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/brand/favicon-app-icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/brand/favicon-app-icon-180.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
