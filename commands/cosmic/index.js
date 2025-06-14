import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import {
  dropAliens,
  updateInteraction,
  processProjectiles,
} from "../../utils/gameUtils.js";
import { EMOJIS } from "../../utils/enums.js";

const cosmic = {
  name: "cosmic",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...cosmic,
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
      projectiles: [],
      projectileAsset: "🔺",
      display: "",
      score: 0,
      isOver: false,
      loop: null,
      playerId: interaction.user.id,
      refreshRate: 1500,
      controlRow: null,
    };

    client.games.set(interaction.user.id, gameState);

    gameState.controlRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cosmic_LEFT")
        .setEmoji(EMOJIS.ARROW_LEFT)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("cosmic_SHOOT")
        .setEmoji("🔫")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("cosmic_RIGHT")
        .setEmoji(EMOJIS.ARROW_RIGHT)
        .setStyle(ButtonStyle.Secondary)
    );

    await updateInteraction(gameState, interaction, client);

    gameState.loop = setInterval(async () => {
      if (gameState.isOver) {
        clearInterval(gameState.loop);
        client.games.delete(interaction.user.id);
        return updateInteraction(gameState, interaction, client);
      }
      const gameOver = dropAliens(gameState);
      processProjectiles(gameState);
      if (gameOver || gameState.isOver) {
        gameState.isOver = true;
        clearInterval(gameState.loop);
        client.games.delete(interaction.user.id);
        return updateInteraction(gameState, interaction, client);
      }
      gameState.score++;
      await updateInteraction(gameState, interaction, client);
    }, gameState.refreshRate);
  },
};
