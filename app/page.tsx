"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EXPLORE_CAREERS } from "../constants/careers";
import * as Icons from "../components/icons";
import type { Career } from "../types";

const Home: React.FC = () => {
  const navigate = useRouter();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState(EXPLORE_CAREERS);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/roadmaps/categories");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCategories(json.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCareerClick = (career: Career) => {
    if (career.path) {
      navigate.push(`/roadmaps/${career.path}`);
    } else {
      navigate.push(`/roadmaps?field=${encodeURIComponent(career.name)}`);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-900/10 pointer-events-none" />
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight animate-fadeInUp">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300">
            Your Journey to Success
          </span>{" "}
          Starts Here{" "}
          <span
            role="img"
            aria-label="Sri Lanka Flag"
            className="inline-block hover:scale-110 transition-transform duration-300 animate-float"
          >
            🇱🇰
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 animate-fadeInUp animation-delay-200">
          Plan your future with clear, step-by-step career roadmaps tailored for
          Sri Lankan students. Find your path after O/Ls, A/Ls, or University.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeInUp animation-delay-400">
          <button
            onClick={() => navigate.push("/roadmaps")}
            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-pulse-soft"
          >
            Quick Start
          </button>
        </div>
      </section>

      {/* Find Your Path Section */}
      <section className="animate-fadeInUp animation-delay-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
          Not Sure Where to Start?
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Our AI-powered quizzes can help you discover your ideal career path.
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fadeInLeft">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Quick Quiz
            </h3>
            <p className="text-gray-600 dark:text-gray-300 flex-grow mb-6">
              Answer 5 simple questions to get instant career suggestions.
              Perfect for a fast start.
            </p>
            <Link
              href="/quiz"
              className="text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Take the 5-Question Quiz &rarr;
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-green-500/20 dark:border-green-500/30 flex flex-col transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-fadeInRight">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              In-Depth Assessment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 flex-grow mb-6">
              Take our 15-question assessment for a deeper analysis of your
              skills and personality, leading to more personalized results.
            </p>
            <Link
              href="/long-quiz"
              className="text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Start In-Depth Assessment &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Explore All Career Paths Section */}
      <section className="animate-fadeInUp animation-delay-400">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Explore All Career Paths
        </h2>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-400">
          Browse by category to find your perfect fit.
        </p>
        <div className="mt-8 max-w-4xl mx-auto space-y-4">
          {categories.map((category, index) => {
            const Icon =
              Icons[category.icon as keyof typeof Icons] || Icons.Code;
            const isOpen = openCategory === category.name;

            return (
              <div
                key={category.name}
                className={`
                                    rounded-xl border shadow-sm transition-all duration-300 ease-in-out overflow-hidden
                                    animate-fadeInUp
                                    ${
                                      isOpen
                                        ? "border-green-300 dark:border-green-600 shadow-md"
                                        : "border-gray-200 dark:border-gray-700 hover:shadow-md"
                                    }
                                `}
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <button
                  onClick={() => setOpenCategory(isOpen ? null : category.name)}
                  className="w-full flex justify-between items-center p-4 sm:p-5 bg-white dark:bg-gray-800 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center">
                    <div
                      className={`
                                            rounded-lg w-12 h-12 flex items-center justify-center mr-4 
                                            transition-colors duration-300
                                            ${
                                              isOpen
                                                ? "bg-green-600"
                                                : "bg-green-100 dark:bg-green-900/30"
                                            }
                                        `}
                    >
                      <Icon
                        className={`
                                                w-6 h-6 transition-colors duration-300
                                                ${
                                                  isOpen
                                                    ? "text-white"
                                                    : "text-green-600 dark:text-green-400"
                                                }
                                            `}
                      />
                    </div>
                    <span
                      className={`
                                            font-semibold text-lg transition-colors duration-300
                                            ${
                                              isOpen
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-gray-800 dark:text-gray-200"
                                            }
                                        `}
                    >
                      {category.name}
                    </span>
                  </div>
                  <Icons.ChevronDown
                    className={`w-6 h-6 shrink-0 text-gray-500 transform transition-all duration-300 ${
                      isOpen ? "rotate-180 text-green-600" : ""
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
                          <button
                            key={career.name}
                            onClick={() => handleCareerClick(career)}
                            className="flex items-center p-2 rounded-md text-left text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
                          >
                            <Icons.ChevronRight className="w-4 h-4 mr-3 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
                            <span>{career.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 py-16 rounded-3xl my-16 animate-fadeInUp animation-delay-600">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Students Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "CareerPath.lk gave me the clarity I needed after my A/Ls. The IT roadmap was incredibly detailed and helpful!",
                name: "Nimali Perera",
                role: "Undergraduate, University of Colombo",
                img: "https://picsum.photos/id/1005/40/40",
                delay: "0ms",
              },
              {
                quote:
                  "The career quiz was spot on! It suggested fields I hadn't considered before, and now I'm excited about my future in design.",
                name: "Kasun Jayasuriya",
                role: "A/L Student, Kandy",
                img: "https://picsum.photos/id/1011/40/40",
                delay: "200ms",
              },
              {
                quote:
                  "Finally, a resource that understands the Sri Lankan education system. The guidance is practical and relevant.",
                name: "Fathima Rizan",
                role: "O/L Graduate, Galle",
                img: "https://picsum.photos/id/1027/40/40",
                delay: "400ms",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scaleIn"
                style={{ animationDelay: testimonial.delay }}
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
