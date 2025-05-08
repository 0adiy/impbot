import { updateEmbed } from "../../utils/gameUtils.js";
export default {
  name: "cosmic_RIGHT",
  isPrivate: false,
  description: "Move your character to the right",
  async execute(interaction, client) {
    const gameState = client.games.get(interaction.user.id);
    if (!gameState || gameState.isOver) return;
    gameState.playerPos = Math.min(
      gameState.width - 1,
      gameState.playerPos + 1
    );
    await interaction.deferUpdate();
    await updateEmbed(gameState, interaction, client);
  },
};
