import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";
import config from "../config.js";

export default {
  name: "help",
  args: [],
  aliases: ["h"],
  description: "Provides help for commands",
  guildOnly: false,
  /**
   * Provides help for commands
   *
   * @param {Client} client - The client object.
   * @param {Message} message - The message object.
   */
  execute: async (client, message) => {
    let description = "List of commands\n";
    client.messageCommands.forEach(command => {
      const usage = command.args
        ? `${config.prefix}${command.name} ${command.args
            .map(a => `<${a}>`)
            .join(" ")}`
        : command.name;

      description += `**${usage}** -\n ${command.description}\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`Help!`)
      .setDescription(description)
      .setTimestamp(new Date())
      .setColor(COLORS.SUCCESS)
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed] });
  },
};
