import { Events } from "discord.js";
import { loadSlashCommands } from "../handlers/slashCommandHandler.js";
// import { loadMessageCommands } from "../handlers/messageCommandHandler.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`😈 ${client.user.tag} is ready!`);

    // Loading Commands
    // loadMessageCommands(client);
    loadSlashCommands(client);
  },
};
