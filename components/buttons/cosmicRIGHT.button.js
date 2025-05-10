import { updateInteraction, validatePlayer } from "../../utils/gameUtils.js";

export default {
  name: "cosmic_RIGHT",
  isPrivate: false,
  description: "Move your character to the right",
  async execute(interaction, client) {
    await interaction.deferUpdate();
    const gameState = client.games.get(interaction.user.id);
    if (!validatePlayer(gameState, interaction)) return;
    gameState.playerPos = Math.min(
      gameState.width - 1,
      gameState.playerPos + 1
    );
    await updateInteraction(gameState, interaction, client);
  },
};
