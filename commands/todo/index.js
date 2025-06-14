import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import taskSelectMenu from "../../components/selectMenus/task.select.js";
import taskSchema from "../../models/task.model.js";
import * as util from "./util.js";
import { COLORS } from "../../utils/enums.js";

const taskCmd = {
  name: "task",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PRIVATE,
};

export default {
  ...taskCmd,
  data: new SlashCommandBuilder()
    .setName("todo")
    .setDescription("Lists all the tasks.")
    .addStringOption(option =>
      option
        .setName("task")
        .setDescription("The task to be done")
        .setMaxLength(90)
        .setRequired(false)
    )
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]),
  isPrivate: true,
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
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

    const tasks = await util.loadAllTasks(taskSchema, client);
    const taskSelect = taskSelectMenu.data;

    for (const task of tasks) {
      let user = await client.users.fetch(task.userId);
      embed.addFields({
        name: task.task,
        value: `By ${user.username} on ${util.formatDate(task.date)}`,
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
