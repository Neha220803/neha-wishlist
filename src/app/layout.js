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

export const metadata = {
  title: "Neha Wishlist Tracker",
  description:
    "A visual progress tracker created for myself to stay motivated while saving for the things I want to buy",

  // PWA Icons
  icons: {
    icon: [
      { url: "/logo-bg.png" },
      { url: "/logo-bg.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-bg.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo-bg.png", sizes: "180x180", type: "image/png" }],
  },

  // PWA Manifest
  manifest: "/manifest.json",

  // Theme color for PWA (adjust to match your app's primary color)
  themeColor: "#8b5cf6", // Purple - change to your brand color

  // iOS PWA settings
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wishlist",
  },

  // Open Graph for social sharing
  openGraph: {
    title: "Neha Wishlist Tracker",
    description:
      "A visual progress tracker created for myself to stay motivated while saving for the things I want to buy",
    url: "https://neha-wishlist.vercel.app/",
    siteName: "Neha Wishlist Tracker",
    images: [
      {
        url: "https://neha-wishlist.vercel.app/logo-bg.png",
        width: 1200,
        height: 630,
        alt: "Neha Wishlist Tracker Logo",
      },
    ],
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Neha Wishlist Tracker",
    description:
      "A visual progress tracker created for myself to stay motivated while saving for the things I want to buy",
    images: ["https://neha-wishlist.vercel.app/logo-bg.png"],
  },

  // Mobile optimization
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Additional PWA meta tags */}
        <meta name="application-name" content="Wishlist Tracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Wishlist" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
