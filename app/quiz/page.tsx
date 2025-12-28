"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUIZ_QUESTIONS } from "../../constants/quiz";
import { useLocalQuizApi } from "../../hooks/api/useLocalQuizApi";
import { useAuth } from "../../contexts/AuthContext";
import type { CareerSuggestion } from "../../types";
import { usePageMeta } from "../../hooks/usePageMeta";
import * as Icons from "../../components/icons";

const CareerQuiz: React.FC = () => {
  usePageMeta(
    "Quick Career Quiz | CareerPath.lk",
    "Discover your ideal career path with our quick 2-minute career assessment quiz."
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const navigate = useRouter();

  const { user } = useAuth();
  const { getSuggestions, isLoading, error, wasCached, source } =
    useLocalQuizApi();

  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setSuggestions([]);
    try {
      const result = await getSuggestions(finalAnswers, "standard", user?.uid);
      setSuggestions(result);

      if (wasCached) {
        // Quiz result retrieved from cache
      } else {
        // New quiz result generated
      }
    } catch (err: any) {
      console.error("Quiz submission error:", err);
      // Error is handled by the useQuizApi hook
    }
  };

  const handleAnswerSelect = (option: string) => {
    const currentQuestionKey = QUIZ_QUESTIONS[currentQuestionIndex].key;
    const newAnswers = { ...answers, [currentQuestionKey]: option };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      // Small delay for better UX
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    } else {
      // If it's the last question, automatically submit.
      handleSubmit(newAnswers);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSuggestions([]);
  };

  const handleExploreRoadmap = (suggestion: CareerSuggestion) => {
    if (suggestion.roadmapPath) {
      navigate.push(`/roadmaps/${suggestion.roadmapPath}`);
    } else {
      navigate.push(
        `/roadmaps?field=${encodeURIComponent(suggestion.career)}&level=A/Ls`
      );
    }
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass dark:glass-dark p-12 rounded-3xl shadow-2xl text-center max-w-md w-full animate-fadeInUp">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analyzing Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our AI is matching your answers with over 50+ career paths...
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary font-medium bg-primary/10 py-2 px-4 rounded-full inline-flex">
            <span>⚡ Powered by Gem-Flash AI</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass dark:glass-dark p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-l-4 border-accent">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Perfect Career Matches
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Based on your personality and strengths, here are your top
            recommendations.
          </p>
        </div>

        <div className="grid gap-8">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="glass dark:glass-dark p-8 rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-secondary"></div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    {suggestion.career}
                    {index === 0 && (
                      <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Top Match
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {suggestion.description}
                  </p>

                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-6 border border-primary/10">
                    <h4 className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">
                      Why it fits you
                    </h4>
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      {suggestion.reasoning}
                    </p>
                  </div>

                  <button
                    onClick={() => handleExploreRoadmap(suggestion)}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:translate-x-1"
                  >
                    View Full Roadmap <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fadeInUp animation-delay-500">
          <div className="glass dark:glass-dark p-8 rounded-3xl inline-block max-w-2xl w-full">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Want more precision?
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our in-depth assessment covers 15 dimensions of your professional
              profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/long-quiz"
                className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-secondary/20"
              >
                Start In-Depth Assessment
              </Link>
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              >
                Retake Quick Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        <div className="mb-8 text-center animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Lets find your calling
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="glass dark:glass-dark p-8 md:p-10 rounded-3xl shadow-xl animate-scaleIn">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="w-full group text-left p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 flex items-center justify-between"
              >
                <span className="text-lg text-gray-700 dark:text-gray-200 font-medium group-hover:text-primary transition-colors">
                  {option}
                </span>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-primary flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Takes less than 2 minutes • No sign-up required
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerQuiz;
