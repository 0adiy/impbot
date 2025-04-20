import {
  Client,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  EmbedBuilder,
} from "discord.js";
import { COLORS } from "../../utils/enums.js";
import taskSchema from "../../models/task.model.js";
import { isSuperUser } from "../../utils/generalUtils.js";

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
    // Auth
    if (!isSuperUser(interaction.user)) {
      return interaction.reply("This action is not permitted.");
    }

    const taskId = interaction.values[0];
    const deletedTask = await taskSchema.findOneAndDelete({ _id: taskId });

    let colour, title, description;
    if (deletedTask) {
      colour = COLORS.SUCCESS;
      title = "Task Deleted";
      description = `*Deleted task:* ${deletedTask.task}`;
    } else {
      colour = COLORS.ERROR;
      title = "Task Not Found";
      description = `The task has already been deleted`;
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(colour)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
