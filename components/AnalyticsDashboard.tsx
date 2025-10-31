import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface QuizStats {
  totalQuizzes: number;
  standardQuizzes: number;
  longQuizzes: number;
  avgResponseTime: number;
  popularCareers: Array<{
    career: string;
    count: number;
    percentage: number;
  }>;
  patternUsage: Array<{
    patternId: string;
    patternName: string;
    usage: number;
    successRate: number;
  }>;
  dailyStats: Array<{
    date: string;
    quizCount: number;
    avgResponseTime: number;
  }>;
  sourceBreakdown: {
    database: number;
    localPatterns: number;
    fallback: number;
  };
}

interface SystemMetrics {
  serverUptime: number;
  databaseConnections: number;
  cacheHitRate: number;
  errorRate: number;
  activeUsers: number;
}

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  // Admin check
  const isAdmin =
    user?.email &&
    ["admin@careerpath.lk", "nipun@careerpath.lk"].includes(user.email);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchAnalytics();
  }, [user, isAdmin, navigate, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY || "dev-admin-key-2024";
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const [quizResponse, metricsResponse] = await Promise.all([
        fetch(`${apiBase}/api/analytics/quiz-stats?range=${timeRange}`, {
          headers: {
            "X-Admin-Key": adminKey,
          },
        }),
        fetch(`${apiBase}/api/analytics/system-metrics`, {
          headers: {
            "X-Admin-Key": adminKey,
          },
        }),
      ]);

      if (!quizResponse.ok || !metricsResponse.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const quizData = await quizResponse.json();
      const metricsData = await metricsResponse.json();

      setQuizStats(quizData.data);
      setSystemMetrics(metricsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        Please log in to access the dashboard.
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-4">
          Access Denied
        </h2>
        <p className="text-red-600 dark:text-red-400">
          You don't have permission to access the analytics dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Error Loading Analytics
        </h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome back, {user.displayName || user.email}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {quizStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Total Quizzes</h3>
            <p className="text-3xl font-bold">
              {quizStats.totalQuizzes.toLocaleString()}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              {quizStats.standardQuizzes} standard, {quizStats.longQuizzes} long
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Avg Response Time</h3>
            <p className="text-3xl font-bold">{quizStats.avgResponseTime}ms</p>
            <p className="text-green-100 text-sm mt-1">Lightning fast! ⚡</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Cache Hit Rate</h3>
            <p className="text-3xl font-bold">
              {systemMetrics?.cacheHitRate || 0}%
            </p>
            <p className="text-purple-100 text-sm mt-1">Efficient caching</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Error Rate</h3>
            <p className="text-3xl font-bold">
              {systemMetrics?.errorRate || 0}%
            </p>
            <p className="text-orange-100 text-sm mt-1">System reliability</p>
          </div>
        </div>
      )}

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Careers */}
        {quizStats?.popularCareers && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Popular Career Suggestions
            </h3>
            <div className="space-y-3">
              {quizStats.popularCareers.slice(0, 10).map((career, index) => (
                <div
                  key={career.career}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-800 dark:text-white">
                      {career.career}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {career.count} ({career.percentage.toFixed(1)}%)
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${career.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Usage */}
        {quizStats?.patternUsage && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Quiz Pattern Performance
            </h3>
            <div className="space-y-3">
              {quizStats.patternUsage.map((pattern) => (
                <div
                  key={pattern.patternId}
                  className="border-b border-gray-200 dark:border-gray-600 pb-3"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                      {pattern.patternName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {pattern.usage} uses
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${pattern.successRate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {pattern.successRate.toFixed(1)}% success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Source Breakdown and Daily Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Breakdown */}
        {quizStats?.sourceBreakdown && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Suggestion Sources
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Database Patterns
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 dark:text-white font-semibold">
                    {quizStats.sourceBreakdown.database}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (quizStats.sourceBreakdown.database /
                            quizStats.totalQuizzes) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Local Patterns
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 dark:text-white font-semibold">
                    {quizStats.sourceBreakdown.localPatterns}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (quizStats.sourceBreakdown.localPatterns /
                            quizStats.totalQuizzes) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Fallback
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 dark:text-white font-semibold">
                    {quizStats.sourceBreakdown.fallback}
                  </span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (quizStats.sourceBreakdown.fallback /
                            quizStats.totalQuizzes) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Status */}
        {systemMetrics && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Server Uptime
                </span>
                <span className="text-gray-800 dark:text-white font-semibold">
                  {Math.floor(systemMetrics.serverUptime / 3600)}h{" "}
                  {Math.floor((systemMetrics.serverUptime % 3600) / 60)}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Database Connections
                </span>
                <span className="text-gray-800 dark:text-white font-semibold">
                  {systemMetrics.databaseConnections}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Active Users
                </span>
                <span className="text-gray-800 dark:text-white font-semibold">
                  {systemMetrics.activeUsers}
                </span>
              </div>
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-green-800 dark:text-green-300 font-medium">
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Stats Chart Placeholder */}
      {quizStats?.dailyStats && quizStats.dailyStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Daily Quiz Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-2 text-gray-600 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-right py-2 text-gray-600 dark:text-gray-300">
                    Quizzes
                  </th>
                  <th className="text-right py-2 text-gray-600 dark:text-gray-300">
                    Avg Response
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizStats.dailyStats.slice(-7).map((day) => (
                  <tr
                    key={day.date}
                    className="border-b border-gray-100 dark:border-gray-700"
                  >
                    <td className="py-2 text-gray-800 dark:text-white">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-right text-gray-800 dark:text-white font-medium">
                      {day.quizCount}
                    </td>
                    <td className="py-2 text-right text-gray-600 dark:text-gray-300">
                      {day.avgResponseTime}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
