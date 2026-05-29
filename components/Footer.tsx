import React from "react";
import Link from "next/link";
import { Mail, Globe, Heart } from "./icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Credit Column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              CareerPath<span className="text-primary">.lk</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              Your Journey to Success Starts Here 🇱🇰. Empowering Sri Lankan
              students with AI-powered career guidance.
            </p>
          </div>

          {/* Built By Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              Built By Voxicore
            </h3>
            <div className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-sm text-gray-500 hover:text-primary transition-colors inline-block w-fit font-medium"
              >
                About Our Team
              </Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info.voxicore@gmail.com"
                  className="group flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>info.voxicore@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.voxicore.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-primary/10 transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span>www.voxicore.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()} CareerPath.lk. All rights
              reserved.
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1 flex-wrap">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse inline" />
              <span>by</span>

              {/* Voxicore inline link with tooltip */}
              <span className="relative group inline-flex items-center">
                <a
                  href="https://www.voxicore.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Voxicore
                </a>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-gray-800 dark:border-gray-700 whitespace-nowrap z-50">
                  Need a website or system?
                </span>
              </span>

              <span className="mx-1 text-gray-300 dark:text-gray-700">|</span>
              <span>Idea by</span>

              {/* Nick inline link with tooltip */}
              <span className="relative group inline-flex items-center">
                <a
                  href="https://nipunlakshitha.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  Nick (Nipun Lakshitha)
                </a>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-gray-800 dark:border-gray-700 whitespace-nowrap z-50">
                  Need a website or system?
                </span>
              </span>
            </div>
          </div>

          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center md:justify-end">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-primary transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-gray-500 hover:text-primary transition-colors whitespace-nowrap"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="text-xs text-gray-500 hover:text-primary transition-colors whitespace-nowrap"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
