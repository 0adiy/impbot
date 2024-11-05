import { Events } from "discord.js";
import { loadSlashCommands } from "../handlers/slashCommandHandler.js";
import { loadAndSetAllReminders } from "../utils/generalUtils.js";
import reminderSchema from "../models/reminder.model.js";
// import { loadMessageCommands } from "../handlers/messageCommandHandler.js";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`😈 ${client.user.tag} is ready!`);

    // Loading Commands
    // loadMessageCommands(client);

    // REVIEW - awaits were removed from here, don't think we need to wait for anything actually they can just happen (remove this line after reading)
    // Call loadAndSetAllReminders immediately when the bot starts and then call it every 24 hours
    loadAndSetAllReminders(reminderSchema, client);
    setInterval(
      () => loadAndSetAllReminders(reminderSchema, client),
      ONE_DAY_IN_MS
    );

    loadSlashCommands(client);
  },
};
