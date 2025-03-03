import {
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { deleteTask } from "../../utils/generalUtils.js";
import taskSchema from "../../models/task.model.js";

export default {
  id: "task_select",
  data: new StringSelectMenuBuilder()
    .setCustomId("task_select")
    .setPlaceholder("Choose a task to delete"),
  /**
   *
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const task = interaction.values[0];
    const [userId, taskMessage] = task.split("_", 2);
    const deletedTask = await deleteTask(taskSchema, userId, taskMessage);
    const message = deletedTask
      ? "Task deleted successfully"
      : "Task not found";
    await interaction.reply({ content: message });
  },
};
