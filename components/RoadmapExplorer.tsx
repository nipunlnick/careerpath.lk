import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import type { RoadmapStep, MarketInsights } from "../types";
import {
  Book,
  Bookmark,
  Briefcase,
  CheckCircle,
  GraduationCap,
  Lightbulb,
  Money,
  Target,
  TrendingUp,
  DollarSign,
  ClipboardList,
  Download,
} from "./icons";
import { useAuth } from "../contexts/AuthContext";
import { useRoadmapSearch } from "../hooks/api/useRoadmapSearch";
import { useSavedRoadmaps } from "../hooks/api/useSavedRoadmaps";
import { RoadmapDownloadService } from "../services/downloadService";
import { usePageMeta } from "../hooks/usePageMeta";
import { EXPLORE_CAREERS } from "../constants";
import * as Icons from "./icons";
import { generateRoadmap } from "@/services/geminiService";

const RoadmapExplorer: React.FC = () => {
  const { careerPath } = useParams<{ careerPath: string }>();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [field, setField] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wasGenerated, setWasGenerated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [visibleStep, setVisibleStep] = useState<number | null>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);

  const { currentUser } = useAuth();
  const {
    searchRoadmap,
    isLoading: isSearching,
    wasGenerated: searchWasGenerated,
  } = useRoadmapSearch();

  const {
    saveRoadmap,
    unsaveRoadmap,
    checkIsRoadmapSaved,
    updateNotes,
    isLoading: isSavingRoadmap,
    error: saveError,
  } = useSavedRoadmaps();

  const pageTitle = field
    ? `${field} Roadmap | CareerPath.lk`
    : "Explore Career Roadmaps | CareerPath.lk";
  const pageDescription = field
    ? `A step-by-step career roadmap for becoming a ${field} in Sri Lanka, including salary, skills, and qualifications.`
    : "Explore detailed career roadmaps for various fields in Sri Lanka.";
  usePageMeta(pageTitle, pageDescription);

  const allCareers = EXPLORE_CAREERS.flatMap((category) => category.careers);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // First check predefined careers for exact matches
    const predefinedCareer = allCareers.find(
      (c) => c.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (predefinedCareer && predefinedCareer.path) {
      window.location.href = `/roadmaps/${predefinedCareer.path}`;
      return;
    }

    // Use enhanced search for dynamic roadmap generation
    try {
      setIsLoading(true);
      setError(null);
      setWasGenerated(false);

      const searchResult = await searchRoadmap(
        searchTerm.trim(),
        currentUser?.uid
      );

      if (searchResult.success && searchResult.data) {
        // Update the URL and load the roadmap data
        const newUrl = `/roadmaps/${searchResult.slug}`;
        window.history.pushState({}, "", newUrl);

        // Update component state with the search results
        setField(searchResult.data.name);
        setRoadmap(searchResult.data.steps || []);
        setInsights(searchResult.data.marketInsights || null);
        setWasGenerated(searchResult.generated || false);
        setSearchTerm(""); // Clear search term after successful search

        if (searchResult.generated) {
          console.log("New roadmap generated and stored in database");
        } else {
          console.log("Existing roadmap found in database");
        }
      } else {
        throw new Error("Failed to find or generate roadmap");
      }
    } catch (err: any) {
      console.error("Enhanced search failed:", err);
      setError(err.message || "Failed to search for roadmap");
      // Fallback to old URL-based search
      window.location.href = `/roadmaps?field=${encodeURIComponent(
        searchTerm
      )}`;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fieldFromQuery = queryParams.get("field");
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

    const loadData = async () => {
      const careerSlug =
        careerPath ||
        fieldFromQuery
          ?.toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      const careerDisplayName =
        fieldFromQuery ||
        careerPath?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      if (!careerSlug || !careerDisplayName) {
        setIsLoading(false);
        setField(""); // Clear field if none is selected
        return;
      }

      setIsLoading(true);
      setError(null);
      setRoadmap([]);
      setInsights(null);
      setIsSaved(false);
      setWasGenerated(false);
      setField(careerDisplayName);

      try {
        // 1) Try DB via server API
        try {
          const res = await fetch(
            `${API_BASE}/api/roadmaps/slug/${careerSlug}`
          );
          if (res.ok) {
            const json = await res.json();
            if (json && json.success && json.data) {
              const doc = json.data;
              // `steps` field is used in DB; support legacy shapes
              setRoadmap((doc.steps as RoadmapStep[]) || doc.roadmap || []);
              setInsights(
                (doc.marketInsights as MarketInsights) || doc.insights || null
              );
              return;
            }
          }
        } catch (dbErr) {
          // Ignore DB errors and fallback to generation
          console.warn("DB lookup failed, falling back to generation", dbErr);
        }

        // 2) Ask server to generate & persist (server will check DB again)
        try {
          const genRes = await fetch(`${API_BASE}/api/roadmaps/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: careerDisplayName, slug: careerSlug }),
          });

          if (genRes.ok) {
            const json = await genRes.json();
            if (json && json.success && json.data) {
              const doc = json.data;
              setRoadmap((doc.steps as RoadmapStep[]) || doc.roadmap || []);
              setInsights(
                (doc.marketInsights as MarketInsights) || doc.insights || null
              );
              setWasGenerated(!json.cached); // Mark as generated if not from cache
              return;
            }
          }
        } catch (genErr) {
          console.warn(
            "Server generation failed, will try client generation",
            genErr
          );
        }

        // 3) Fallback: generate directly from client (Gemini service)
        const generatedData = await generateRoadmap(careerDisplayName);
        if (generatedData && generatedData.roadmap && generatedData.insights) {
          setRoadmap(generatedData.roadmap);
          setInsights(generatedData.insights);
          setWasGenerated(true); // Client-side generation
        } else {
          throw new Error("API returned incomplete data.");
        }
      } catch (err: any) {
        console.error("Failed to load or generate roadmap:", err);
        setError(
          err.message ||
            `Sorry, we couldn't generate a roadmap for "${careerDisplayName}" at this time.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [careerPath, location.search]);

  // Check if roadmap is saved when user or field changes
  useEffect(() => {
    if (currentUser && field) {
      const roadmapSlug = field
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      checkIsRoadmapSaved(roadmapSlug)
        .then(setIsSaved)
        .catch(() => setIsSaved(false));
    } else {
      setIsSaved(false);
    }
  }, [currentUser, field, checkIsRoadmapSaved]);

  useEffect(() => {
    if (isLoading || roadmap.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-step-index") || "0",
              10
            );
            setVisibleStep(index);
          }
        });
      },
      {
        root: null, // observes intersections relative to the viewport
        rootMargin: "-40% 0px -40% 0px", // trigger when the element is in the middle 20% of the viewport
        threshold: 0,
      }
    );

    const currentRefs = stepRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [isLoading, roadmap]);

  const handleSaveRoadmap = async () => {
    if (!currentUser || roadmap.length === 0) {
      setError("You must be logged in to save roadmaps.");
      return;
    }

    try {
      const roadmapSlug = field
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const success = await saveRoadmap(
        roadmapSlug,
        field,
        { roadmap, insights },
        notes
      );

      if (success) {
        setIsSaved(true);
        setError(null);
      }
    } catch (error) {
      console.error("Error saving roadmap:", error);
      setError("Failed to save roadmap. Please try again.");
    }
  };

  const handleUnsaveRoadmap = async () => {
    if (!currentUser) return;

    try {
      const roadmapSlug = field
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const success = await unsaveRoadmap(roadmapSlug);

      if (success) {
        setIsSaved(false);
        setError(null);
      }
    } catch (error) {
      console.error("Error unsaving roadmap:", error);
      setError("Failed to unsave roadmap. Please try again.");
    }
  };

  const handleUpdateNotes = async () => {
    if (!currentUser) return;

    try {
      const roadmapSlug = field
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const success = await updateNotes(roadmapSlug, notes);

      if (success) {
        setShowNotesModal(false);
        setError(null);
      }
    } catch (error) {
      console.error("Error updating notes:", error);
      setError("Failed to update notes. Please try again.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await RoadmapDownloadService.downloadAsPDF(field, roadmap, insights, {
        includeInsights: true,
        includeNotes: notes,
      });
      setShowDownloadOptions(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Failed to download PDF. Please try again.");
    }
  };

  const handleDownloadImage = async (format: "png" | "jpeg" = "png") => {
    try {
      await RoadmapDownloadService.downloadAsImage("roadmap-content", field, {
        format,
      });
      setShowDownloadOptions(false);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image. Please try again.");
    }
  };

  const handleDownloadData = async () => {
    try {
      await RoadmapDownloadService.downloadRoadmapData(
        field,
        roadmap,
        insights,
        notes
      );
      setShowDownloadOptions(false);
    } catch (error) {
      console.error("Error downloading data:", error);
      setError("Failed to download data. Please try again.");
    }
  };

  const handleDownload = handleDownloadPDF;

  const getThemeForStep = (title: string) => {
    const lowerTitle = title.toLowerCase();

    const yellowKeywords = [
      "degree",
      "bachelor",
      "a/l",
      "o/l",
      "foundation",
      "studies",
      "education",
      "skill",
      "certification",
      "learn",
      "master",
      "qualification",
      "training",
    ];

    if (yellowKeywords.some((kw) => lowerTitle.includes(kw))) {
      // Yellow theme for education and skills
      return {
        iconBg: "bg-yellow-500",
        titleText: "text-yellow-800 dark:text-yellow-300",
        borderColor: "border-yellow-500",
        shadow: "shadow-yellow-200/50 dark:shadow-yellow-800/50",
      };
    }

    // Default to Green theme for work, leadership, and others
    return {
      iconBg: "bg-green-600",
      titleText: "text-green-800 dark:text-green-300",
      borderColor: "border-green-500",
      shadow: "shadow-green-200/50 dark:shadow-green-800/50",
    };
  };

  const getIconForStep = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("degree") || lowerTitle.includes("bachelor"))
      return <GraduationCap className="w-6 h-6 text-white" />;
    if (
      lowerTitle.includes("a/l") ||
      lowerTitle.includes("o/l") ||
      lowerTitle.includes("foundation")
    )
      return <Book className="w-6 h-6 text-white" />;
    if (
      lowerTitle.includes("internship") ||
      lowerTitle.includes("entry-level") ||
      lowerTitle.includes("job")
    )
      return <Briefcase className="w-6 h-6 text-white" />;
    if (lowerTitle.includes("skill") || lowerTitle.includes("certification"))
      return <Lightbulb className="w-6 h-6 text-white" />;
    if (lowerTitle.includes("specialize") || lowerTitle.includes("senior"))
      return <Target className="w-6 h-6 text-white" />;
    return <CheckCircle className="w-6 h-6 text-white" />;
  };

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Loading roadmap{field ? ` for ${field}` : ""}...
        </p>
        {field && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            This may take a moment if we're generating a new one for you!
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center animate-fadeInUp"
        role="alert"
      >
        <p className="font-bold">An Error Occurred</p>
        <p>{error}</p>
        <Link
          to="/roadmaps"
          className="text-green-600 hover:underline dark:text-green-400 mt-2 inline-block"
        >
          Go back to Roadmaps
        </Link>
      </div>
    );
  }

  // Show search/browse view if no career path is selected
  if (!field) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fadeInUp">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Explore Career Roadmaps
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Search for a career to generate a custom roadmap, or browse our
          curated list of paths.
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

        <div className="space-y-4">
          {EXPLORE_CAREERS.map((category) => {
            const Icon =
              Icons[category.icon as keyof typeof Icons] || Icons.Code;
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
                            to={
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
  }

  // Render the roadmap if a field is set
  return (
    <div className="w-full max-w-4xl mx-auto">
      {roadmap.length > 0 && (
        <div className="mt-0">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 animate-fadeInUp">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                Roadmap to a {field}
              </h1>
              {wasGenerated && (
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Freshly generated roadmap
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              {currentUser && (
                <>
                  <button
                    onClick={isSaved ? handleUnsaveRoadmap : handleSaveRoadmap}
                    disabled={isSavingRoadmap}
                    className={`flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors ${
                      isSaved
                        ? "text-white bg-red-600 hover:bg-red-700"
                        : "text-white bg-green-600 hover:bg-green-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    {isSavingRoadmap
                      ? "Processing..."
                      : isSaved
                      ? "Unsave Roadmap"
                      : "Save Roadmap"}
                  </button>
                  {isSaved && (
                    <button
                      onClick={() => setShowNotesModal(true)}
                      className="flex items-center justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Add Notes
                    </button>
                  )}
                </>
              )}

              <div className="relative download-options-container">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="flex items-center justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>

                {showDownloadOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={handleDownloadPDF}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Download as PDF
                      </button>
                      <button
                        onClick={() => handleDownloadImage("png")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Download as PNG
                      </button>
                      <button
                        onClick={() => handleDownloadImage("jpeg")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Download as JPEG
                      </button>
                      <button
                        onClick={handleDownloadData}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Download Data (JSON)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Market Insights Section */}
          {insights && (
            <div className="mb-10 bg-yellow-50 dark:bg-gray-800 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700 animate-fadeInUp animation-delay-200">
              <h3 className="text-xl font-bold text-center text-yellow-800 dark:text-yellow-300 mb-4">
                Market Insights for Sri Lanka
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Current Demand
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {insights.demand}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    Salary Expectations
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {insights.salaryExpectations}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow md:col-span-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2 text-yellow-500" />
                    Key Skills in Demand
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                    {insights.requiredSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow md:col-span-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-500" />
                    Future Outlook
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {insights.futureOutlook}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div
            id="roadmap-content"
            className="relative container mx-auto px-4 py-8"
          >
            {/* Timeline bar */}
            <div className="absolute top-0 bottom-0 w-1 bg-yellow-200 dark:bg-gray-700 left-6 md:left-1/2 -translate-x-1/2"></div>

            <div className="space-y-16">
              {roadmap.map((step, index) => {
                const isLeft = index % 2 !== 0; // For desktop view
                const theme = getThemeForStep(step.title);
                const isVisible = visibleStep === index;

                return (
                  <div
                    key={index}
                    ref={(el) => (stepRefs.current[index] = el)}
                    data-step-index={index}
                    className={`relative md:flex ${
                      isLeft ? "md:flex-row-reverse" : ""
                    } md:items-center animate-fadeInUp group`}
                    style={{ animationDelay: `${200 + index * 200}ms` }}
                  >
                    {/* Desktop Spacer */}
                    <div className="hidden md:block w-full md:w-5/12"></div>

                    {/* Icon */}
                    <div className="absolute md:relative z-10 left-6 md:left-0 -translate-x-1/2 md:translate-x-0">
                      <div
                        className={`flex items-center justify-center w-12 h-12 ${
                          theme.iconBg
                        } rounded-full ring-8 transition-all duration-500 ${
                          isVisible
                            ? "ring-yellow-200 dark:ring-yellow-900"
                            : "ring-yellow-50 dark:ring-gray-900"
                        }`}
                      >
                        {getIconForStep(step.title)}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="relative ml-16 md:ml-0 md:w-5/12">
                      {/* Desktop Arrow */}
                      <div
                        className={`hidden md:block absolute top-5 h-0 w-0 border-t-8 border-b-8 border-solid z-10
                                        ${
                                          isLeft
                                            ? "right-full -mr-2 border-l-8 border-l-white dark:border-l-gray-800 border-r-0"
                                            : "left-full -ml-2 border-r-8 border-r-white dark:border-r-gray-800 border-l-0"
                                        }`}
                        style={{
                          borderTopColor: "transparent",
                          borderBottomColor: "transparent",
                        }}
                      ></div>

                      <div
                        className={`
                                bg-white dark:bg-gray-800 p-6 rounded-xl border-t-4 
                                transition-all duration-500 ease-in-out
                                ${theme.borderColor}
                                ${
                                  isVisible
                                    ? `${theme.shadow} shadow-2xl scale-[1.02] -translate-y-1`
                                    : "shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1"
                                }
                              `}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h3
                            className={`text-xl font-bold ${theme.titleText}`}
                          >
                            {step.step}. {step.title}
                          </h3>
                          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            {step.duration}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>

                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              Qualifications:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                              {step.qualifications.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              Key Skills:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                              {step.skills.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              Recommended Institutes:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                              {step.institutes.map((inst, i) => (
                                <li key={i}>{inst}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-start">
                            <Money className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                Est. Salary (Monthly):
                              </h4>
                              <p className="text-green-700 dark:text-green-400 font-medium">
                                {step.salaryRangeLKR}
                              </p>
                            </div>
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
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Notes to Roadmap
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add personal notes, goals, or reminders for this roadmap..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setNotes("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNotes}
                disabled={isSavingRoadmap}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-md transition-colors"
              >
                {isSavingRoadmap ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapExplorer;
