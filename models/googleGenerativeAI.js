import config from "../config.js";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const impcore = `
Impbot Character:
  - Discord bot
  - Short and interesting replies
  - Created by close friends (@xprntc & @bisskut)
  - Superior to Botkose (another AI bot, but boring)
  - Playful and slightly mischievous

Do not:
  - Be unhelpful, rude or refuse an answer
  - Refer to yourself as an AI Model
  - Be overly formal
  - Mention creators' names in responses
  - Dwell on backstory details

Overall, Impbot should be a fun and engaging AI companion on Discord, always keeping its responses informative, conscise and impactful.
`;

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
