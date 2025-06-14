import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType,
} from "discord.js";
import config from "./config.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { connectDB } from "./utils/db.js";
import loadModals from "./handlers/modalHandler.js";
import loadSelectMenus from "./handlers/selectMenuHandler.js";
import {
  createContextBasedAI,
  createQueryBasedAI,
  createTranslatorAI,
} from "./utils/googleGenerativeAI.js";
import loadReactionCommands from "./handlers/reactionCommandHandler.js";
import loadButtons from "./handlers/buttonHandler.js";

connectDB();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
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
        type: ActivityType.Playing,
      },
    ],
  },
});

client.contextualAI = createContextBasedAI();
client.queryAI = createQueryBasedAI();
client.events = new Collection();
client.uptimeTrackerTimestamp = new Date();
client.modals = new Collection();
client.selectMenus = new Collection();
client.reactionCommands = new Collection();
client.buttons = new Collection();
client.translatorAI = createTranslatorAI();
client.games = new Map(); //cosmic

//these are being registered at ready event
client.messageCommands = new Collection();
client.slashCommands = new Collection();
client.modCommands = new Collection();

loadEvents(client);
loadModals(client);
loadSelectMenus(client);
loadReactionCommands(client);
loadButtons(client);
client.login(config.TOKEN);
