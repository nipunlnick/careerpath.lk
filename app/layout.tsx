import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminNav from "../components/AdminNav";
import Aurora from "@/components/Aurora";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerPath.lk - Your Journey to Success",
  description:
    "Discover your ideal career path with our quick 2-minute career assessment quiz.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-yellow-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300`}
      >
        <div className="fixed inset-0 pointer-events-none">
          <Aurora
            colorStops={["#3b82f6", "#22c55e", "#06b6d4"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <Providers>
          <div className="flex flex-col min-h-screen relative z-10">
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
