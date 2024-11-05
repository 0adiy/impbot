import { SlashCommandBuilder } from "discord.js";
import { logEvent } from "../utils/generalUtils.js";

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
   * @typedef {import("discord.js").Client} Client
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const model = client.aiModel;
    const query = interaction.options.getString("query");
    const image = interaction.options.getAttachment("image");

    // REVIEW - it loads recent 5 messages from channel and uses only first 500 charcters of it, incase it's too long
    // it still can cause errors though, need to double check (delete after reading)
    const botPermissions = interaction.channel.permissionsFor(client.user);

    let prompt = "";
    if (botPermissions.has("READ_MESSAGE_HISTORY")) {
      const messages = await interaction.channel.messages.fetch({ limit: 5 });
      messages.forEach(msg => {
        prompt += `@${msg.author.username}: ${msg.content.slice(0, 500)}\n`;
      });
    }

    prompt = "Context:\n" + prompt;
    prompt += `\nQuery:\n@${interaction.user.username}: ${query}`;

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
