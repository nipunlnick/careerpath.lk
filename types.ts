export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  qualifications: string[];
  skills: string[];
  salaryRangeLKR: string;
  institutes: string[];
}

export interface CareerSuggestion {
  career: string;
  description: string;
  reasoning: string;
  roadmapPath: string;
}

export interface SavedRoadmap {
  field: string;
  roadmap: RoadmapStep[];
  savedAt: Date;
}

export interface MarketInsights {
  salaryRange?: string;
  demand: string;
  salaryExpectations: string;
  requiredSkills: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  toolsAndSoftware?: string[];
  certifications?: string[];
  futureOutlook: string;
}

export interface Career {
  name: string;
  path?: string;
}

export interface CareerCategory {
  name: string;
  icon: string;
  careers: Career[];
}

export interface AlternativeCareer {
  careerName: string;
  similarity: string;
  skillsOverlap: string[];
}

export interface SoftSkillRoadmap {
  name: string;
  slug: string;
  description: string;
  levels: {
    level: number;
    title: string;
    objective: string;
    description: string;
    practices: string[];
    duration: string;
  }[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'book' | 'course';
  }[];
}