import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("gemini")
    .setDescription("Chat with Gemini")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("The question to ask Gemini")
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option
        .setName("image")
        .setDescription("An image to use as context")
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

    const prompt = `${interaction.user.id} @${interaction.user.username}#${interaction.user.discriminator}: ${query}`;

    interaction.deferReply();

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
  },
};
