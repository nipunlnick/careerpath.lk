"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SoftSkillRoadmap } from "../../../types";
import {
  Book,
  CheckCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Video,
  Download,
} from "../../../components/icons";
import { RoadmapDownloadService } from "../../../services/downloadService";

const SoftSkillRoadmapPage: React.FC = () => {
  const params = useParams();
  const skillSlug = params.skillSlug as string;
  const displaySkillName = skillSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const [roadmap, setRoadmap] = useState<SoftSkillRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchOrGenerateRoadmap = async () => {
      setIsLoading(true);
      try {
        // 1. Try to fetch existing
        const res = await fetch(`/api/soft-skills/slug/${skillSlug}`);
        const data = await res.json();

        if (data.success && data.data) {
          setRoadmap(data.data);
          setIsLoading(false);
          return;
        }

        // 2. If not found, generate
        setIsGenerating(true);
        const genRes = await fetch("/api/soft-skills/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skillName: displaySkillName }),
        });
        const genData = await genRes.json();

        if (genData.success && genData.data) {
          setRoadmap(genData.data);
        } else {
          setError("Failed to generate roadmap. Please try again.");
        }
      } catch (err) {
        console.error("Error loading soft skill roadmap:", err);
        setError("Something went wrong. Please refresh the page.");
      } finally {
        setIsLoading(false);
        setIsGenerating(false);
      }
    };

    if (skillSlug) {
      fetchOrGenerateRoadmap();
    }
  }, [skillSlug, displaySkillName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {isGenerating
            ? "Crafting your personalized roadmap..."
            : "Loading..."}
        </h2>
        {isGenerating && (
          <p className="text-gray-500 mt-2 text-center max-w-md animate-pulse">
            Using AI to design a mastery path for{" "}
            <strong>{displaySkillName}</strong>. This might take a few seconds.
          </p>
        )}
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h3 className="text-lg font-bold mb-2">Error</h3>
          <p>{error || "Roadmap not found."}</p>
          <Link
            href="/"
            className="inline-block mt-4 text-purple-600 hover:underline"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold mb-4">
              Soft Skill Mastery
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white capitalize mb-4">
              {roadmap.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0">
              {roadmap.description}
            </p>
          </div>
          <button
            onClick={() => RoadmapDownloadService.downloadSoftSkillPDF(roadmap)}
            className="flex items-center justify-center py-2 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 font-medium whitespace-nowrap"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Guide
          </button>
        </div>

        {/* Levels */}
        <div className="space-y-8 relative">
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 hidden md:block"></div>

          {roadmap.levels.map((level, index) => (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              } animate-fadeInUp`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Timeline Dot (Desktop) */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-purple-600 border-4 border-white dark:border-gray-900 z-10 hidden md:flex items-center justify-center text-white font-bold text-sm">
                {level.level}
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2">
                <div
                  className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow ${
                    index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <span className="md:hidden w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs mr-2">
                        {level.level}
                      </span>
                      {level.title}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                      {level.duration}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                    "{level.objective}"
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                        Focus Area
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {level.description}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-green-500" />
                        Practice Exercises
                      </h4>
                      <ul className="space-y-2">
                        {level.practices.map((practice, i) => (
                          <li
                            key={i}
                            className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-purple-400 mt-0.5 flex-shrink-0" />
                            <span>{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resources Section */}
        {roadmap.resources && roadmap.resources.length > 0 && (
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Book className="w-6 h-6 mr-3 text-purple-600" />
              Recommended Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-purple-600 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    {resource.type === "video" ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <Book className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {resource.type}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftSkillRoadmapPage;
