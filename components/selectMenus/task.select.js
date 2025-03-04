import {
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuInteraction,
  EmbedBuilder,
} from "discord.js";
import { COLORS } from "../../utils/enums.js";
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
    const taskId = interaction.values[0];
    const deletedTask = await taskSchema.findOneAndDelete({ _id: taskId });

    let colour, title, description;
    if (deletedTask) {
      colour = COLORS.SUCCESS;
      title = "Task Deleted";
      description = `*Deleted task:* ${deletedTask.taskMessage}`;
    } else {
      colour = COLORS.ERROR;
      title = "Task Not Found";
      description = `Failed to delete task *${deletedTask.taskMessage}*.`;
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(colour)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
