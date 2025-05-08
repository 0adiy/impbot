import {
  SlashCommandBuilder,
  ModalBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import fs from "fs/promises";

export default {
  data: new SlashCommandBuilder()
    .setName("core")
    .setDescription("Edit config.js file of the bot")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const fileContents = await fs.readFile("./config.js", { encoding: "utf8" });
    const textbox = new TextInputBuilder()
      .setCustomId("contents")
      .setLabel("config.js")
      .setRequired(true)
      .setValue(fileContents)
      .setStyle(TextInputStyle.Paragraph);
    const configModal = new ModalBuilder()
      .setCustomId("configModal")
      .setTitle("Configuration")
      .addComponents(new ActionRowBuilder().addComponents(textbox));
    await interaction.showModal(configModal);
  },
};
