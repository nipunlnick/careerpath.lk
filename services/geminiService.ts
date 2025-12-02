
import { GoogleGenAI, Type } from "@google/genai";
import type { CareerSuggestion, RoadmapStep, MarketInsights } from '../types';

let ai: GoogleGenAI | null = null;

function initializeAI() {
  if (ai !== null) return ai;
  
  const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!API_KEY) {
    console.warn("GEMINI_API_KEY environment variable is not set. Gemini API features will be disabled.");
    return null;
  }
  
  ai = new GoogleGenAI({ apiKey: API_KEY });
  console.log("✅ Gemini AI initialized successfully");
  return ai;
}

const careerSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "An array of 3 career suggestions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    career: { type: Type.STRING, description: "The name of the suggested career path." },
                    description: { type: Type.STRING, description: "A brief description of the career." },
                    reasoning: { type: Type.STRING, description: "Why this career is a good fit based on the quiz answers." },
                    roadmapPath: { type: Type.STRING, description: "The specific career field to use for generating a roadmap (e.g., 'Software Engineering')." }
                },
                required: ["career", "description", "reasoning", "roadmapPath"]
            }
        }
    },
    required: ["suggestions"]
};

const roadmapAndInsightsSchema = {
    type: Type.OBJECT,
    properties: {
        category: {
            type: Type.STRING,
            description: "The most appropriate category for this career from the provided list."
        },
        roadmap: {
            type: Type.ARRAY,
            description: "A 5-step career roadmap.",
            items: {
                type: Type.OBJECT,
                properties: {
                    step: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    qualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    salaryRangeLKR: { type: Type.STRING, description: "Estimated monthly salary in Sri Lankan Rupees (LKR), e.g., 'LKR 80,000 - 150,000'." },
                    institutes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of relevant institutes or companies in Sri Lanka." }
                },
                required: ["step", "title", "description", "duration", "qualifications", "skills", "salaryRangeLKR", "institutes"]
            }
        },
        insights: {
            type: Type.OBJECT,
            properties: {
                demand: { type: Type.STRING, description: "Current job market demand in Sri Lanka (e.g., 'High', 'Growing')." },
                salaryExpectations: { type: Type.STRING, description: "A summary of the salary range from trainee to senior in LKR." },
                requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                futureOutlook: { type: Type.STRING, description: "The future prospects for this career in Sri Lanka." }
            },
            required: ["demand", "salaryExpectations", "requiredSkills", "futureOutlook"]
        }
    },
    required: ["category", "roadmap", "insights"]
};

const checkApi = () => {
    const apiInstance = initializeAI();
    if (!apiInstance) {
        throw new Error("Gemini API is not configured. Please ensure the GEMINI_API_KEY is set correctly.");
    }
    return apiInstance;
}

export const suggestCareers = async (answers: Record<string, string>): Promise<CareerSuggestion[]> => {
    const ai = checkApi();
    try {
        const prompt = `
        Based on the following quiz answers from a Sri Lankan student, suggest 3 suitable career paths.
        
        Quiz Answers:
        - Enjoys: ${answers.activity}
        - Team Role: ${answers.role}
        - Preferred Environment: ${answers.environment}
        - Favorite Subject: ${answers.subject}
        - Career Priority: ${answers.priority}

        For each suggestion, provide a brief description, explain why it's a good fit based on their answers, and provide a specific career field name that can be used to generate a detailed roadmap.
        Tailor the suggestions to the Sri Lankan job market and context.
        Ensure the 3 suggestions are distinct from each other (e.g., not all IT roles if possible, unless strongly indicated).
        The output must be a valid JSON object matching the provided schema.
        `;
        
        const response = await ai!.models.generateContent({
            model: "gemini-pro-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: careerSuggestionSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.suggestions as CareerSuggestion[];

    } catch (error) {
        console.error("Error suggesting careers:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to suggest careers: ${errorMessage}`);
    }
};

export const suggestCareersLong = async (answers: Record<string, string>): Promise<CareerSuggestion[]> => {
    const ai = checkApi();
    try {
        const prompt = `
        A Sri Lankan student has completed an in-depth career quiz. Based on their detailed answers below, provide 3 highly personalized career path suggestions.

        In-Depth Quiz Answers:
        - Problem-Solving Approach: ${answers.problemSolving}
        - Preferred Work Style: ${answers.workStyle}
        - Long-Term Ambition: ${answers.ambition}
        - Prefers to Work With: ${answers.workWith}
        - Preferred Learning Style: ${answers.learningStyle}
        - Handling Pressure: ${answers.pressure}
        - Desired Impact: ${answers.impact}
        - Core Work Value: ${answers.workValue}
        - Attitude to Risk: ${answers.riskAttitude}
        - Desired Reputation in 10 Years: ${answers.reputation}
        - Fulfilling Daily Tasks: ${answers.dailyTasks}
        - Ideal Work-Life Balance: ${answers.workLifeBalance}
        - Source of Satisfaction: ${answers.satisfactionSource}
        - Reaction to Failure: ${answers.failureReaction}
        - Preferred Leadership Style: ${answers.leadershipStyle}

        For each suggestion, provide a concise description of the career, a detailed reasoning that connects specific answers to the career choice, and a specific career field name for roadmap generation.
        The suggestions must be relevant to the Sri Lankan job market.
        Ensure the suggestions cover different aspects of their potential (e.g., one safe bet, one ambitious, one creative).
        The output must be a valid JSON object matching the provided schema.
        `;
        
        const response = await ai!.models.generateContent({
            model: "gemini-pro-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: careerSuggestionSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.suggestions as CareerSuggestion[];

    } catch (error) {
        console.error("Error suggesting careers:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to suggest careers: ${errorMessage}`);
    }
};

export const generateRoadmap = async (careerName: string, categories: string[]): Promise<{ roadmap: RoadmapStep[], insights: MarketInsights, category: string }> => {
    const ai = checkApi();
    try {
        const prompt = `
        Generate a detailed 5-step career roadmap and market insights for the career of a "${careerName}" in Sri Lanka.

        The roadmap should start from foundational education (like A/Ls) and progress to a senior-level position in about 5 steps. For each step, provide a title, description, typical duration, necessary qualifications, key skills to acquire, an estimated monthly salary range in LKR, and relevant Sri Lankan institutes/companies.

        The market insights should summarize the current demand, salary expectations, key required skills, and future outlook for this career within the Sri Lankan context.

        Also, select the most appropriate category for this career from the following list:
        ${JSON.stringify(categories)}

        The output must be a valid JSON object matching the provided schema.
        `;

        const response = await ai!.models.generateContent({
            model: "gemini-pro-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: roadmapAndInsightsSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as { roadmap: RoadmapStep[], insights: MarketInsights, category: string };

    } catch (error) {
        console.error(`Error generating roadmap for ${careerName}:`, error);
        throw new Error(`Failed to generate a roadmap for "${careerName}". The model may be unavailable or the request was invalid.`);
    }
};