import { EmbedBuilder } from "discord.js";
import { COLORS, ANIMATIONS } from "../utils/enums.js";
function dropAliens(gameState) {
  gameState.tick++;
  gameState.aliens = gameState.aliens.map(a => ({ x: a.x, y: a.y + 1 }));
  gameState.aliens = gameState.aliens.filter(a => a.y < gameState.height);
  gameState.spawnCooldown = gameState.spawnCooldown.map(cd =>
    Math.max(0, cd - 1)
  );

  if (gameState.tick % 2 === 0) {
    const available = [];
    for (let x = 0; x < gameState.width; x++) {
      const columnOccupiedNearTop = gameState.aliens.some(
        a => a.x === x && a.y <= 2
      );
      if (!columnOccupiedNearTop && gameState.spawnCooldown[x] === 0) {
        available.push(x);
      }
    }
    if (available.length > 0) {
      const x = available[Math.floor(Math.random() * available.length)];
      gameState.aliens.push({ x, y: 0 });
      gameState.spawnCooldown[x] = 3;
    }
  }

  if (
    gameState.aliens.some(
      a => a.y === gameState.height - 1 && a.x === gameState.playerPos
    )
  ) {
    gameState.isOver = true;
  }
  return gameState.isOver;
}

async function updateEmbed(gameState, interaction, client) {
  const embed = new EmbedBuilder()
    .setTitle(gameState.isOver ? `Game Over` : `🪐 Cosmic: Hellfire`)
    .setDescription(updateDisplay(gameState))
    .setThumbnail(
      gameState.isOver ? ANIMATIONS.GAME_OVER : ANIMATIONS.SPACE_ROCKET
    )
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
  const emptySpace = " ";
  let display = "";
  for (let y = 0; y < gameState.height; y++) {
    let row = "";
    for (let x = 0; x < gameState.width; x++) {
      const alienHere = gameState.aliens.some(a => a.x === x && a.y === y);
      row += alienHere ? "👾" : emptySpace;
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
