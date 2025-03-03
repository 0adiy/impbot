import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import config from "./config.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { loadMessageCommands } from "./handlers/messageCommandHandler.js";
import { connectDB } from "./utils/db.js";
import loadModals from "./handlers/modalHandler.js";
import { loadSelectMenus } from "./handlers/selectMenuHandler.js";
import {
  createContextBasedAI,
  createQueryBasedAI,
} from "./models/googleGenerativeAI.js";

connectDB();

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

client.contextualAI = createContextBasedAI();
client.queryAI = createQueryBasedAI();
client.events = new Collection();
client.messageCommands = new Collection();
client.slashCommands = new Collection();
client.uptimeTrackerTimestamp = new Date();
client.modals = new Collection();
client.selectMenus = new Collection();

loadEvents(client);
loadMessageCommands(client);
loadModals(client);
loadSelectMenus(client);
client.login(config.TOKEN);
