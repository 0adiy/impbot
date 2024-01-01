import { Events } from "discord.js";
import { loadSlashCommands } from "../handlers/slashCommandHandler.js";
import { loadAndSetAllReminders } from "../utils/generalUtils.js";
import reminderSchema from "../models/reminder.model.js";
// import { loadMessageCommands } from "../handlers/messageCommandHandler.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`😈 ${client.user.tag} is ready!`);

    // Loading Commands
    // loadMessageCommands(client);
    await loadAndSetAllReminders(reminderSchema, client);
    loadSlashCommands(client);
  },
};
