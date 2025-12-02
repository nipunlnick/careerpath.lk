"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Book,
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
} from "../../../components/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { RoadmapDownloadService } from "../../../services/downloadService";
import { usePageMeta } from "../../../hooks/usePageMeta";
import type { RoadmapStep, MarketInsights } from "../../../types";

const RoadmapDetailsPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const careerPath = params.careerPath as string;
  const fieldFromQuery = searchParams.get("field");

  const [field, setField] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wasGenerated, setWasGenerated] = useState(false);
  const [visibleStep, setVisibleStep] = useState<number | null>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const { currentUser } = useAuth();

  const pageTitle = field
    ? `${field} Roadmap | CareerPath.lk`
    : "Career Roadmap | CareerPath.lk";
  const pageDescription = field
    ? `A step-by-step career roadmap for becoming a ${field} in Sri Lanka, including salary, skills, and qualifications.`
    : "Explore detailed career roadmaps for various fields in Sri Lanka.";
  usePageMeta(pageTitle, pageDescription);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
        setField("");
        return;
      }

      setIsLoading(true);
      setError(null);
      setRoadmap([]);
      setInsights(null);
      setWasGenerated(false);
      setField(decodeURIComponent(careerDisplayName));

      try {
        // 1) Try DB via API
        try {
          const res = await fetch(`/api/roadmaps/slug/${careerSlug}`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.success && json.data) {
              const doc = json.data;
              setRoadmap((doc.steps as RoadmapStep[]) || doc.roadmap || []);
              setInsights(
                (doc.marketInsights as MarketInsights) || doc.insights || null
              );
              // Increment view count
              fetch("/api/roadmaps/view", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: careerSlug }),
              }).catch(console.error);
              return;
            }
          }
        } catch (dbErr) {
          console.warn("DB lookup failed, falling back to generation", dbErr);
        }

        // 2) Ask API to generate & persist
        try {
          const genRes = await fetch(`/api/roadmaps/generate`, {
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
              setWasGenerated(!json.cached);
              // Increment view count
              fetch("/api/roadmaps/view", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: careerSlug }),
              }).catch(console.error);
              return;
            }
          }
        } catch (genErr) {
          console.warn("Server generation failed", genErr);
        }

        throw new Error("Failed to load or generate roadmap.");
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
  }, [careerPath, fieldFromQuery]);

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
        root: null,
        rootMargin: "-40% 0px -40% 0px",
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

  const handleDownloadPDF = async () => {
    try {
      await RoadmapDownloadService.downloadAsPDF(field, roadmap, insights, {
        includeInsights: true,
        includeNotes: "",
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
        ""
      );
      setShowDownloadOptions(false);
    } catch (error) {
      console.error("Error downloading data:", error);
      setError("Failed to download data. Please try again.");
    }
  };

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
      return {
        iconBg: "bg-yellow-500",
        titleText: "text-yellow-800 dark:text-yellow-300",
        borderColor: "border-yellow-500",
        shadow: "shadow-yellow-200/50 dark:shadow-yellow-800/50",
      };
    }

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
          href="/roadmaps"
          className="text-green-600 hover:underline dark:text-green-400 mt-2 inline-block"
        >
          Go back to Roadmaps
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
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
              <div className="relative download-options-container">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="flex items-center justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>

                {showDownloadOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-[200]">
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
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
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
                        } rounded-full ring-8 transition-all duration-500 transform group-hover:scale-110 ${
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
    </div>
  );
};

export default RoadmapDetailsPage;
