import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import config from "./config.js";
import { handleMessage } from "./methods/messageHandler.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.GuildVoiceStates],
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

client.once("ready", () => {
  console.log(`Authorized as ${client.user.username}`);
});

client.on("messageCreate", async (message) => {
  await handleMessage(message);
});

client.login(config.TOKEN);
