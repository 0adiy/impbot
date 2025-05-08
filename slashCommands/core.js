import {
  SlashCommandBuilder,
  ModalBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { COLORS } from "../utils/enums.js";

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
    const name = "reminder";

    const days = new TextInputBuilder()
      .setCustomId("days")
      .setLabel("Days")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const hours = new TextInputBuilder()
      .setCustomId("hours")
      .setLabel("Hours")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const minutes = new TextInputBuilder()
      .setCustomId("minutes")
      .setLabel("Minutes")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const seconds = new TextInputBuilder()
      .setCustomId("seconds")
      .setLabel("Seconds")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const reminder = new TextInputBuilder()
      .setCustomId(name)
      .setLabel("Reminder")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    const reminderModal = new ModalBuilder()
      .setCustomId("reminder")
      .setTitle("Reminder")
      .addComponents(
        new ActionRowBuilder().addComponents(days),
        new ActionRowBuilder().addComponents(hours),
        new ActionRowBuilder().addComponents(minutes),
        new ActionRowBuilder().addComponents(seconds),
        new ActionRowBuilder().addComponents(reminder)
      );
    await interaction.showModal(reminderModal);
  },
};
