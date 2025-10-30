import React, { useState } from "react";
import { useLocalQuizApi } from "../hooks/api/useLocalQuizApi";
import { QUIZ_QUESTIONS } from "../constants";

const QuizPerformanceDemo: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const { getSuggestions, isLoading, error, wasCached, source } =
    useLocalQuizApi();

  const handleQuickTest = async () => {
    // Set some sample answers for quick testing
    const testAnswers = {
      activity: "Solving complex puzzles or math problems.",
      role: "The analyst, focusing on data and logic.",
      environment: "A quiet, focused environment where I can concentrate.",
      subject: "Mathematics or Physics",
      priority: "Continuous learning and intellectual challenges.",
    };

    setAnswers(testAnswers);
    setStartTime(Date.now());
    setSuggestions([]);

    try {
      const result = await getSuggestions(testAnswers, "standard");
      setSuggestions(result);
      setEndTime(Date.now());
    } catch (err) {
      console.error("Test failed:", err);
      setEndTime(Date.now());
    }
  };

  const responseTime = startTime && endTime ? endTime - startTime : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        🚀 Local Quiz Performance Demo
      </h2>

      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
          ✨ New Local Quiz System Benefits:
        </h3>
        <ul className="list-disc list-inside text-green-700 dark:text-green-400 space-y-1">
          <li>
            ⚡ <strong>Instant responses</strong> - No API calls needed
          </li>
          <li>
            💾 <strong>Offline capable</strong> - Works without internet
          </li>
          <li>
            🎯 <strong>Pattern-based matching</strong> - More accurate
            suggestions
          </li>
          <li>
            💰 <strong>Cost effective</strong> - No external API costs
          </li>
          <li>
            🔒 <strong>Privacy focused</strong> - Data stays local
          </li>
        </ul>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={handleQuickTest}
          disabled={isLoading}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Testing..." : "🧪 Run Quick Test"}
        </button>
      </div>

      {/* Performance Metrics */}
      {responseTime !== null && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            📊 Performance Metrics:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {responseTime}ms
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {wasCached ? "✅" : "🆕"}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {wasCached ? "Cached" : "Fresh"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {source || "N/A"}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Source</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {suggestions.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Suggestions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Answers */}
      {Object.keys(answers).length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            📝 Test Answers:
          </h4>
          <div className="space-y-2 text-sm">
            {Object.entries(answers).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-24 capitalize">
                  {key}:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            ❌ Error:
          </h4>
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Suggestions Display */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            🎯 Career Suggestions:
          </h4>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <h5 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                {index + 1}. {suggestion.career}
              </h5>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {suggestion.description}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-white dark:bg-gray-700 p-2 rounded">
                <strong>Why it's a good fit:</strong> {suggestion.reasoning}
              </p>
              {suggestion.roadmapPath && (
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
                    Roadmap: {suggestion.roadmapPath}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          🔧 Technical Details:
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>
            • Quiz suggestions are now generated locally using pattern matching
          </div>
          <div>
            • Patterns are stored in both JSON files and database for redundancy
          </div>
          <div>• System falls back gracefully if database is unavailable</div>
          <div>• Responses are cached to improve subsequent load times</div>
          <div>• No external API calls means faster, more reliable service</div>
        </div>
      </div>
    </div>
  );
};

export default QuizPerformanceDemo;
