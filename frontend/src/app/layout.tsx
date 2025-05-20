import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pharma Care - Hệ thống quản lý nhà thuốc",
  description: "Hệ thống quản lý nhà thuốc Pharma Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <header className="bg-gray-100 text-gray-800 py-4 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">Pharma Care</Link>
              <Navigation />
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <footer className="bg-secondary text-white py-4 mt-8">
            <div className="container mx-auto px-4 text-center">
              <p>© 2024 Pharma Care - Hệ thống quản lý nhà thuốc</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
