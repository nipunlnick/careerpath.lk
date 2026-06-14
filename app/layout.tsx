import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminNav from "../components/AdminNav";
import { PwaRegistry } from "@/components/PwaRegistry";
import { Toaster } from "sonner";

const AuroraWrapper = dynamic(() => import("@/components/AuroraWrapper"), { ssr: false });

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "CareerPath.lk | Dynamic Career Guidance & Roadmap Explorer",
  description:
    "Empowering Sri Lankan students to navigate their future with free, AI-powered, and locally-tailored step-by-step career path roadmaps, skills analysis, and real-time market demand insights.",
  keywords: [
    "career guidance Sri Lanka",
    "career roadmaps",
    "career assessment quiz",
    "vocational training",
    "OL exam guide",
    "AL exam guide",
    "software engineering roadmap",
    "AI career path finder",
    "job market trends Sri Lanka",
    "higher education guides"
  ],
  authors: [{ name: "Nipun Lakshitha (Nick)" }, { name: "Voxicore" }],
  creator: "Nipun Lakshitha (Nick)",
  publisher: "Voxicore",
  alternates: {
    canonical: "https://careerpath.lk",
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "https://careerpath.lk",
    siteName: "CareerPath.lk",
    title: "CareerPath.lk | Dynamic Career Guidance & Roadmap Explorer",
    description: "Discover your ideal career path with our quick 2-minute career assessment quiz. Get personalized roadmaps, local salary guidelines, and real-time job demand stats.",
    images: [
      {
        url: "https://careerpath.lk/cplogo.png",
        width: 1200,
        height: 630,
        alt: "CareerPath.lk - AI-Driven Career Mapping in Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerPath.lk | Dynamic Career Guidance & Roadmap Explorer",
    description: "Personalized step-by-step career paths and real-time market insights for Sri Lankan students. Free AI-powered assessments.",
    images: ["https://careerpath.lk/cplogo.png"],
    creator: "@CareerPathLK",
    site: "@CareerPathLK",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "name": "CareerPath.lk",
        "url": "https://careerpath.lk",
        "logo": "https://careerpath.lk/cplogo.png",
        "description": "Sri Lanka's leading career guidance and mock exam platform, offering step-by-step roadmaps, AI-driven skills analysis, and real-time market insights.",
        "inLanguage": "en-LK",
        "offers": {
          "@type": "Offer",
          "name": "Quick Career Quiz & In-Depth Assessments",
          "price": "0",
          "priceCurrency": "LKR",
          "category": "Educational Assessment"
        }
      },
      {
        "@type": "WebSite",
        "name": "CareerPath.lk",
        "url": "https://careerpath.lk",
        "description": "Dynamic Career Guidance & Roadmap Explorer",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://careerpath.lk/roadmaps?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-yellow-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300`}
      >
        <Toaster theme="dark" position="bottom-right" richColors />
        <PwaRegistry />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="fixed inset-0 pointer-events-none">
          <AuroraWrapper />
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

