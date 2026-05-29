import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading your career path...
        </p>
      </div>
    </div>
  );
}
