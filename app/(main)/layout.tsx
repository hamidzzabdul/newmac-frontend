import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CartProvider from "@/services/CartProvider";
import { AuthProvider } from "@/hooks/UseAuth";
import { Providers } from "@/services/QueryProvider";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://newmarkprimemeat.com"),
  title: {
    default: "Newmark Butchery",
    template: "%s | Newmark Butchery",
  },
  description:
    "Premium halal meat supplier in Nairobi offering fresh beef, goat, and lamb with reliable delivery.",
  applicationName: "Newmark Butchery",
  authors: [{ name: "Newmark Butchery" }],
  creator: "Newmark Butchery",
  publisher: "Newmark Butchery",
  robots: {
    index: true,
    follow: true,
  },
  category: "food",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Providers>
            <CartProvider>
              <NavBar />

              <main className="flex-1">{children}</main>

              <Toaster />
              <Footer />
            </CartProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
