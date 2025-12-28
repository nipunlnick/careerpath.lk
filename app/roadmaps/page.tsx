"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EXPLORE_CAREERS } from "../../constants/careers";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="mt-6 text-xl font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          Generating your personalized roadmap...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp tracking-tight text-gray-900 dark:text-white">
            Explore Career{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Roadmaps
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-fadeInUp animation-delay-200 leading-relaxed">
            Navigate your future with step-by-step guides for Sri Lanka's most
            in-demand careers.
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto relative animate-fadeInUp animation-delay-300"
          >
            <div className="glass dark:glass-dark rounded-full p-2 flex items-center shadow-2xl transition-all focus-within:ring-2 focus-within:ring-primary/50">
              <Icons.Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a career (e.g., 'Data Scientist')"
                className="flex-grow bg-transparent border-none focus:ring-0 text-lg px-4 text-gray-800 dark:text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center glass">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="space-y-6 animate-fadeInUp animation-delay-400">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Browse by Category
          </h2>

          {EXPLORE_CAREERS.map((category, index) => {
            const Icon =
              Icons[category.icon as keyof typeof Icons] || Icons.Code;
            const isOpen = openCategory === category.name;

            return (
              <div
                key={category.name}
                className={`
                  glass dark:glass-dark rounded-2xl overflow-hidden transition-all duration-500 ease-out
                  ${
                    isOpen
                      ? "ring-2 ring-primary/30 shadow-xl scale-[1.01]"
                      : "hover:shadow-lg hover:border-primary/20"
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenCategory(isOpen ? null : category.name)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                      ${
                        isOpen
                          ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 group-hover:text-primary"
                      }
                    `}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${isOpen ? "bg-primary/10 rotate-180" : "bg-transparent"}
                  `}
                  >
                    <Icons.ChevronDown
                      className={`w-6 h-6 transition-colors ${
                        isOpen ? "text-primary" : "text-gray-400"
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-8 pt-0 border-t border-gray-100 dark:border-white/5 mt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
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
                            className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <Icons.ChevronRight className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                              {career.name}
                            </span>
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
    </div>
  );
};

export default RoadmapsPage;
