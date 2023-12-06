import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import config from "./config.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { loadMessageCommands } from "./handlers/messageCommandHandler.js";

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
// client.slashCommands = new Collection(); // later maybe?
client.uptimeTrackerTimestamp = new Date();

loadEvents(client);
loadMessageCommands(client);

client.login(config.TOKEN);
