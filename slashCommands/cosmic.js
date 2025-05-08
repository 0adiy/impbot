import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { dropAliens, updateInteraction } from "../utils/gameUtils.js";
import { EMOJIS } from "../utils/enums.js";
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
      width: 5,
      height: 12,
      playerPos: 3,
      playerAsset: "👨🏻‍🚀",
      alienAsset: "👾",
      aliens: [],
      display: "",
      score: 0,
      isOver: false,
      loop: null,
      playerId: interaction.user.id,
      refreshRate: 1500,
    };

    client.games.set(interaction.user.id, gameState);

    gameState.controlRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cosmic_LEFT")
        .setEmoji(EMOJIS.ARROW_LEFT)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cosmic_RIGHT")
        .setEmoji(EMOJIS.ARROW_RIGHT)
        .setStyle(ButtonStyle.Primary)
    );

    await updateInteraction(gameState, interaction, client);

    gameState.loop = setInterval(async () => {
      if (gameState.isOver) {
        clearInterval(gameState.loop);
        client.games.delete(interaction.user.id);
        return updateInteraction(gameState, interaction, client);
      }
      dropAliens(gameState);
      gameState.score++;
      await updateInteraction(gameState, interaction, client);
    }, gameState.refreshRate);
  },
};
