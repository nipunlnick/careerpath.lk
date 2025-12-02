"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  totalRoadmaps: number;
  totalCategories: number;
  totalViews: number;
}

interface Roadmap {
  _id: string;
  name: string;
  category: string;
  slug: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, roadmapsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/roadmaps"),
      ]);

      const statsData = await statsRes.json();
      const roadmapsData = await roadmapsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (roadmapsData.success) setRoadmaps(roadmapsData.roadmaps);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/admin/roadmaps?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setRoadmaps(roadmaps.filter((r) => r._id !== id));
        // Update stats locally
        if (stats)
          setStats({ ...stats, totalRoadmaps: stats.totalRoadmaps - 1 });
      } else {
        alert("Failed to delete roadmap");
      }
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      alert("An error occurred while deleting");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Total Roadmaps
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.totalRoadmaps || 0}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Categories
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.totalCategories || 0}
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Total Views
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats?.totalViews || 0}
            </p>
          </div>
        </div>

        {/* Roadmaps Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Recent Roadmaps
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {roadmaps.map((roadmap) => (
                  <tr
                    key={roadmap._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {roadmap.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {roadmap.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {roadmap.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(roadmap.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/roadmaps/${roadmap.slug}`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(roadmap._id, roadmap.name)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
