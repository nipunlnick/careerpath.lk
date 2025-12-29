"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditSoftSkill() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  interface SoftSkillFormData {
    name: string;
    slug: string;
    description: string;
    levelsJson: string;
    resourcesJson: string;
    tags: string;
  }

  const [formData, setFormData] = useState<SoftSkillFormData>({
    name: "",
    slug: "",
    description: "",
    levelsJson: "[]",
    resourcesJson: "[]",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchSkill();
  }, [id]);

  const fetchSkill = async () => {
    try {
      const res = await fetch(`/api/admin/soft-skills?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setFormData({
          name: data.skill.name,
          slug: data.skill.slug,
          description: data.skill.description,
          levelsJson: JSON.stringify(data.skill.levels || [], null, 2),
          resourcesJson: JSON.stringify(data.skill.resources || [], null, 2),
          tags: (data.skill.tags || []).join(", "),
        });
      } else {
        setError("Skill not found");
      }
    } catch (err) {
      setError("Failed to load skill");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let levels = [];
      let resources = [];

      try {
        levels = JSON.parse(formData.levelsJson);
      } catch (e) {
        throw new Error("Invalid JSON in Levels");
      }

      try {
        resources = JSON.parse(formData.resourcesJson);
      } catch (e) {
        throw new Error("Invalid JSON in Resources");
      }

      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/soft-skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: id,
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          levels,
          resources,
          tags,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/soft-skills");
      } else {
        setError(data.error || "Failed to update");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-900 dark:text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Edit Soft Skill
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="e.g. communication, leadership"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Levels (JSON)
            </label>
            <textarea
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 font-mono text-sm"
              value={formData.levelsJson}
              onChange={(e) =>
                setFormData({ ...formData, levelsJson: e.target.value })
              }
              placeholder='[{"level": 1, "title": "Beginner", "description": "..."}]'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Resources (JSON)
            </label>
            <textarea
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2 font-mono text-sm"
              value={formData.resourcesJson}
              onChange={(e) =>
                setFormData({ ...formData, resourcesJson: e.target.value })
              }
              placeholder='[{"title": "Book", "url": "..."}]'
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
