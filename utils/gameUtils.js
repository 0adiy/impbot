import { EmbedBuilder, Emoji } from "discord.js";
import { COLORS, ANIMATIONS, EMOJIS } from "../utils/enums.js";
function dropAliens(gameState) {
  gameState.aliens = gameState.aliens.map(a => ({ x: a.x, y: a.y + 1 }));
  const validColumns = [];
  for (let x = 0; x < gameState.width; x++) {
    const crowded = gameState.aliens.some(a => a.x === x && a.y <= 2);
    if (!crowded) validColumns.push(x);
  }
  if (validColumns.length > 0) {
    const x = validColumns[Math.floor(Math.random() * validColumns.length)];
    gameState.aliens.push({ x, y: 0 });
  }
  if (
    gameState.aliens.some(
      a => a.y === gameState.height && a.x === gameState.playerPos
    )
  ) {
    gameState.isOver = true;
  } else {
    gameState.aliens = gameState.aliens.filter(a => a.y <= gameState.height);
    gameState.isOver = false;
  }
  return gameState.isOver;
}

async function updateInteraction(gameState, interaction, client) {
  const gameOverEmbed = new EmbedBuilder()
    .setTitle(`🪐 Cosmic: Hellfire`)
    .setDescription(`Game Over | Score: **${gameState.score}**`)
    .setImage(ANIMATIONS.GAME_OVER)
    .setFooter({ text: `© ${new Date().getFullYear()} The Evil Inc.` })
    .setColor(COLORS.ERROR);
  const message = updateDisplay(gameState);
  if (gameState.isOver)
    return interaction.editReply({ embeds: [gameOverEmbed] });
  await interaction.editReply({
    content: message,
    components: [gameState.controlRow],
  });
}

function updateDisplay(gameState) {
  let display = "";
  const emptySpace = EMOJIS.BLANK_SPACE;

  for (let y = 0; y < gameState.height; y++) {
    let row = "";
    for (let x = 0; x < gameState.width; x++) {
      const hasAlien = gameState.aliens.some(a => a.x === x && a.y === y);
      row += hasAlien ? gameState.alienAsset : emptySpace;
    }
    display += row + "\n";
  }

  let playerRow = "";
  for (let x = 0; x < gameState.width; x++) {
    playerRow += x === gameState.playerPos ? gameState.playerAsset : emptySpace;
  }

  display += playerRow;
  gameState.display = display;
  return display;
}

export { dropAliens, updateInteraction, updateDisplay };
