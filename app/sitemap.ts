import { MetadataRoute } from "next";
import { CareerRoadmapService } from "@/lib/models/CareerRoadmap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages definitions
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://careerpath.lk",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://careerpath.lk/about",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://careerpath.lk/quiz",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://careerpath.lk/long-quiz",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://careerpath.lk/roadmaps",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://careerpath.lk/soft-skills",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    // Dynamic page generation from database
    const activeRoadmaps = await CareerRoadmapService.getAllActive(1000);
    const dynamicPages: MetadataRoute.Sitemap = activeRoadmaps.map((roadmap) => ({
      url: `https://careerpath.lk/roadmaps/${roadmap.slug}`,
      lastModified: roadmap.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error("Error generating sitemap dynamic paths:", error);
    return staticPages;
  }
}
