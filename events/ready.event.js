import { Events } from "discord.js";
import { loadSlashCommands } from "../handlers/slashCommandHandler.js";
import { loadAndSetAllReminders } from "../utils/generalUtils.js";
import reminderSchema from "../models/reminder.model.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`😈 ${client.user.tag} is ready!`);
    loadAndSetAllReminders(reminderSchema, client);
    // Manually invoked to load reminders scheduled for the near future into memory.
    setInterval(
      () => loadAndSetAllReminders(reminderSchema, client),
      24 * 60 * 60 * 1000
    );

    loadSlashCommands(client);
  },
};
