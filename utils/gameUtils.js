import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";
function dropAliens(gameState) {
  gameState.aliens = gameState.aliens.map(a => ({ x: a.x, y: a.y + 1 }));
  gameState.aliens.push({
    x: Math.floor(Math.random() * gameState.width),
    y: 0,
  });

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

async function updateEmbed(gameState, interaction, client) {
  const embed = new EmbedBuilder()
    .setTitle(gameState.isOver ? `Game Over` : `🪐 Cosmic: Hellfire`)
    .setDescription(updateDisplay(gameState))
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setFooter({
      text: `Score: ${
        gameState.score
      } | © ${new Date().getFullYear()} The Evil Inc.`,
    })
    .setColor(gameState.isOver ? COLORS.ERROR : COLORS.PRIMARY);
  await interaction.editReply({
    embeds: [embed],
    components: [gameState.controlRow],
  });
}

function updateDisplay(gameState) {
  let display = "";
  const emptySpace = " ";

  for (let y = 0; y < gameState.height; y++) {
    let row = "";
    for (let x = 0; x < gameState.width; x++) {
      const hasAlien = gameState.aliens.some(a => a.x === x && a.y === y);
      row += hasAlien ? "👾" : emptySpace;
    }
    display += row + "\n";
  }

  let playerRow = "";
  for (let x = 0; x < gameState.width; x++) {
    playerRow += x === gameState.playerPos ? "👩‍🚀" : emptySpace;
  }

  display += playerRow;
  gameState.display = display;
  return display;
}

export { dropAliens, updateEmbed, updateDisplay };
