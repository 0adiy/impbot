import { updateEmbed } from "../../utils/gameUtils.js";
export default {
  name: "cosmic_LEFT",
  isPrivate: false,
  description: "Move your character to the left",
  async execute(interaction, client) {
    const gameState = client.games.get(interaction.user.id);
    if (!gameState || gameState.isOver) return;
    gameState.playerPos = Math.max(0, gameState.playerPos - 1);
    await interaction.deferUpdate();
    await updateEmbed(gameState, interaction, client);
  },
};
