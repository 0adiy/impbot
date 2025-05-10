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
    .setThumbnail(ANIMATIONS.SPACE_ROCKET)
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
      const hasProjectile = gameState.projectiles.some(
        p => p.x === x && p.y === y
      );
      const hasAlien = gameState.aliens.some(a => a.x === x && a.y === y);
      if (hasProjectile) {
        row += gameState.projectileAsset;
      } else if (hasAlien) {
        row += gameState.alienAsset;
      } else {
        row += emptySpace;
      }
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

function processProjectiles(gameState) {
  gameState.projectiles = gameState.projectiles.map(p => ({
    x: p.x,
    y: p.y - 1,
  }));
  const newProjectiles = [];
  for (const projectile of gameState.projectiles) {
    if (projectile.y < 0) continue;
    const alienIndex = gameState.aliens.findIndex(
      a => a.x === projectile.x && a.y === projectile.y
    );
    if (alienIndex !== -1) {
      gameState.aliens.splice(alienIndex, 1);
      gameState.score += 5;
    } else {
      newProjectiles.push(projectile);
    }
  }
  gameState.projectiles = newProjectiles;
}

function validatePlayer(gameState, interaction) {
  if (
    !gameState ||
    gameState.isOver ||
    interaction.user.id !== gameState.playerId
  )
    return false;
  return true;
}

export {
  dropAliens,
  updateInteraction,
  updateDisplay,
  processProjectiles,
  validatePlayer,
};
