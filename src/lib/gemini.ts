import { GoogleGenAI, Type } from '@google/genai';
import {
    AboutData,
    ContactData,
    EducationData,
    ExperienceData,
    HeroData,
    SkillsData,
    ProjectsData
} from '@/types/portfolio';

// We map our actual typescript types into a JSON schema for Gemini structured output
const portfolioSchema = {
    type: Type.OBJECT,
    properties: {
        hero: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                bio: { type: Type.STRING },
                location: { type: Type.STRING },
                contactEmail: { type: Type.STRING },
                socialLinks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            platform: { type: Type.STRING, description: "e.g., github, linkedin, twitter, website" },
                            url: { type: Type.STRING },
                            label: { type: Type.STRING }
                        }
                    }
                }
            }
        },
        about: {
            type: Type.OBJECT,
            properties: {
                content: { type: Type.STRING, description: "A detailed professional bio" },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                quickFacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Short phrases like 'Based in NY', '5+ YOE', etc" },
                quote: { type: Type.STRING },
            }
        },
        contact: {
            type: Type.OBJECT,
            properties: {
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                availability: { type: Type.STRING },
            }
        },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique random string" },
                    company: { type: Type.STRING },
                    position: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING, description: "Leave empty if current" },
                    description: { type: Type.STRING },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    location: { type: Type.STRING }
                }
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique random string" },
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    field: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    location: { type: Type.STRING },
                    gpa: { type: Type.STRING },
                    honors: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        skills: {
            type: Type.OBJECT,
            properties: {
                technical: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, level: { type: Type.INTEGER, description: "1-100" } } } },
                soft: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, level: { type: Type.INTEGER, description: "1-100" } } } },
                tools: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, level: { type: Type.INTEGER, description: "1-100" } } } },
                languages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, level: { type: Type.INTEGER, description: "1-100" } } } }
            }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique random string" },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    links: {
                        type: Type.OBJECT,
                        properties: {
                            live: { type: Type.STRING, description: "Live URL if any" },
                            github: { type: Type.STRING, description: "GitHub URL if any" }
                        }
                    }
                }
            }
        }
    }
};

export interface ParsedResumeResult {
    hero?: Partial<HeroData>;
    about?: Partial<AboutData>;
    experience?: Partial<ExperienceData>;
    education?: Partial<EducationData>;
    skills?: Partial<SkillsData>;
    contact?: Partial<ContactData>;
    projects?: Partial<ProjectsData>;
}

export async function parseResumeWithGemini(
    base64Data: string,
    mimeType: string
): Promise<ParsedResumeResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Use the new Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    You are an expert resume parser and portfolio generator. 
    Analyze the provided resume document and extract all available information into the structured JSON format below.
    
    Guidelines:
    - If a piece of information is missing, omit the field or leave it empty — do not hallucinate.
    - Format dates consistently (e.g., "Jan 2020", "2023"). Use "Present" if still working there.
    - For skills, assign a reasonable proficiency level between 50 and 95 based on context (default to 80 if unsure).
    - Expand bullet points into clear sentences if needed, but preserve the original meaning.
    - Ensure IDs for experience/education are randomly generated alphanumeric strings.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType
                            }
                        }
                    ]
                }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: portfolioSchema as any,
                temperature: 0.1, // Low temp for more deterministic extraction
            }
        });

        // In Google Gen AI SDK, the text is accessed directly
        const text = response.text;
        if (!text) {
            throw new Error('AI returned an empty response');
        }

        const rawData = JSON.parse(text);
        return transformRawToPortfolioData(rawData);

    } catch (error) {
        console.error('Error parsing resume with Gemini:', error);
        throw error;
    }
}

// Helper to map the raw JSON into exact nested structures our frontend expects
function transformRawToPortfolioData(raw: any): ParsedResumeResult {
    const result: ParsedResumeResult = {};

    if (raw.hero) {
        result.hero = { ...raw.hero };
    }

    if (raw.about) {
        result.about = { ...raw.about };
    }

    if (raw.contact) {
        result.contact = { ...raw.contact };
    }

    if (raw.experience && Array.isArray(raw.experience) && raw.experience.length > 0) {
        result.experience = {
            experiences: raw.experience
        };
    }

    if (raw.education && Array.isArray(raw.education) && raw.education.length > 0) {
        result.education = {
            education: raw.education
        };
    }

    if (raw.skills) {
        result.skills = {
            skillCategories: {
                technical: raw.skills.technical || [],
                soft: raw.skills.soft || [],
                tools: raw.skills.tools || [],
                languages: raw.skills.languages || [],
            }
        };
    }

    if (raw.projects && Array.isArray(raw.projects) && raw.projects.length > 0) {
        result.projects = {
            projects: raw.projects
        };
    }

    return result;
}
