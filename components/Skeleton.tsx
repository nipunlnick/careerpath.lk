import React from "react";

interface SkeletonBaseProps {
  className?: string;
}

export const SkeletonBase: React.FC<SkeletonBaseProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded ${className}`}
      style={{
        backgroundSize: "200% 100%",
        animation: "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    />
  );
};

export const SkeletonCircle: React.FC<SkeletonBaseProps & { size?: string }> = ({
  className = "",
  size = "w-12 h-12",
}) => {
  return <SkeletonBase className={`rounded-full ${size} ${className}`} />;
};

interface SkeletonTextProps extends SkeletonBaseProps {
  lines?: number;
  gap?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  className = "",
  lines = 3,
  gap = "space-y-2",
}) => {
  const widths = ["w-3/4", "w-full", "w-5/6", "w-2/3", "w-4/5"];
  return (
    <div className={gap}>
      {Array.from({ length: lines }).map((_, idx) => (
        <SkeletonBase
          key={idx}
          className={`h-4 ${widths[idx % widths.length]} ${className}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-lg space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonCircle size="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <SkeletonBase className="h-5 w-1/3" />
          <SkeletonBase className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="pt-2 flex items-center justify-between">
        <SkeletonBase className="h-8 w-24 rounded-full" />
        <SkeletonBase className="h-8 w-32 rounded-full" />
      </div>
    </div>
  );
};

export const QuizResultsSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Header Loading State */}
      <div className="text-center space-y-4">
        <SkeletonBase className="h-10 w-2/3 mx-auto max-w-md rounded-lg" />
        <SkeletonBase className="h-4 w-1/2 mx-auto max-w-sm" />
      </div>

      {/* Radar Chart + Info Box Grid Loading State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/50 dark:bg-gray-850/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl">
        <div className="lg:col-span-6 flex justify-center">
          {/* Pulsing Radar Chart Mockup */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            <SkeletonCircle size="w-64 h-64 sm:w-72 sm:h-72" className="opacity-40" />
            <SkeletonCircle size="w-48 h-48 sm:w-56 sm:h-56" className="absolute opacity-60" />
            <SkeletonCircle size="w-32 h-32 sm:w-40 sm:h-40" className="absolute opacity-80" />
            <SkeletonCircle size="w-16 h-16 sm:w-20 sm:h-20" className="absolute" />
          </div>
        </div>
        <div className="lg:col-span-6 space-y-6">
          <SkeletonBase className="h-7 w-1/2 rounded" />
          <SkeletonText lines={4} />
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl space-y-2">
              <SkeletonBase className="h-4 w-1/2" />
              <SkeletonBase className="h-8 w-3/4 rounded-lg" />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl space-y-2">
              <SkeletonBase className="h-4 w-1/2" />
              <SkeletonBase className="h-8 w-3/4 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Careers Title */}
      <div className="space-y-3">
        <SkeletonBase className="h-8 w-48 rounded" />
        <SkeletonBase className="h-4 w-72" />
      </div>

      {/* Career Recommendations Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

export const RoadmapDetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-12">
      {/* Header and buttons skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16">
        <div className="space-y-3 w-full sm:w-2/3">
          <SkeletonBase className="h-10 w-3/4 rounded-xl" />
          <SkeletonBase className="h-6 w-1/3 rounded-full" />
        </div>
        <SkeletonBase className="h-10 w-36 rounded-lg" />
      </div>

      {/* Market insights block */}
      <div className="bg-yellow-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/50 space-y-6">
        <SkeletonBase className="h-7 w-48 mx-auto rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-3">
            <SkeletonBase className="h-5 w-1/3" />
            <SkeletonText lines={2} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-3">
            <SkeletonBase className="h-5 w-1/3" />
            <SkeletonText lines={2} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow md:col-span-2 space-y-3">
            <SkeletonBase className="h-5 w-1/4" />
            <div className="flex flex-wrap gap-2 pt-2">
              <SkeletonBase className="h-6 w-16 rounded-md" />
              <SkeletonBase className="h-6 w-20 rounded-md" />
              <SkeletonBase className="h-6 w-24 rounded-md" />
              <SkeletonBase className="h-6 w-14 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Alternative careers section loading */}
      <div className="space-y-6">
        <SkeletonBase className="h-7 w-64 mx-auto rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-150 dark:border-gray-700/50 space-y-4">
              <SkeletonBase className="h-6 w-2/3" />
              <SkeletonText lines={2} />
              <div className="flex gap-2">
                <SkeletonBase className="h-5 w-12 rounded" />
                <SkeletonBase className="h-5 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline loading section */}
      <div className="relative px-4 py-8 space-y-12">
        {/* Timeline bar */}
        <div className="absolute top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 left-6 md:left-1/2 -translate-x-1/2 opacity-50"></div>

        {Array.from({ length: 3 }).map((_, index) => {
          const isLeft = index % 2 !== 0;
          return (
            <div key={index} className={`relative md:flex ${isLeft ? "md:flex-row-reverse" : ""} md:items-center`}>
              {/* Spacer */}
              <div className="hidden md:block w-5/12"></div>

              {/* Icon Circle */}
              <div className="absolute md:relative z-10 left-6 md:left-0 -translate-x-1/2 md:translate-x-0">
                <SkeletonCircle size="w-12 h-12" />
              </div>

              {/* Card content skeleton */}
              <div className="ml-16 md:ml-0 md:w-5/12 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-750 shadow space-y-4">
                <div className="flex justify-between items-center">
                  <SkeletonBase className="h-6 w-1/2 rounded" />
                  <SkeletonBase className="h-5 w-16 rounded-full" />
                </div>
                <SkeletonText lines={2} />
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <SkeletonBase className="h-4 w-2/3" />
                    <SkeletonBase className="h-3 w-3/4" />
                    <SkeletonBase className="h-3 w-1/2" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonBase className="h-4 w-2/3" />
                    <SkeletonBase className="h-3 w-3/4" />
                    <SkeletonBase className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RoadmapsListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <SkeletonBase className="h-6 w-3/4 rounded-lg" />
              <SkeletonBase className="h-4 w-1/2 rounded" />
            </div>
            <SkeletonCircle size="w-8 h-8" />
          </div>
          <SkeletonText lines={2} />
          <div className="flex items-center gap-2 pt-2">
            <SkeletonBase className="h-6 w-16 rounded-md" />
            <SkeletonBase className="h-6 w-20 rounded-md" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <SkeletonBase className="h-4 w-24" />
            <SkeletonBase className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
