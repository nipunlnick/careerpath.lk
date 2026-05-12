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
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              CareerPath<span className="text-primary">.lk</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              Your Journey to Success Starts Here 🇱🇰. Empowering Sri Lankan students with AI-powered career guidance.
            </p>
            <div className="pt-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
                Ownership
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                GovPrep is created by <span className="font-semibold text-gray-900 dark:text-white">Nipun Lakshitha</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                & maintained by <span className="font-semibold text-primary">Voxicore</span>
              </p>
            </div>
          </div>

          {/* Built By Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              Built By Voxicore
            </h3>
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Voxicore
              </p>
              <Link 
                href="/about" 
                className="text-sm text-gray-500 hover:text-primary transition-colors"
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
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} CareerPath.lk. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-gray-500 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
