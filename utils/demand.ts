export interface DemandBadge {
  text: string;
  icon: string;
  className: string;
}

/**
 * Returns a customized demand badge mapping for hot/high-demand/emerging careers in Sri Lanka.
 */
export function getDemandBadge(careerName?: string): DemandBadge | null {
  if (!careerName || typeof careerName !== "string") return null;
  const name = careerName.toLowerCase();

  // High Demand: Core technical engineering, medical roles, and cybersecurity
  if (
    name.includes("software") ||
    name.includes("developer") ||
    name.includes("cybersecurity") ||
    name.includes("security") ||
    name.includes("network") ||
    name.includes("doctor") ||
    name.includes("surgeon") ||
    name.includes("nurse") ||
    name.includes("civil engineer") ||
    name.includes("mechanical engineer") ||
    name.includes("electrical engineer")
  ) {
    return {
      text: "High Demand",
      icon: "📈",
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
    };
  }

  // Emerging: Advanced data science, artificial intelligence, biotech, and sustainability
  if (
    name.includes("data scientist") ||
    name.includes("data analyst") ||
    name.includes("ai ") ||
    name.includes("machine learning") ||
    name.includes("deep learning") ||
    name.includes("blockchain") ||
    name.includes("renewable energy") ||
    name.includes("biotechnology") ||
    name.includes("biotech") ||
    name.includes("robotics")
  ) {
    return {
      text: "Emerging",
      icon: "🚀",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
    };
  }

  // Hot: Rapid growth fields like UI/UX design, marketing automation, e-commerce, and edtech
  if (
    name.includes("ui/ux") ||
    name.includes("design") ||
    name.includes("digital marketer") ||
    name.includes("marketing") ||
    name.includes("e-commerce") ||
    name.includes("content creator") ||
    name.includes("tutor") ||
    name.includes("entrepreneur") ||
    name.includes("product manager")
  ) {
    return {
      text: "Hot",
      icon: "🔥",
      className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
    };
  }

  // Fallback default for any matches (so all suggestions are appealing)
  return {
    text: "Growing",
    icon: "⭐",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
  };
}
