"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EXPLORE_CAREERS } from "../../constants";
import * as Icons from "../../components/icons";
import { useRoadmapSearch } from "../../hooks/api/useRoadmapSearch";
import { useAuth } from "../../contexts/AuthContext";
import { usePageMeta } from "../../hooks/usePageMeta";

const RoadmapsPage: React.FC = () => {
  usePageMeta(
    "Explore Career Roadmaps | CareerPath.lk",
    "Explore detailed career roadmaps for various fields in Sri Lanka."
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { currentUser } = useAuth();
  const { searchRoadmap } = useRoadmapSearch();

  const allCareers = EXPLORE_CAREERS.flatMap((category) => category.careers);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // First check predefined careers for exact matches
    const predefinedCareer = allCareers.find(
      (c) => c.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (predefinedCareer && predefinedCareer.path) {
      router.push(`/roadmaps/${predefinedCareer.path}`);
      return;
    }

    // Use enhanced search for dynamic roadmap generation
    try {
      setIsLoading(true);
      setError(null);

      const searchResult = await searchRoadmap(
        searchTerm.trim(),
        currentUser?.uid
      );

      if (searchResult.success && searchResult.data) {
        router.push(`/roadmaps/${searchResult.slug}`);
      } else {
        throw new Error("Failed to find or generate roadmap");
      }
    } catch (err: any) {
      console.error("Enhanced search failed:", err);
      setError(err.message || "Failed to search for roadmap");
      // Fallback to old URL-based search
      router.push(`/roadmaps?field=${encodeURIComponent(searchTerm)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Searching for roadmap...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeInUp p-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
        Explore Career Roadmaps
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Search for a career to generate a custom roadmap, or browse our curated
        list of paths.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-12">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., 'Data Scientist' or 'Graphic Designer'"
          className="flex-grow w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-3 px-4 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {EXPLORE_CAREERS.map((category) => {
          const Icon = Icons[category.icon as keyof typeof Icons] || Icons.Code;
          const isOpen = openCategory === category.name;

          return (
            <div
              key={category.name}
              className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenCategory(isOpen ? null : category.name)}
                className="w-full flex justify-between items-center p-4 sm:p-5 bg-white dark:bg-gray-800 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                aria-expanded={isOpen}
              >
                <div className="flex items-center">
                  <div className="rounded-lg w-12 h-12 flex items-center justify-center mr-4 bg-green-100 dark:bg-green-900/30">
                    <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                    {category.name}
                  </span>
                </div>
                <Icons.ChevronDown
                  className={`w-6 h-6 shrink-0 text-gray-500 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                      {category.careers.map((career) => (
                        <Link
                          key={career.name}
                          href={
                            career.path
                              ? `/roadmaps/${career.path}`
                              : `/roadmaps?field=${encodeURIComponent(
                                  career.name
                                )}`
                          }
                          className="flex items-center p-2 rounded-md text-left text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
                        >
                          <Icons.ChevronRight className="w-4 h-4 mr-3 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
                          <span>{career.name}</span>
                        </Link>
                      ))}
                    </div>
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

export default RoadmapsPage;
