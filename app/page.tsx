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
    <div className="space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float animation-delay-500"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fadeInUp">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              #1 Career Guidance Platform in Sri Lanka 🇱🇰
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fadeInUp animation-delay-200">
            Find Your Path <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-500 to-secondary animate-gradient-x">
              Shape Your Future
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 animate-fadeInUp animation-delay-300 leading-relaxed">
            Personalized career roadmaps, AI-driven skills analysis, and
            real-time market insights tailored for Sri Lankan students.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp animation-delay-400">
            <button
              onClick={() => navigate.push("/quiz")}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold shadow-lg shadow-primary/30 transition-all hover:scale-105"
            >
              Take Career Quiz
            </button>
            <button
              onClick={() => navigate.push("/roadmaps")}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/10 text-gray-900 dark:text-white rounded-full font-semibold border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-all hover:scale-105"
            >
              Explore Roadmaps
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group glass dark:glass-dark p-8 rounded-3xl hover:border-primary/50 transition-all duration-500 animate-fadeInLeft">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Quick Career Quiz
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Unsure where to start? Answer 5 simple questions to get instant,
              AI-powered career suggestions based on your interests.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Start Quiz <Icons.ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="group glass dark:glass-dark p-8 rounded-3xl hover:border-secondary/50 transition-all duration-500 animate-fadeInRight">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Deep Skills Assessment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Ready for a deep dive? Our comprehensive 15-question assessment
              analyzes your strengths specifically for key industries.
            </p>
            <Link
              href="/long-quiz"
              className="inline-flex items-center text-secondary font-semibold hover:text-secondary/80 transition-colors"
            >
              Start Assessment <Icons.ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Career Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Capabilities
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our curated collection of career paths across Sri Lanka's
            fastest-growing industries.
          </p>
        </div>

        <div className="grid gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => {
            const Icon =
              Icons[category.icon as keyof typeof Icons] || Icons.Code;
            const isOpen = openCategory === category.name;

            return (
              <div
                key={category.name}
                className={`
                  glass dark:glass-dark rounded-2xl overflow-hidden transition-all duration-500
                  ${
                    isOpen
                      ? "ring-2 ring-primary/20 shadow-lg"
                      : "hover:shadow-md"
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => setOpenCategory(isOpen ? null : category.name)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isOpen
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 group-hover:text-primary"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <Icons.ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {category.careers.map((career) => (
                        <button
                          key={career.name}
                          onClick={() => handleCareerClick(career)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                          <div className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-primary transition-colors"></div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">
                            {career.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-10">
        <div className="relative glass dark:glass-dark rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 relative z-10">
            Success Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                quote:
                  "The IT roadmap gave me specific certifications to target. I landed my first internship within 3 months!",
                name: "Nimali Perera",
                role: "Undergraduate",
                img: "https://i.pravatar.cc/150?u=nimali",
              },
              {
                quote:
                  "I was confused about choosing between Design and Marketing. The quiz clarified my strengths perfectly.",
                name: "Kasun Jayasuriya",
                role: "A/L Student",
                img: "https://i.pravatar.cc/150?u=kasun",
              },
              {
                quote:
                  "Unlike other sites, CareerPath explains the 'how' not just the 'what'. Highly recommended.",
                name: "Fathima Rizan",
                role: "O/L Graduate",
                img: "https://i.pravatar.cc/150?u=fathima",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-white/20 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star
                      key={i}
                      className="w-4 h-4 text-orange-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
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
