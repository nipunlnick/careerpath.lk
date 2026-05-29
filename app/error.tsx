"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global App Error [CareerPath]:", error);
    toast.error("An error occurred", {
      description: error.message || "Failed to load the page."
    });
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-10 rounded-[2rem] bg-white dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 shadow-xl max-w-lg w-full relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-20 w-20 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-8">
            <AlertCircle className="h-10 w-10" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            System Roadblock
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-10">
            Something went wrong while navigating your career path. Our technical team has been notified of the issue.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <button
              onClick={() => reset()}
              className="bg-primary hover:bg-primary/90 text-white w-full py-4 rounded-xl flex items-center justify-center gap-2 group font-bold transition-all"
            >
              <RefreshCw className="h-5 w-5 group-active:rotate-180 transition-transform" /> 
              Try Again
            </button>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
            >
              <Home className="h-5 w-5" /> 
              Return Home
            </Link>
          </div>

          {error.digest && (
            <p className="mt-8 text-[10px] text-gray-400 font-mono uppercase tracking-widest opacity-50">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
