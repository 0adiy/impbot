import {
  SlashCommandBuilder,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import taskSelectMenu from "../components/selectMenus/task.select.js";
import taskSchema from "../models/task.model.js";
import { isSuperUser, loadAllTasks } from "../utils/generalUtils.js";
import { COLORS } from "../utils/enums.js";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default {
  data: new SlashCommandBuilder()
    .setName("todo")
    .setDescription("Lists all the tasks.")
    .addStringOption(option =>
      option
        .setName("task")
        .setDescription("The task to be done")
        .setMaxLength(80)
        .setRequired(false)
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    // Auth
    if (!isSuperUser(interaction.user)) {
      return interaction.reply("You are not allowed to do this");
    }

    const taskMessage = interaction.options.getString("task") ?? null;
    let content = null;

    // const clearButton = new ButtonBuilder()
    //   .setCustomId("clearall")
    //   .setLabel("Clear All")
    //   .setStyle(ButtonStyle.Danger);

    // const markButton = new ButtonBuilder()
    //   .setCustomId("markall")
    //   .setLabel("Mark All")
    //   .setStyle(ButtonStyle.Success);

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
        value: `By ${user.username} on ${formatDate(task.date)}`,
      });
    }

    taskSelect.setOptions(
      tasks.map(task => ({
        label: task.task,
        value: task._id.toString(),
      }))
    );

    embed.setTitle(`${tasks.length} tasks pending`);

    // const firstRow = new ActionRowBuilder().addComponents(
    //   markButton,
    //   clearButton
    // );

    const secondRow = new ActionRowBuilder().addComponents(taskSelect);

    await interaction.editReply({
      content: content,
      embeds: [embed],
      components: [/*firstRow,*/ secondRow],
    });
  },
};
