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
  icons: {
    icon: "/logo-bg.png",
  },
  openGraph: {
    title: "Neha Wishlist Tracker",
    description:
      "A visual progress tracker created for myself to stay motivated while saving for the things I want to buy",
    url: "https://neha-wishlist.vercel.app/",
    siteName: "Neha Wishlist Tracker",
    images: [
      {
        url: "https://neha-wishlist.vercel.app/logo-bg.png", // Use absolute URL
        width: 1200,
        height: 630,
        alt: "Neha Wishlist Tracker Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neha Wishlist Tracker",
    description:
      "A visual progress tracker created for myself to stay motivated while saving for the things I want to buy",
    images: ["https://neha-wishlist.vercel.app/logo-bg.png"], // Use absolute URL
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
