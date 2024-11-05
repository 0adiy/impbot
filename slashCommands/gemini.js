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
    interaction.deferReply();

    const model = client.aiModel;
    const query = interaction.options.getString("query");

    const MIN_PROMPT_LENGTH = 1500;
    let prompt = "";
    let fetchedMessages = [];
    let lastMessageId = null;

    const botPermissions = interaction.channel.permissionsFor(client.user);
    if (!botPermissions.has("READ_MESSAGE_HISTORY"))
      return interaction.editReply("Necessary permissions missing");

    while (prompt.length < MIN_PROMPT_LENGTH) {
      let messages = await interaction.channel.messages.fetch({
        limit: 5,
        ...(lastMessageId ? { before: lastMessageId } : {}),
      });
      if (messages.size == 0) break;
      messages = messages.filter(
        message =>
          !message.author.bot ||
          message.author.id === interaction.client.user.id
      );
      messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      messages.forEach(message => {
        prompt += `${message.author.username.slice(0, 3)}: ${
          message.content
        }\n`;
        lastMessageId = message.id;
      });
      if (prompt.length >= MIN_PROMPT_LENGTH) break;
    }
    prompt += `${interaction.user.username.slice(0, 3)}: ${query}`;
    try {
      let result = await model.generateContent(prompt);
      const response = result.response.text();
      interaction.editReply(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
