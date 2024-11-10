import { EmbedBuilder } from "discord.js";
import { logEvent } from "../utils/generalUtils.js";
import config from "../config.js";

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
    const MIN_PROMPT_LENGTH = 1500;
    const MSG_FETCH_LIMIT = 5;
    let prompt = "";
    let fetchedMessages = [];
    let lastMessageId = null;

    const botPermissions = message.channel.permissionsFor(client.user);
    if (!botPermissions.has("READ_MESSAGE_HISTORY"))
      return message.channel.send("Necessary permissions missing.");

    while (prompt.length < MIN_PROMPT_LENGTH) {
      let messages = await message.channel.messages.fetch({
        limit: MSG_FETCH_LIMIT,
        ...(lastMessageId ? { before: lastMessageId } : {}),
      });

      if (messages.size == 0) break;

      fetchedMessages.push(...Array.from(messages.values()));

      lastMessageId = messages.last().id;

      messages = messages.filter(
        msg =>
          (msg.author.id === client.user.id || !msg.author.bot) &&
          !msg.content.startsWith(config.prefix)
      );

      messages.forEach(msg => {
        prompt += `${msg.author.username.slice(0, 3)}: ${msg.content}\n`;
      });

      if (prompt.length >= MIN_PROMPT_LENGTH) break;

      fetchedMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      prompt = "";
      fetchedMessages.forEach(msg => {
        prompt += `${msg.author.username.slice(0, 3)}: ${msg.content}\n`;
      });
    }
    try {
      let result = await client.contextualAI.generateContent(prompt);
      const response = result.response.text();
      message.channel.send(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
