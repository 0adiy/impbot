import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ButtonBuilder,
} from "discord.js";
import { COLORS } from "../utils/enums.js";

export default {
  data: new SlashCommandBuilder()
    .setName("cosmic")
    .setDescription("Play a retro star blaster!")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const leftButton = new ButtonBuilder()
      .setCustomId("cosmic_LEFT")
      .setLabel("LEFT")
      .setStyle(ButtonStyle.Primary);
    const rightButton = new ButtonBuilder()
      .setCustomId("cosmic_RIGHT")
      .setLabel("RIGHT")
      .setStyle(ButtonStyle.Primary);
    const controlRow = new ActionRowBuilder().addComponents(
      leftButton,
      rightButton
    );
    const game = "Idk what to do here";
    const embed = new EmbedBuilder()
      .setTitle(`Cosmic: Hellfire`)
      .setDescription(game)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`Copyright © ${new Date().getFullYear()} The Evil Inc.`)
      .setColor(COLORS.PRIMARY);
    await interaction.editReply({ embeds: [embed], components: [controlRow] });
  },
};
