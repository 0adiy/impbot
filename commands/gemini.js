import { EmbedBuilder } from "discord.js";
import { logEvent } from "../utils/generalUtils.js";

export default {
  name: "gemini",
  isPrivate: false,
  args: [],
  description: "Summon Gemini to join the conversation",
  aliases: ["g", "ai"],
  guildOnly: false,
  /**
   * Summons AI and makes it participate in the conversation
   *
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    const model = client.contextualAI;

    const MIN_PROMPT_LENGTH = 1500;
    let prompt = "";
    let fetchedMessages = [];
    let lastMessageId = null;

    const botPermissions = message.channel.permissionsFor(client.user);
    if (!botPermissions.has("READ_MESSAGE_HISTORY"))
      return message.channel.send("Necessary permissions missing.");

    while (prompt.length < MIN_PROMPT_LENGTH) {
      let messages = await message.channel.messages.fetch({
        limit: 5,
        ...(lastMessageId ? { before: lastMessageId } : {}),
      });
      if (messages.size == 0) break;
      messages = messages.filter(
        message =>
          !message.author.bot || message.author.id === client.user.id
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
    try {
      let result = await model.generateContent(prompt);
      console.log(prompt);
      const response = result.response.text();
      message.channel.send(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
