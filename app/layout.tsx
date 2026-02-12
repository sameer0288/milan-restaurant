import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Milan Restaurant Makrana - Family Restaurant & Fast Food Hub",
  description: "Milan Restaurant in Makrana offers delicious North Indian, South Indian, Chinese, and Fast Food. Pure veg options available. Rated 4.3⭐ by 729 customers. Order now on WhatsApp!",
  keywords: "Milan Restaurant, Makrana restaurant, family restaurant, fast food, North Indian, South Indian, Chinese food, vegetarian food, Rajasthan restaurant",
  openGraph: {
    title: "Milan Restaurant Makrana",
    description: "Family Restaurant & Fast Food Hub in Makrana",
    type: "website",
  },
};

import { ThemeProvider } from "@/lib/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <CartProvider>
            <CartDrawer />
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
