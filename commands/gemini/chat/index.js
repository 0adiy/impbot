import { CommandType } from "../../../constants/commandTypes.js";
import { CommandCategory } from "../../../constants/commandCategories.js";
import { CommandPrivacy } from "../../../constants/commandPrivacy.js";
import { CommandScope } from "../../../constants/commandScope.js";
import { logEvent } from "../../../utils/generalUtils.js";
import * as util from "./util.js";

export default {
  name: "gemini",
  privacy: CommandPrivacy.PUBLIC,
  category: CommandCategory.FUN,
  scope: CommandScope.GUILD,
  type: CommandType.MESSAGE,
  args: [],
  aliases: ["g", "ai"],
  description: "Summon Gemini to join the conversation",
  /**
   * Summons AI and makes it participate in the conversation
   *
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    try {
      await message.channel.sendTyping();
      const history = await util.getChatHistory(message.channel);
      let payload = history;
      if (message.content.split(" ").length > 1) {
        payload = `Request:\n${message.content.substr(
          message.content.indexOf(" ") + 1
        )}\n\nChat context:\n${history}`;
      }
      const result = await client.contextualAI.generateContent(payload);
      const response = result.response.text();
      // don't log context anymore
      // await logEvent("CTX", client, payload);
      message.channel.send(response);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
