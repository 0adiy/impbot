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
      const history = await getChatHistory(message.channel);
      const request = `Request:\n${message.content.replace(
        config.prefix,
        ""
      )}\nChat context:\n${history}`;
      const result = await client.contextualAI.generateContent(request);
      const response = result.response.text();
      await logEvent("CTX", client, request);
      message.channel.send(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
