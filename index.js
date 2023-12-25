import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import config from "./config.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { loadMessageCommands } from "./handlers/messageCommandHandler.js";
import { connectDB } from "./utils/db.js";
import loadModals from "./handlers/modalHandler.js";

// NOTE - this is currently turned off for VPS
// connectDB(); // REVIEW - we can use promise.all for all command, modal, button,etc loaders and this connectDB

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
