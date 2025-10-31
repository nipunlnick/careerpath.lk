
import type { Timestamp } from 'firebase/firestore';

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
  savedAt: Timestamp;
}

export interface MarketInsights {
  salaryRange: string;
  demand: string;
  salaryExpectations: string;
  requiredSkills: string[];
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