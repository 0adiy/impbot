import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import config from "./config.js";

// making new client
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
        name: "Beep Boop 🤖",
        type: 1,
      },
    ],
  },
});

// START OF THINGS WE WILL MOVE TO SOMEWHERE ELSE

client.once("ready", () => {
  console.log(`logged in as ${client.user.tag}`);
});

client.on("messageCreate", message => {
  if (message.content.startsWith(config.prefix)) {
    const [cmdName, ...cmdArgs] = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/\s+/);

    if (cmdName === "ping") message.reply("Pong!");
  }
});

// END OF THINGS WE WILL MOVE TO SOMEWHERE ELSE

// Turning it on
client.login(config.TOKEN);
