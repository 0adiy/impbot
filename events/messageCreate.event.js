import { Events, Message, Client, EmbedBuilder } from "discord.js";
import config from "../config.js";
import { messageMiddleWare } from "../middlewares/message.middleware.js";
import { logEvent, isSuperUser } from "../utils/generalUtils.js";
import { getMessageCommands } from "../handlers/commandHandler.js";
import { CommandScope } from "../constants/commandScope.js";
import { CommandPrivacy } from "../constants/commandPrivacy.js";

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

    if (!message.content.startsWith(config.prefix)) {
      await messageMiddleWare(message, client);
      return;
    }

    const args = message.content.slice(config.prefix.length).split(/ +|\n/g);
    const commandName = args.shift().toLowerCase();
    const commands = client.messageCommands;

    const command =
      commands.get(commandName) ||
      commands.find(cmd => cmd.aliases?.includes(commandName));

    if (!command) return;

    if (command.scope === CommandScope.GUILD && !message.channel.isTextBased())
      return message.reply("I can't execute that command inside DMs!");

    if (
      command.privacy === CommandPrivacy.PRIVATE &&
      !isSuperUser(message.author.id)
    )
      return message.reply(`You are lacking permissions to use this command.`);

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
      await logEvent("MSGCMD", client, { message: message, command: command });
    } catch (error) {
      await logEvent("ERR", client, error);
      message.reply("An error occured.");
    }
  },
};
