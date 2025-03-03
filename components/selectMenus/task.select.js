import {
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuInteraction,
} from "discord.js";

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
    await interaction.reply("hi");
  },
};
