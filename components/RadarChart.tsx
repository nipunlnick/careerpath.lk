"use client";

import React, { useEffect, useState } from "react";
import type { CareerSuggestion } from "../types";

interface RadarChartProps {
  suggestions: CareerSuggestion[];
}

interface Dimension {
  name: string;
  keywords: string[];
}

const DIMENSIONS: Dimension[] = [
  {
    name: "Technology & IT",
    keywords: [
      "software", "developer", "engineer", "cybersecurity", "network", 
      "sysadmin", "programmer", "data", "ai", "machine learning", 
      "it", "computer", "cloud", "blockchain", "tech", "web"
    ]
  },
  {
    name: "Business & Management",
    keywords: [
      "marketing", "business", "finance", "accounting", "manager", 
      "entrepreneur", "startup", "project manager", "consultant", 
      "sales", "human resources", "admin", "executive"
    ]
  },
  {
    name: "Creative & Design",
    keywords: [
      "design", "ui/ux", "graphic", "creative", "multimedia", "artist", 
      "illustrator", "animator", "copywriter", "photographer", "fashion"
    ]
  },
  {
    name: "Healthcare & Science",
    keywords: [
      "doctor", "nurse", "physician", "biotech", "science", "researcher", 
      "data scientist", "pharmacist", "medical", "dentist", "lab", "biology",
      "chemistry", "physics"
    ]
  },
  {
    name: "Humanities & Law",
    keywords: [
      "lawyer", "legal", "teacher", "educator", "tutor", "content creator", 
      "writer", "journalist", "psychologist", "social worker", "counselor", 
      "history", "literature"
    ]
  }
];

const RadarChart: React.FC<RadarChartProps> = ({ suggestions }) => {
  const [animatedScores, setAnimatedScores] = useState<number[]>([20, 20, 20, 20, 20]);

  // Compute affinity scores
  const computeScores = (): number[] => {
    const scores = [0, 0, 0, 0, 0];
    if (suggestions.length === 0) return [40, 40, 40, 40, 40];

    suggestions.forEach((sug, index) => {
      const weight = index === 0 ? 1.5 : index === 1 ? 1.2 : 1.0;
      const textToMatch = `${sug.career} ${sug.description} ${sug.reasoning}`.toLowerCase();

      DIMENSIONS.forEach((dim, dimIdx) => {
        let matches = 0;
        dim.keywords.forEach(kw => {
          if (textToMatch.includes(kw)) {
            matches += 1;
          }
        });
        scores[dimIdx] += matches * weight;
      });
    });

    // Normalize scores between 35 and 95 for visual appeal
    const maxScore = Math.max(...scores);
    if (maxScore === 0) return [60, 60, 60, 60, 60];

    return scores.map(score => {
      const normalized = 35 + (score / maxScore) * 55;
      return Math.round(normalized);
    });
  };

  const finalScores = computeScores();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(finalScores);
    }, 150);
    return () => clearTimeout(timer);
  }, [suggestions]);

  // SVG drawing configuration
  const width = 580;
  const height = 420;
  const cx = width / 2;
  const cy = height / 2;
  const r = 120; // Maximum radius

  // Convert polar coordinates to Cartesian
  const getCoordinates = (index: number, score: number, radiusOffset = 0): { x: number; y: number } => {
    const angle = index * (2 * Math.PI / 5) - Math.PI / 2;
    const currentRadius = (score / 100) * r + radiusOffset;
    return {
      x: cx + currentRadius * Math.cos(angle),
      y: cy + currentRadius * Math.sin(angle)
    };
  };

  // Concentric pentagon background grids
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPoints = gridLevels.map(level => {
    return Array.from({ length: 5 }).map((_, i) => getCoordinates(i, level * 100));
  });

  // Calculate coordinates for the dynamic data polygon
  const polygonPoints = animatedScores.map((score, i) => getCoordinates(i, score));
  const polygonPath = polygonPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="glass dark:glass-dark rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-white/5 flex flex-col items-center justify-center w-full animate-fadeInUp">
      <div className="text-center mb-4">
        <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          📊 Core Affinity Mapping
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
          Your Career Match Blueprint
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          A visual breakdown of your profile alignment across 5 domain industries.
        </p>
      </div>

      <div className="relative w-full max-w-[520px] flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            {/* Soft gradient fill for the active area */}
            <radialGradient id="radarAreaGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </radialGradient>
            
            {/* Glow filter for polygon borders */}
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grids (Pentagons) */}
          {gridPoints.map((points, idx) => (
            <polygon
              key={idx}
              points={points.map(p => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="currentColor"
              className="text-gray-300 dark:text-gray-700 stroke-1"
              strokeDasharray={idx < 4 ? "4, 4" : "none"}
            />
          ))}

          {/* Grid Level Percent Labels */}
          {gridLevels.map((level, idx) => {
            const p = getCoordinates(0, level * 100, -6);
            return (
              <text
                key={idx}
                x={p.x}
                y={p.y}
                className="text-[9px] fill-gray-400 font-semibold"
                textAnchor="middle"
              >
                {Math.round(level * 100)}%
              </text>
            );
          })}

          {/* Axis Lines from Center */}
          {Array.from({ length: 5 }).map((_, i) => {
            const outerPoint = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={outerPoint.x}
                y2={outerPoint.y}
                stroke="currentColor"
                className="text-gray-300 dark:text-gray-700 stroke-1"
              />
            );
          })}

          {/* Main Filled Data Polygon */}
          {polygonPoints.length > 0 && (
            <polygon
              points={polygonPath}
              fill="url(#radarAreaGradient)"
              stroke="url(#radarAreaGradient)"
              className="stroke-[3.5] transition-all duration-1000 ease-out"
              style={{ filter: "url(#radarGlow)" }}
            />
          )}

          {/* Dynamic Nodes (Glowing data points) */}
          {polygonPoints.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="7"
                className="fill-white dark:fill-gray-900 stroke-2 transition-all duration-1000 ease-out"
                stroke={i % 2 === 0 ? "#8b5cf6" : "#3b82f6"}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-primary transition-all duration-1000 ease-out"
                style={{ fill: i % 2 === 0 ? "#8b5cf6" : "#3b82f6" }}
              />
            </g>
          ))}

          {/* Axis Text Labels */}
          {DIMENSIONS.map((dim, i) => {
            const offsetDist = 28; // Distance away from vertex
            const p = getCoordinates(i, 100, offsetDist);
            
            // Adjust alignments depending on placement to avoid cutting off
            let anchor: "middle" | "start" | "end" = "middle";
            if (p.x < cx - 40) anchor = "end";
            if (p.x > cx + 40) anchor = "start";

            return (
              <g key={i}>
                <text
                  x={p.x}
                  y={p.y - 4}
                  className="text-[11px] sm:text-xs font-bold fill-gray-800 dark:fill-gray-100 uppercase tracking-wide"
                  textAnchor={anchor}
                >
                  {dim.name}
                </text>
                <text
                  x={p.x}
                  y={p.y + 8}
                  className="text-[10px] font-bold fill-primary/80 dark:fill-secondary/80"
                  textAnchor={anchor}
                >
                  Match: {animatedScores[i]}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default RadarChart;
