import config from "../config.js";
import { EMOJIS } from "../utils/enums.js";
import { exec } from "child_process";

import { Client, Message } from "discord.js";

export default {
  name: "powershell",
  isPrivate: true,
  args: ["cmd"],
  aliases: ["ps"],
  description: "Runs a powershell command.",
  guildOnly: false,
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
        content: `\`\`\`ansi\n${stdout || error || stderr}\`\`\``,
      });
    });
  },
};
