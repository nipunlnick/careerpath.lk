"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lightbulb, Search, TrendingUp } from "../../components/icons";

const POPULAR_SKILLS = [
  "Leadership",
  "Communication",
  "Time Management",
  "Emotional Intelligence",
  "Critical Thinking",
  "Negotiation",
  "Public Speaking",
  "Teamwork",
  "Adaptability",
  "Problem Solving",
];

const SoftSkillsLandingPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const slug = searchQuery
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      router.push(`/soft-skills/${slug}`);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp tracking-tight text-gray-900 dark:text-white">
            Master the Art of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-teal-400">
              Soft Skills
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-fadeInUp animation-delay-200 leading-relaxed">
            Unlock your potential with personalized, AI-generated roadmaps for
            any interpersonal skill.
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto relative animate-fadeInUp animation-delay-300"
          >
            <div className="glass dark:glass-dark rounded-full p-2 flex items-center shadow-2xl transition-all focus-within:ring-2 focus-within:ring-secondary/50">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="What do you want to learn? (e.g., 'Conflict Resolution')"
                className="flex-grow bg-transparent border-none focus:ring-0 text-lg px-4 text-gray-800 dark:text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-md"
              >
                Explore
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popular Skills Section */}
      <div className="container mx-auto px-4 max-w-7xl animate-fadeInUp animation-delay-400">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-secondary" />
            Popular Skills to Master
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Start your journey with these highly sought-after capabilities
            essential for modern workplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {POPULAR_SKILLS.map((skill, index) => {
            const slug = skill.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={index}
                href={`/soft-skills/${slug}`}
                className="group glass dark:glass-dark p-6 rounded-2xl border border-white/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                    <Lightbulb className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-secondary transition-colors">
                  {skill}
                </h3>

                <div className="flex items-center text-secondary font-medium mt-4 group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-sm">View Roadmap</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SoftSkillsLandingPage;
