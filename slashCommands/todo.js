import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import taskSelectMenu from "../components/selectMenus/task.select.js";
import taskSchema from "../models/task.model.js";
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

    const tasks = await loadAllTasks(taskSchema, client);
    const taskSelect = taskSelectMenu.data;

    for (const task of tasks) {
      let user = await client.users.fetch(task.userId);
      embed.addFields({
        name: task.task,
        value: user.username,
      });
      taskSelect.setOptions(
        tasks.map(task => ({
          label: task.task,
          value: `task_${task._id}`,
        }))
      );
    }

    embed.setTitle(`${tasks.length} tasks pending`);

    const firstRow = new ActionRowBuilder().addComponents(
      markButton,
      clearButton
    );

    const secondRow = new ActionRowBuilder().addComponents(taskSelect);

    await interaction.editReply({
      content: content,
      embeds: [embed],
      components: [firstRow, secondRow],
    });
  },
};
