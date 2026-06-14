import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-3xl mb-8 ring-1 ring-gray-900/5 dark:ring-white/10">
        <SearchX className="w-20 h-20 text-primary animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been moved
        or deleted, or perhaps the URL is incorrect.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/5 shadow-primary/25 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <ArrowLeft className="w-5 h-5" />
        Return to Home
      </Link>
    </div>
  );
}
