import { SlashCommandBuilder } from "discord.js";
import { logEvent } from "../utils/generalUtils.js";

export default {
  data: new SlashCommandBuilder()
    .setName("gemini")
    .setDescription("Ask Gemini anything!")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("Enter your prompt")
        .setRequired(true)
    ),
  /**
   * Ask Gemini
   *
   * @typedef {import("discord.js").ChatInputCommandInteraction} ChatInputCommandInteraction
   * @typedef {import("discord.js").Client} Client
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    interaction.deferReply();
    const query = interaction.options.getString("query");
    try {
      let result = await client.queryAI.generateContent(
        `${interaction.user.username}: ${query}`
      );
      const response = result.response.text();
      interaction.editReply(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
