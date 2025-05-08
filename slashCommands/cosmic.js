import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { dropAliens, updateEmbed, updateDisplay } from "../utils/gameUtils.js";

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
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const gameState = {
      width: 4,
      height: 8,
      playerPos: Math.floor(4 / 2),
      aliens: [],
      display: "",
      score: 0,
      isOver: false,
      loop: null,
    };

    client.games.set(interaction.user.id, gameState);

    gameState.controlRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cosmic_LEFT")
        .setLabel("LEFT")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cosmic_RIGHT")
        .setLabel("RIGHT")
        .setStyle(ButtonStyle.Primary)
    );

    await updateEmbed(gameState, interaction, client);

    gameState.loop = setInterval(async () => {
      if (gameState.isOver) {
        clearInterval(gameState.loop);
        client.games.delete(interaction.user.id);
        return updateEmbed(gameState, interaction, client);
      }
      dropAliens(gameState);
      await updateEmbed(gameState, interaction, client);
    }, 1500);
  },
};
