import { updateInteraction, validatePlayer } from "../../utils/gameUtils.js";

export default {
  name: "cosmic_LEFT",
  isPrivate: false,
  description: "Move your character to the left",
  async execute(interaction, client) {
    await interaction.deferUpdate();
    const gameState = client.games.get(interaction.user.id);
    if (!validatePlayer(gameState, interaction)) return;
    gameState.playerPos = Math.max(0, gameState.playerPos - 1);
    await updateInteraction(gameState, interaction, client);
  },
};
