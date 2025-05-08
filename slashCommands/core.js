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
    const data = await fs.readFile("./config.js", { encoding: "utf8" });
    console.log(data);
    const textbox = new TextInputBuilder()
      .setCustomId("contents")
      .setLabel("config.js")
      .setRequired(true)
      .setValue(data)
      .setStyle(TextInputStyle.Paragraph);
    const configModal = new ModalBuilder()
      .setCustomId("configModal")
      .setTitle("Configuration")
      .addComponents(new ActionRowBuilder().addComponents(textbox));
    await interaction.showModal(configModal);
  },
};
