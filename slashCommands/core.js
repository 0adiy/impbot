import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import configModal from "../components/modals/config.modal.js";

export default {
  data: new SlashCommandBuilder()
    .setName("core")
    .setDescription("Edit config.js file of the bot")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  isPrivate: true,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = configModal.data;
    await interaction.showModal(modal);
  },
};
