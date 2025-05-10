import { updateInteraction, validatePlayer } from "../../utils/gameUtils.js";

export default {
  name: "cosmic_SHOOT",
  isPrivate: false,
  description: "Fire a projectile towards the aliens",
  async execute(interaction, client) {
    await interaction.deferUpdate();
    const gameState = client.games.get(interaction.user.id);
    if (!validatePlayer(gameState, interaction)) return;
    gameState.projectiles.push({
      x: gameState.playerPos,
      y: gameState.height - 1,
    });
    await updateInteraction(gameState, interaction, client);
  },
};
