import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import taskSchema from "../models/reminder.model.js";
import { loadAllTasks } from "../utils/generalUtils.js";
import { COLORS } from "../utils/enums.js";

export default {
  data: new SlashCommandBuilder()
    .setName("todo")
    .setDescription("Lists all the tasks.")
    .addStringOption(option =>
      option
        .setName("task")
        .setDescription("The task to be done")
        .setRequired(false)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const taskMessage = interaction.options.getString("task") ?? null;
    let content = null;

    const clearButton = new ButtonBuilder()
      .setCustomId("clearall")
      .setLabel("Clear All")
      .setStyle(ButtonStyle.Danger);

    const markButton = new ButtonBuilder()
      .setCustomId("markall")
      .setLabel("Mark All")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(markButton, clearButton);

    const embed = new EmbedBuilder()
      .setColor(COLORS.SUCCESS)
      .setDescription(
        "Do today what must be done. Who knows? Tomorrow, death comes."
      )
      .setTimestamp();

    if (taskMessage != null) {
      let task = {
        userId: interaction.user.id,
        task: taskMessage,
        date: Date.now(),
      };
      const doc = new taskSchema(task);
      await doc.save();
      content = "Your task was set successfully";
    }

    const tasks = loadAllTasks(taskSchema, client);
    console.log(`TASKCMD: taks --> ${tasks}`);
    console.log(`TASKCMD: taks.len --> ${tasks.length}`);

    tasks.forEach(task => {
      embed.addFields({
        name: task.task,
        value: task.date,
      });
    });

    embed.setTitle(`${tasks.length} tasks pending`);

    await interaction.editReply({
      content: content,
      embeds: [embed],
      components: [row],
    });
  },
};
