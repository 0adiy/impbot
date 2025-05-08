import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { COLORS } from "../utils/enums.js";

const state = {
  width: 4,
  height: 8,
  playerPos: Math.floor(4 / 2),
  aliens: [],
  display: "",
  score: 0,
  isOver: false,
};

function updateDisplay(state) {
  let display = "";
  const emptySpace = " ";

  for (let y = 0; y < state.height; y++) {
    let row = "";
    for (let x = 0; x < state.width; x++) {
      const hasAlien = state.aliens.some(a => a.x === x && a.y === y);
      row += hasAlien ? "👾" : emptySpace;
    }
    display += row + "\n";
  }

  let playerRow = "";
  for (let x = 0; x < state.width; x++) {
    playerRow += x === state.playerPos ? "👩‍🚀" : emptySpace;
  }

  display += playerRow;
  state.display = display;
  return display;
}

async function updateEmbed(state, controlRow, interaction, client) {
  const embed = new EmbedBuilder()
    .setTitle(`🪐 Cosmic: Hellfire`)
    .setDescription(updateDisplay(state))
    .setFooter({ text: `© ${new Date().getFullYear()} The Evil Inc.` })
    .setColor(COLORS.PRIMARY);

  await interaction.editReply({ embeds: [embed], components: [controlRow] });
}

function dropAliens(state) {
  state.aliens = state.aliens.map(a => ({ x: a.x, y: a.y + 1 }));
  state.aliens.push({
    x: Math.floor(Math.random() * state.width),
    y: 0,
  });

  if (state.aliens.some(a => a.y === state.height && a.x === state.playerPos)) {
    state.isOver = true;
  } else {
    state.aliens = state.aliens.filter(a => a.y <= state.height);
    state.isOver = false;
  }

  return state.isOver;
}

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
    await updateEmbed(state, controlRow, interaction, client);
    let gameLoop = setInterval(async () => {
      if (state.isOver) {
        clearInterval(interval);
        return interaction.followUp({ content: "💥 Game Over!" });
      }
      dropAliens(state);
      await updateEmbed(state, controlRow, interaction, client);
    }, 1500);
  },
};
