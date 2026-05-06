import { model } from "../config/gemini";
import { ResumeInput } from "../types/resume";
import { buildPrompt } from "../utils/promptBuilder";

export const generateResume = async (data: ResumeInput) => {
  const prompt = buildPrompt(data);

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();

  try {
    return JSON.parse(text);
  } catch (error) {
    return { raw: text };
  }
};
