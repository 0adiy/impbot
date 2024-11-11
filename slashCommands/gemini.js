import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { logEvent, capitalizeFirstLetter } from "../utils/generalUtils.js";
import { COLORS } from "../utils/enums.js";

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
      let embed = new EmbedBuilder()
        .setTitle(capitalizeFirstLetter(query))
        .setDescription(response)
        .setColor(COLORS.PRIMARY)
        .setTimestamp(new Date())
        .setFooter({
          text: `${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
