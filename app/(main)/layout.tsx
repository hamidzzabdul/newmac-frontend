import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import NavBar from "@/components/NavBar"; // client component
import Footer from "@/components/Footer"; // can be server
import CartProvider from "@/services/CartProvider"; // client component
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/services/QueryProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Newmac Butchery",
  description: "Best meat supplier in Nairobi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <CartProvider>
              <NavBar />
              {children}
              <Toaster />
              <Footer />
            </CartProvider>
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
