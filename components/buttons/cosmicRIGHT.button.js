import { updateInteraction } from "../../utils/gameUtils.js";

export default {
  name: "cosmic_RIGHT",
  isPrivate: false,
  description: "Move your character to the right",
  async execute(interaction, client) {
    const gameState = client.games.get(interaction.user.id);
    if (!gameState || gameState.isOver) return;
    if (interaction.user.id !== gameState.playerId) {
      return interaction.reply({
        content: "You can't play someone else's game.",
        ephemeral: true,
      });
    }
    gameState.playerPos = Math.min(
      gameState.width - 1,
      gameState.playerPos + 1
    );
    await interaction.deferUpdate();
    await updateInteraction(gameState, interaction, client);
  },
};
