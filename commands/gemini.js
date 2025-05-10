import { EmbedBuilder } from "discord.js";
import { logEvent, getChatHistory } from "../utils/generalUtils.js";
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
    try {
      await message.channel.sendTyping();
      const history = await getChatHistory(message.channel);
      let payload = history;
      if (message.content.split(" ").length > 1) {
        payload = `Request:\n${message.content.substr(
          message.content.indexOf(" ") + 1
        )}\n\nChat context:\n${history}`;
      }
      const result = await client.contextualAI.generateContent(payload);
      const response = result.response.text();
      await logEvent("CTX", client, payload);
      message.channel.send(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
