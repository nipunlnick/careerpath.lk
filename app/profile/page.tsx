"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useSavedRoadmaps } from "../../hooks/api/useSavedRoadmaps";
import { useUserStats } from "../../hooks/api/useUserStats";
import { UserStatsService } from "../../services/userStatsService";
import {
  Activity,
  Book,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle,
  ClipboardList,
  Download,
  Filter,
  GraduationCap,
  Lightbulb,
  Money,
  Search,
  Star,
  Target,
  TrendingUp,
  User,
} from "../../components/icons";
import { usePageMeta } from "../../hooks/usePageMeta";
import { RoadmapDownloadService } from "../../services/downloadService";

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  date: Date;
  icon: string;
}

const Profile: React.FC = () => {
  usePageMeta(
    "Your Profile | CareerPath.lk",
    "View your user profile and access your saved career roadmaps on CareerPath.lk."
  );
  const { currentUser } = useAuth();
  const {
    savedRoadmaps,
    isLoading,
    error: savedRoadmapsError,
    unsaveRoadmap,
  } = useSavedRoadmaps();
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    formatAccountAge,
  } = useUserStats();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  // Fetch recent activity using the service
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!currentUser) {
        setActivityLoading(false);
        return;
      }

      try {
        setActivityLoading(true);
        setActivityError(null);

        const activities = await UserStatsService.getRecentActivity(
          currentUser.uid,
          5
        );
        setRecentActivity(activities);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load recent activity";
        setActivityError(errorMessage);
        setRecentActivity([]); // Set empty array on error
      } finally {
        setActivityLoading(false);
      }
    };

    fetchRecentActivity();
  }, [currentUser]);

  const handleUnsaveRoadmap = async (
    roadmapSlug: string,
    roadmapName: string
  ) => {
    if (
      confirm(
        `Are you sure you want to remove "${roadmapName}" from your saved roadmaps?`
      )
    ) {
      await unsaveRoadmap(roadmapSlug);
    }
  };

  // Filter and search roadmaps
  const filteredRoadmaps = savedRoadmaps.filter((roadmap) => {
    const matchesSearch = roadmap.roadmapName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "recent") {
      const savedDate = new Date(roadmap.savedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && savedDate > weekAgo;
    }
    if (selectedFilter === "with-notes") {
      return matchesSearch && roadmap.notes && roadmap.notes.trim().length > 0;
    }

    return matchesSearch;
  });

  const handleDownloadRoadmap = async (roadmap: any) => {
    try {
      await RoadmapDownloadService.downloadAsPDF(
        roadmap.roadmapName,
        roadmap.roadmapData?.roadmap || [],
        roadmap.roadmapData?.insights,
        {
          includeNotes: roadmap.notes,
          includeInsights: true,
        }
      );
    } catch (error) {
      console.error("Error downloading roadmap:", error);
    }
  };

  const getActivityIcon = (iconName: string) => {
    const iconClass = "w-5 h-5 text-green-600";
    switch (iconName) {
      case "ClipboardList":
        return <ClipboardList className={iconClass} />;
      case "Bookmark":
        return <Bookmark className={iconClass} />;
      case "Star":
        return <Star className={iconClass} />;
      default:
        return <Activity className={iconClass} />;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 rounded-xl shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-green-100 text-lg">
                Welcome, {currentUser?.displayName || currentUser?.email}
              </p>
              <div className="flex items-center mt-2 space-x-4 text-sm text-green-100">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member for {formatAccountAge(stats.accountAge)}
                </div>
                {stats.lastQuizDate && (
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    Last quiz:{" "}
                    {new Date(stats.lastQuizDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Link
              href="/quiz"
              className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
            >
              Take New Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Error Display for Statistics */}
      {statsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading statistics</p>
          <p className="text-sm">{statsError}</p>
        </div>
      )}

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Quizzes Taken
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? "..." : statsError ? "—" : stats.quizzesTaken}
              </p>
            </div>
            <ClipboardList className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Saved Roadmaps
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {isLoading ? "..." : statsError ? "—" : stats.roadmapsSaved}
              </p>
            </div>
            <Bookmark className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Career Explorations
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {statsLoading
                  ? "..."
                  : statsError
                  ? "—"
                  : stats.totalCareerExplorations}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Progress Rate
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {statsLoading
                  ? "..."
                  : statsError
                  ? "—"
                  : `${stats.completionRate}%`}
              </p>
            </div>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Recent Activity
            </h3>
            <Link
              href="/roadmaps"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {activityLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center space-x-4"
                >
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activityError ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 font-medium">
                Error loading activity
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activityError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="bg-white dark:bg-gray-600 p-2 rounded-full">
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No recent activity
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Start exploring careers to see your activity here!
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2 text-green-600" />
            Quick Actions
          </h3>
          <div className="space-y-4">
            <Link
              href="/quiz"
              className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <ClipboardList className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Career Quiz</p>
                <p className="text-sm text-green-100">Discover your path</p>
              </div>
            </Link>

            <Link
              href="/long-quiz"
              className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Target className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Detailed Quiz</p>
                <p className="text-sm text-blue-100">In-depth analysis</p>
              </div>
            </Link>

            <Link
              href="/roadmaps"
              className="w-full bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Browse Roadmaps</p>
                <p className="text-sm text-purple-100">Explore careers</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Saved Roadmaps Section */}
      {savedRoadmapsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {savedRoadmapsError}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Bookmark className="w-6 h-6 mr-2 text-green-600" />
            Your Saved Roadmaps ({filteredRoadmaps.length})
          </h2>

          {savedRoadmaps.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Roadmaps</option>
                  <option value="recent">Recent (Last Week)</option>
                  <option value="with-notes">With Notes</option>
                </select>
                <Filter className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading your roadmaps...
            </p>
          </div>
        ) : filteredRoadmaps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoadmaps.map((savedRoadmap) => (
                <div
                  key={savedRoadmap._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1">
                      <Bookmark className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                        {savedRoadmap.roadmapName}
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        handleUnsaveRoadmap(
                          savedRoadmap.roadmapSlug,
                          savedRoadmap.roadmapName
                        )
                      }
                      className="text-red-500 hover:text-red-700 p-1 ml-2 flex-shrink-0"
                      title="Remove roadmap"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    Saved on{" "}
                    {new Date(savedRoadmap.savedAt).toLocaleDateString()}
                  </div>

                  {savedRoadmap.notes && (
                    <div className="mb-4 p-3 bg-white dark:bg-gray-600 rounded-md border-l-4 border-green-500">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong className="text-green-600 dark:text-green-400">
                          Notes:
                        </strong>{" "}
                        {savedRoadmap.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/roadmaps/${savedRoadmap.roadmapSlug}`}
                      className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      View Roadmap
                    </Link>
                    <button
                      onClick={() => handleDownloadRoadmap(savedRoadmap)}
                      className="bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {savedRoadmaps.length !== filteredRoadmaps.length && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredRoadmaps.length} of {savedRoadmaps.length}{" "}
                  roadmaps
                </p>
              </div>
            )}
          </>
        ) : savedRoadmaps.length > 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No roadmaps match your search
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("all");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              No Saved Roadmaps Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Start your career exploration journey! Take a quiz or explore our
              roadmap collection to find and save paths that interest you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Take Career Quiz
              </Link>
              <Link
                href="/roadmaps"
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Roadmaps
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
