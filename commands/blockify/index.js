import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import * as util from "./util.js";

export default {
  name: "blockify",
  type: CommandType.MESSAGE,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.GUILD,
  aliases: ["blockify", "wrap", "b", "w"],
  description: "Wraps a message in code block.",
  args: ["language"],
  /**
   * Makes a code block from the replied message using the language provided
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args) => {
    const language = args.shift();
    if (!message.reference) {
      return;
    }
    const repliedTo = await message.channel.messages.fetch(
      message.reference.messageId
    );
    const code = repliedTo.content;

    const data = util.wrapCode(language, code);

    message.channel.send(data);
    repliedTo.delete();
  },
};
