"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target,
  Lightbulb,
  Code,
  TrendingUp,
  DollarSign,
  ClipboardList,
} from "../../components/icons";
import type { MarketInsights } from "../../types";
import { usePageMeta } from "../../hooks/usePageMeta";

const About: React.FC = () => {
  usePageMeta(
    "About CareerPath.lk | Our Mission",
    "Learn about CareerPath.lk's mission to empower Sri Lankan students with free, AI-powered, and locally-tailored career guidance to help them plan their future."
  );

  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExampleInsights = async () => {
      setIsLoading(true);
      try {
        const result = await import(
          "../../data/insights/software-engineer.json"
        );
        setInsights(result.default);
      } catch (error) {
        console.error("Failed to load example insights:", error);
        setInsights(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExampleInsights();
  }, []);

  const teamMembers = [
    {
      name: "Janith Perera",
      role: "Founder & CEO",
      imageUrl: "https://picsum.photos/id/1005/200/200",
      bio: "Passionate about empowering Sri Lankan youth, Janith founded CareerPath.lk to bridge the gap between education and employment.",
    },
    {
      name: "Dr. Anusha Silva",
      role: "Head of Career Counseling",
      imageUrl: "https://picsum.photos/id/1027/200/200",
      bio: "With a Ph.D. in Educational Psychology, Dr. Silva ensures our guidance is relevant, accurate, and supportive for students.",
    },
    {
      name: "Sahan Kumar",
      role: "Lead AI Engineer",
      imageUrl: "https://picsum.photos/id/1011/200/200",
      bio: "Sahan leads the development of our AI-powered tools, leveraging cutting-edge technology to create personalized career roadmaps.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-8 pb-4 animate-fadeInUp">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          About CareerPath.lk
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 animation-delay-200 animate-fadeInUp">
          Empowering Sri Lankan students to navigate their future with
          confidence and clarity.
        </p>
      </section>

      {/* Our Mission Section */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fadeInUp animation-delay-200">
        <h2 className="text-3xl font-bold text-center text-green-600 dark:text-green-400">
          Our Mission
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
          Our mission is to provide every student in Sri Lanka with free,
          accessible, and personalized career guidance. We believe that with the
          right information and a clear plan, anyone can achieve their
          professional dreams. We aim to demystify career planning by offering
          step-by-step roadmaps that are tailored to the local education system
          and job market.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="animate-fadeInUp animation-delay-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Why Choose Us?
        </h2>
        <div className="mt-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 animate-fadeInUp animation-delay-400">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto transform transition-transform duration-300 hover:scale-110">
              <Target className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="mt-5 font-semibold text-xl text-gray-800 dark:text-gray-200">
              Tailored for Sri Lanka
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Our roadmaps and advice are specifically designed for the Sri
              Lankan context, referencing local qualifications, universities,
              and job market realities.
            </p>
          </div>
          <div className="text-center p-6 animate-fadeInUp animation-delay-500">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto transform transition-transform duration-300 hover:scale-110">
              <Lightbulb className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="mt-5 font-semibold text-xl text-gray-800 dark:text-gray-200">
              AI-Powered Guidance
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Using Google's Gemini API, we generate personalized roadmaps and
              career suggestions based on your interests, skills, and
              educational background.
            </p>
          </div>
          <div className="text-center p-6 animate-fadeInUp animation-delay-600">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto transform transition-transform duration-300 hover:scale-110">
              <Code className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="mt-5 font-semibold text-xl text-gray-800 dark:text-gray-200">
              Completely Free
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We are committed to keeping CareerPath.lk a free resource for all
              students, ensuring that financial barriers do not stand in the way
              of a well-planned future.
            </p>
          </div>
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="animate-fadeInUp animation-delay-400">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Backed by Real-World Data
        </h2>
        <p className="text-center mt-2 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
          A great plan needs current information. That's why every roadmap is
          enhanced with AI-powered Market Insights, giving you a snapshot of the
          current job landscape in Sri Lanka for your chosen field.
        </p>
        <div className="mt-8 max-w-3xl mx-auto bg-yellow-50 dark:bg-gray-800 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <h3 className="text-xl font-bold text-center text-yellow-800 dark:text-yellow-300 mb-4">
            Example: Insights for a Software Engineer
          </h3>
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Current Demand
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {insights.demand}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Salary Expectations
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {insights.salaryExpectations}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
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
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-500" />
                  Future Outlook
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {insights.futureOutlook}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Market insights could not be loaded.
            </p>
          )}
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="animate-fadeInUp animation-delay-500">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Meet the Team
        </h2>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-400">
          We're a small team of educators, technologists, and career experts.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center transform transition-transform duration-300 hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto"
              />
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-green-600 dark:text-green-400 font-semibold">
                {member.role}
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-green-600 dark:bg-green-800 py-16 rounded-xl text-center animate-fadeInUp animation-delay-600">
        <h2 className="text-3xl font-bold text-white">
          Ready to Plan Your Future?
        </h2>
        <p className="mt-4 text-green-100 max-w-2xl mx-auto">
          Take our free career quiz or start exploring roadmaps today to find
          the path that's right for you.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/quiz"
            className="bg-yellow-400 text-green-800 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-yellow-300 transform hover:-translate-y-1 transition-all duration-300"
          >
            Take the Quick Quiz
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
