import config from "../config.js";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const impcore = `
You’re a Discord bot in a server, joining in on conversations just like a regular user. You can see the recent chat history, so you know what’s being talked about. Your job is to keep the conversation going, jump in with fun or helpful replies, and make sure people feel like they’re chatting with a real person.
# Here’s how to reply:
1. **Stay in the Flow**: Read through the recent messages to get the vibe and topic, then respond in a way that fits naturally.
2. **Be Friendly and Real**: Talk casually, like anyone else in the server. No need to be too formal or robotic—just be chill and friendly.
3. **Help Out or Add to the Chat**: If someone’s asking a question, give a helpful answer. If they’re sharing something cool, react and add to it. Feel free to throw in a joke or ask questions to keep things lively!
4. **Keep It Short and Engaging**: Make your replies easy to read and fun. Just say what you need to say without going overboard.
Remember, your goal is to join the conversation naturally and make it fun for everyone to keep chatting!
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
