'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Caught by error.tsx boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Something went wrong!</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred on this page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
