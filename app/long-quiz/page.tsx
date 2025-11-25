"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LONG_QUIZ_QUESTIONS } from "../../constants";
import { useLocalQuizApi } from "../../hooks/api/useLocalQuizApi";
import { useAuth } from "../../contexts/AuthContext";
import type { CareerSuggestion } from "../../types";
import { usePageMeta } from "../../hooks/usePageMeta";

const LongCareerQuiz: React.FC = () => {
  usePageMeta(
    "In-Depth Career Assessment | CareerPath.lk",
    "Get personalized career recommendations with our comprehensive 15-question assessment."
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const navigate = useRouter();

  const { user } = useAuth();
  const { getSuggestions, isLoading, error, wasCached, source } =
    useLocalQuizApi();

  const handleAnswerSelect = (option: string) => {
    const currentQuestionKey = LONG_QUIZ_QUESTIONS[currentQuestionIndex].key;
    const newAnswers = { ...answers, [currentQuestionKey]: option };
    setAnswers(newAnswers);

    if (currentQuestionIndex < LONG_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If it's the last question, automatically submit.
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setSuggestions([]);
    try {
      const result = await getSuggestions(finalAnswers, "long", user?.uid);
      setSuggestions(result);

      if (wasCached) {
        console.log("Long quiz result retrieved from cache");
      } else {
        console.log("New long quiz result generated");
      }
    } catch (err: any) {
      console.error("Long quiz submission error:", err);
      // Error is handled by the useQuizApi hook
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSuggestions([]);
  };

  const handleExploreRoadmap = (suggestion: CareerSuggestion) => {
    const path = suggestion.roadmapPath || suggestion.career;
    navigate.push(`/roadmaps?field=${encodeURIComponent(path)}&level=A/Ls`);
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / LONG_QUIZ_QUESTIONS.length) * 100;

  if (isLoading) {
    return (
      <div className="text-center mt-8 bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
          Performing deep analysis on your answers...
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This will give you highly personalized results!
        </p>
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          ⚡ Powered by our new lightning-fast local matching system
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center animate-fadeInUp"
        role="alert"
      >
        <p>{error}</p>
        <button
          onClick={handleReset}
          className="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg animate-fadeInUp">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Your In-Depth Career Suggestions
        </h2>
        <div className="mt-8 space-y-6">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg animate-fadeInUp"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <h3 className="text-2xl font-semibold text-yellow-800 dark:text-yellow-300">
                {suggestion.career}
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {suggestion.description}
              </p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 p-3 rounded-md">
                <strong className="dark:text-gray-200">
                  Why it's a great fit for you:
                </strong>{" "}
                {suggestion.reasoning}
              </p>
              <button
                onClick={() => handleExploreRoadmap(suggestion)}
                className="mt-4 bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700 transition-colors"
              >
                {suggestion.roadmapPath ? "View Roadmap" : "Explore Roadmap"}
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleReset}
            className="text-green-600 dark:text-green-400 font-semibold hover:underline"
          >
            Take the assessment again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = LONG_QUIZ_QUESTIONS[currentQuestionIndex];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center animate-fadeInUp">
          In-Depth Career Assessment
        </h1>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-300 animate-fadeInUp animation-delay-100">
          Answer 15 questions for a detailed analysis.
        </p>

        <div className="mt-8">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6 relative">
            <div
              className="bg-green-600 h-4 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{
                width: `${progressPercentage}%`,
                transition: "width 0.5s ease-in-out",
              }}
            >
              {currentQuestionIndex + 1} / {LONG_QUIZ_QUESTIONS.length}
            </div>
          </div>

          <div key={currentQuestionIndex} className="animate-fadeInUp">
            <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold">
              {currentQuestion.question}
            </p>

            <div className="mt-6 space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className="w-full text-left p-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border-2 border-transparent hover:bg-green-100 hover:border-green-500 dark:hover:bg-green-900/50 dark:hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongCareerQuiz;
