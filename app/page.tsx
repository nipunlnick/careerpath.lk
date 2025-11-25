"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EXPLORE_CAREERS } from "../constants";
import * as Icons from "../components/icons";
import type { Career } from "../types";

const Home: React.FC = () => {
  const navigate = useRouter();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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
      <section className="text-center pt-12 pb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight animate-fadeInUp">
          Your Journey to Success Starts Here{" "}
          <span role="img" aria-label="Sri Lanka Flag">
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
            className="w-full sm:w-auto bg-white text-green-600 border-2 border-green-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-400 dark:hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            Quick Start
          </button>
        </div>
      </section>

      {/* Find Your Path Section */}
      <section className="animate-fadeInUp animation-delay-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Not Sure Where to Start?
        </h2>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-400">
          Our AI-powered quizzes can help you discover your ideal career path.
        </p>
        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              Quick Quiz
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">
              Answer 5 simple questions to get instant career suggestions.
              Perfect for a fast start.
            </p>
            <Link
              href="/quiz"
              className="mt-6 text-center bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900 transition-all duration-300"
            >
              Take the 5-Question Quiz &rarr;
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-green-600 dark:border-green-500 flex flex-col transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              In-Depth Assessment
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">
              Take our 15-question assessment for a deeper analysis of your
              skills and personality, leading to more personalized results.
            </p>
            <Link
              href="/long-quiz"
              className="mt-6 text-center bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300"
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
          {EXPLORE_CAREERS.map((category, index) => {
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
      <section className="bg-yellow-50 dark:bg-gray-800 py-16 rounded-xl animate-fadeInUp animation-delay-600">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
            What Students Say
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
              <p className="text-gray-600 dark:text-gray-300">
                "CareerPath.lk gave me the clarity I needed after my A/Ls. The
                IT roadmap was incredibly detailed and helpful!"
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://picsum.photos/id/1005/40/40"
                  alt="Student"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="font-semibold dark:text-white">Nimali Perera</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Undergraduate, University of Colombo
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
              <p className="text-gray-600 dark:text-gray-300">
                "The career quiz was spot on! It suggested fields I hadn't
                considered before, and now I'm excited about my future in
                design."
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://picsum.photos/id/1011/40/40"
                  alt="Student"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="font-semibold dark:text-white">
                    Kasun Jayasuriya
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A/L Student, Kandy
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
              <p className="text-gray-600 dark:text-gray-300">
                "Finally, a resource that understands the Sri Lankan education
                system. The guidance is practical and relevant."
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://picsum.photos/id/1027/40/40"
                  alt="Student"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="font-semibold dark:text-white">Fathima Rizan</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    O/L Graduate, Galle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
