import config from "../config.js";
import { EMOJIS } from "../utils/enums.js";
import { exec } from "child_process";

import { Client, Message } from "discord.js";

export default {
  name: "powershell",
  args: ["cmd"],
  aliases: ["ps"],
  description: "(only for SuperUsers) Runs a powershell command.",
  guildOnly: false,
  /**
   * Executes the given code in powershell and sends the response back.
   *
   * @param {Client} client - The client object.
   * @param {Message} message - The message object.
   * @param {Array} args - The arguments passed to the command.
   */
  execute: async (client, message, args) => {
    // validation
    if (!config.superUsersArray.includes(message.author.id)) return;

    const code = args.join(" ").replace(/^```\w* |\n?```$/g, "");

    exec(code, { shell: "powershell" }, (error, stdout, stderr) => {
      if (!(stdout || error || stderr)) return message.react(EMOJIS.CHECK);

      message.reply({
        content: "```" + `ansi\n${stdout || error || stderr}` + "```",
      });
    });
  },
};
