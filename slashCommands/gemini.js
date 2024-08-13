import { SlashCommandBuilder } from "discord.js";
import { logEvent } from "../utils/generalUtils";

export default {
  data: new SlashCommandBuilder()
    .setName("gemini")
    .setDescription("Chat with Gemini")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("Enter your prompt")
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option
        .setName("image")
        .setDescription("Provide an attachment")
        .setRequired(false)
    ),
  /**
   * Shows pfp of a desired user
   *
   * @typedef {import("discord.js").ChatInputCommandInteraction} ChatInputCommandInteraction
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const model = client.aiModel;
    const query = interaction.options.getString("query");
    const image = interaction.options.getAttachment("image");

    const prompt = `@${interaction.user.username}: ${query}`;

    interaction.deferReply();
    try {
      let result;
      if (image) {
        const imageData = {
          data: await image.toBuffer(),
          mimeType: image.contentType,
        };
        result = await model.generateContent([prompt, imageData]);
      } else {
        result = await model.generateContent(prompt);
      }
      const response = result.response.text();
      interaction.editReply(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
