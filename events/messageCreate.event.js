import { Events, Message, Client, EmbedBuilder } from "discord.js";
import chalk from "chalk";
import config from "../config.js";
import { messageMiddleWare } from "../middlewares/message.middleware.js";

export default {
  name: Events.MessageCreate,
  once: false,
  /**
   * Finds the command and executes it. Also does validation.
   *
   * @param {Message} message - The message object.
   * @param {Client} client - The client object.
   */
  async execute(message, client) {
    if (message.author.bot) return;

    // NOTE No need to log every message in console

    if (!message.content.startsWith(config.prefix)) {
      await messageMiddleWare(message, client);
      return;
    }

    const args = message.content.slice(config.prefix.length).split(/ +|\n/g);
    const commandName = args.shift().toLowerCase();

    const command =
      client.messageCommands.get(commandName) ||
      client.messageCommands.find(
        // cmd => cmd.aliases && cmd.aliases.includes(commandName)
        cmd => cmd.aliases?.includes(commandName)
      );

    if (!command) return;
    if (command.guildOnly && !message.channel.isTextBased())
      return message.reply("I can't execute that command inside DMs!");

    if (command.args?.length > args.length) {
      const desc = `\`${config.prefix}${command.name}\` requires ${command.args?.length} arguments.`;
      const usage = `\`${config.prefix}${command.name} ${command.args
        ?.map(arg => `<${arg}>`)
        .join(" ")}\``;

      const embed = new EmbedBuilder()
        .setTitle("Invalid Arguments!")
        .setDescription(desc)
        .setFields([
          {
            name: "Usage",
            value: usage,
          },
        ])
        .setTimestamp(new Date())
        .setFooter({
          text: `Requested by ${message.author.username}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setColor(0xff0000);
      return message.reply({ embeds: [embed] });
    }

    try {
      command.execute(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply(
        "There was an error trying to execute that command!\n" + error
      );
    }
  },
};
