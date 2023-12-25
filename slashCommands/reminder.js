import { SlashCommandBuilder } from "discord.js";
import modal from "../components/modals/reminders.modal.js";

export default {
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Setup reminders")
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    console.log(modal.data);
    await interaction.showModal(modal.data);
  },
};
