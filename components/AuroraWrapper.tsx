"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Aurora from "./Aurora";

const AuroraWrapper: React.FC = () => {
  const pathname = usePathname() || "";

  // Map route pathnames to specific ambient brand colors
  const getColorStops = (): string[] => {
    if (pathname === "/") {
      return ["#3b82f6", "#22c55e", "#06b6d4"]; // Tech primary: Blue - Green - Cyan
    }
    if (pathname.includes("/quiz") || pathname.includes("/long-quiz")) {
      return ["#8b5cf6", "#ec4899", "#3b82f6"]; // Engaging/Inspiring: Purple - Pink - Blue
    }
    if (pathname.includes("/roadmaps")) {
      return ["#0ea5e9", "#10b981", "#6366f1"]; // Focus/Progress: Sky - Emerald - Indigo
    }
    if (pathname.includes("/about")) {
      return ["#f43f5e", "#e11d48", "#be123c"]; // Branding/Corporate: Rose - Crimson - Red (Voxicore)
    }
    return ["#3b82f6", "#22c55e", "#06b6d4"]; // Default standard fallback
  };

  return (
    <Aurora
      colorStops={getColorStops()}
      blend={0.5}
      amplitude={1.0}
      speed={0.5}
    />
  );
};

export default AuroraWrapper;
