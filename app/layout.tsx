import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminNav from "../components/AdminNav";

export const metadata: Metadata = {
  title: "CareerPath.lk - Your Journey to Success",
  description:
    "Discover your ideal career path with our quick 2-minute career assessment quiz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-yellow-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <AdminNav />
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
