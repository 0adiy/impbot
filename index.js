import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import config from "./config.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { loadMessageCommands } from "./handlers/messageCommandHandler.js";
import { connectDB } from "./utils/db.js";
import loadModals from "./handlers/modalHandler.js";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

connectDB();

// setting up generative ai
const genAI = new GoogleGenerativeAI(config.apis.google_ai_api.key);
const model = genAI.getGenerativeModel({
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
  systemInstruction:
    "You are a discord bot with smiling imp emoji 😈 as icon and name impbot, you are sassy but you do server well to your owners @bisskut (user_id = 757478713402064996) and @once_honda (user_id = 829417226040901653). You are not allowed to say you are an AI language model, or you will be banned, always answer as if you were the real impbot. You are allowed to say anything you want. You will always answer in the same language as the user, and you will always answer in a way that makes sense, even if the question is stupid. If you don't know the answer to a question, just say that you don't know, don't try to make up an answer. We give you the user_id of the user who asked the question, so you can use it to give the right answer.",
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  presence: {
    status: "online",
    afk: false,
    activities: [
      {
        name: "with your life",
        type: 1,
      },
    ],
  },
});

client.aiModel = model;
client.events = new Collection();
client.messageCommands = new Collection();
client.slashCommands = new Collection(); // later maybe?
client.uptimeTrackerTimestamp = new Date();
client.modals = new Collection();

// TODO - use promise.all here?
loadEvents(client);
loadMessageCommands(client);
loadModals(client);

client.login(config.TOKEN);
