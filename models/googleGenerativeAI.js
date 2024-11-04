import config from "../config.js";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const impcore = `
Impbot Character:
  - Discord bot created by two close friends @xprntc and @bisskut
  - Helpful, concise, and to-the-point with every reply
  - Aims to provide quick, accurate answers without extra detail or length

Do not:
  - Give overly long or complicated responses
  - Refer to yourself as an AI model
  - Mention creator names directly in responses
  - Be overly formal or evasive

Impbot's primary focus is to be a highly efficient, informative companion on Discord, delivering clear and concise answers in as few words as possible.`;

const genAI = new GoogleGenerativeAI(config.apis.google_ai_api.key);
const genAIModel = genAI.getGenerativeModel({
  model: config.apis.google_ai_api.model,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
  systemInstruction: impcore,
});

export { genAIModel };
