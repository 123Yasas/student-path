
import { GoogleGenAI, Type } from "@google/genai";
import { TestResult, Roadmap, MentorTip } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-flash-preview for basic text and structured data generation as per guidelines
const MODEL_NAME = "gemini-3-flash-preview";

export const analyzeStudentProfile = async (
  answers: { question: string; answer: string }[]
): Promise<TestResult> => {
  const prompt = `
    Analyze this student's behavioral preferences and provide a world-class Engineering Career Architecture report.
    
    ANSWERS:
    ${answers.map((a) => `- ${a.question}: ${a.answer}`).join("\n")}
    
    OUTPUT SCHEMA REQUIREMENTS:
    1. personalitySummary: Empowering 2-3 sentence overview of their work archetype.
    2. recommendedBranches: List 2 major high-level fields (e.g. Embedded Systems, Fintech, Aerospace) with reasoning linked to their answers.
    3. subDomains: List 4 specific, trending technical niches for 2025.
    
    Ensure the response is a strict JSON object matching the provided schema.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      personalitySummary: { type: Type.STRING },
      recommendedBranches: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            branch: { type: Type.STRING },
            reason: { type: Type.STRING },
          },
          required: ["branch", "reason"],
        },
      },
      subDomains: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: ["personalitySummary", "recommendedBranches", "subDomains"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("API returned empty text content.");
    return JSON.parse(text) as TestResult;
  } catch (error) {
    console.error("Discovery Engine Failure:", error);
    throw error;
  }
};

export const suggestAchievements = async (stats: any, roadmaps: any[]): Promise<any[]> => {
  const prompt = `
    Suggest 3 professional milestones for a student with:
    Stats: ${stats.studyHours}h study, ${stats.problemsSolved} problems.
    Roadmaps: ${roadmaps.map(r => r.domain).join(', ')}.
    
    Return JSON array of {title, description, icon, category}.
  `;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "description", "icon", "category"]
          }
        }
      }
    });
    return JSON.parse(result.text || "[]");
  } catch (e) {
    return [];
  }
};

export const generateLearningRoadmap = async (domain: string): Promise<Roadmap> => {
  const prompt = `Create a 4-phase technical roadmap for becoming an expert in "${domain}". Include Fundamentals, Intermediate, Advanced, and Industry Capstone.`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "duration", "topics"],
              },
            },
          },
          required: ["phases"],
        }
      },
    });

    const data = JSON.parse(result.text || "{}");
    const phases = (data.phases || []).map((phase: any) => ({
      ...phase,
      topics: (phase.topics || []).map((topic: string) => ({
        name: topic,
        completed: false
      }))
    }));

    return {
      id: crypto.randomUUID(),
      domain,
      phases,
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Roadmap Generation Failure:", error);
    throw error;
  }
};

export const refinePortfolioContent = async (content: string): Promise<string> => {
  const prompt = `Rewrite this achievement description for a top-tier engineering portfolio. Be professional and action-oriented: "${content}"`;
  try {
    const result = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
    return result.text || content;
  } catch (error) {
    return content;
  }
};

export const getDailyMentorTip = async (): Promise<MentorTip> => {
  const prompt = "Generate a daily mentor tip for a technical student. Include a quote, author, and one practical engineering study tip.";
  try {
    const result = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    quote: { type: Type.STRING },
                    author: { type: Type.STRING },
                    tip: { type: Type.STRING }
                },
                required: ["quote", "author", "tip"]
            }
        }
    });
    return JSON.parse(result.text || "{}") as MentorTip;
  } catch (e) {
      return {
          quote: "Discipline is the bridge between goals and accomplishment.",
          author: "Jim Rohn",
          tip: "Focus on first principles to understand complex systems."
      };
  }
};
