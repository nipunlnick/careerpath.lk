import { Metadata } from "next";
import { CareerRoadmapService } from "@/lib/models/CareerRoadmap";
import { RoadmapDetailsClient } from "./RoadmapDetailsClient";

interface Props {
  params: Promise<{ careerPath: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.careerPath;

  try {
    const roadmap = await CareerRoadmapService.getBySlug(slug);

    if (!roadmap) {
      return {
        title: "Career Roadmap Not Found | CareerPath.lk",
        description: "The requested career roadmap could not be found. Explore other career paths on CareerPath.lk.",
      };
    }

    const title = `${roadmap.name} Step-by-Step Career Roadmap | CareerPath.lk`;
    const description = roadmap.description || `Comprehensive step-by-step guidelines, institutes, estimated monthly salary, and job market demand insights in Sri Lanka for a career as a ${roadmap.name}.`;

    return {
      title,
      description,
      alternates: {
        canonical: `https://careerpath.lk/roadmaps/${slug}`,
      },
      openGraph: {
        type: "article",
        url: `https://careerpath.lk/roadmaps/${slug}`,
        title,
        description,
        siteName: "CareerPath.lk",
        images: [
          {
            url: "https://careerpath.lk/cplogo.png",
            width: 1200,
            height: 630,
            alt: `Step-by-step Career roadmap for ${roadmap.name} in Sri Lanka`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["https://careerpath.lk/cplogo.png"],
      },
    };
  } catch (error) {
    console.error("Error generating dynamic metadata:", error);
    return {
      title: "Career Roadmap Details | CareerPath.lk",
      description: "Explore step-by-step career guidelines, education paths, and market demand insights in Sri Lanka.",
    };
  }
}

export default function RoadmapDetailsPage() {
  return <RoadmapDetailsClient />;
}
