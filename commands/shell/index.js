import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { EMOJIS } from "../../utils/enums.js";
import { exec } from "child_process";
import { Client, Message } from "discord.js";

export default {
  name: "powershell",
  type: CommandType.MESSAGE,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PRIVATE,
  scope: CommandScope.GUILD,
  args: ["cmd"],
  aliases: ["ps"],
  description: "Runs a powershell command.",
  /**
   * Executes the given code in powershell and sends the response back.
   *
   * @param {Client} client - The client object.
   * @param {Message} message - The message object.
   * @param {Array} args - The arguments passed to the command.
   */
  execute: async (client, message, args) => {
    const code = args.join(" ").replace(/^```\w* |\n?```$/g, "");
    const shell = process.platform == "win32" ? "powershell" : "bash";
    exec(code, { shell: shell }, (error, stdout, stderr) => {
      if (!error) {
        message.react(EMOJIS.CHECK);
      } else {
        message.react(EMOJIS.CROSS);
      }
      message.reply({
        content: `\`\`\`js\n${stdout || error || stderr}\`\`\``,
      });
    });
  },
};
