import { Events } from "discord.js";
import { loadAndSetAllReminders } from "../utils/generalUtils.js";
import { logEvent } from "../utils/generalUtils.js";
import reminderSchema from "../models/reminder.model.js";
import { loadAllCommands } from "../handlers/commandHandler.js";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logEvent("UP", client, null);
    loadAndSetAllReminders(reminderSchema, client);
    // Manually invoked to load reminders scheduled for the near future into memory.
    setInterval(
      () => loadAndSetAllReminders(reminderSchema, client),
      24 * 60 * 60 * 1000
    );

    //loads message commands, slash commands and mod commands into Client
    await loadAllCommands(client);
  },
};
