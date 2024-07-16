import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";
import config from "../config.js";
import { logEvent } from "../utils/generalUtils.js";

function capitalize_First_Letter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  name: "help",
  isPrivate: false,
  args: [],
  aliases: ["h"],
  description: "Provides descriptions of available commands.",
  guildOnly: false,
  /**
   * Provides help for commands
   *
   * @param {Client} client - The client object.
   * @param {Message} message - The message object.
   */
  execute: async (client, message) => {
    let embed = new EmbedBuilder()
      .setTitle(`Available commands`)
      .setDescription("DM the bot if you have any complaints.")
      .setColor(COLORS.SECONDARY);
    client.messageCommands.forEach(cmd => {
      if (cmd.isPrivate) return;
      const usage = cmd.args
        ? `${config.prefix}${cmd.name} ${cmd.args.map(a => `<${a}>`).join(" ")}`
        : `${config.prefix}${cmd.name}`;
      const description = `${cmd.description}\nAKA ${cmd.aliases.join(", ")}.`;
      embed.addFields({
        name: usage,
        value: description,
      });
    });
    const slashCommands = await client.application.commands.fetch();
    slashCommands.forEach(cmd => {
      embed.addFields({
        name: `</${cmd.name}:${cmd.id}>`,
        value: cmd.description,
      });
    });
    try {
      message.reply({ embeds: [embed] });
    } catch (e) {
      await logEvent("ERR", client, e);
    }
  },
};
