import { EmbedBuilder } from "discord.js";
import { COLORS, PICS } from "../../utils/enums.js";
import {
  generateModCommandEmbed,
  arraysEqual,
} from "../../utils/generalUtils.js";
import { suitePrefix } from "../mod.js";

export default {
  name: "help",
  description: "Provides help for moderation commands",
  args: ["command"],
  help: `${suitePrefix} help\n${suitePrefix} help unban`,
  execute: async (client, message, args) => {
    const commands = client.modCommands;
    //help has no arguments, provide general help
    if (arraysEqual(args, [])) {
      let embed = new EmbedBuilder()
        .setTitle("Moderation Help")
        .setDescription(
          `The syntax for moderation commands is:\n\`${suitePrefix} <command> <arguments>\`\nThe commands support multiple types of arguments such as nicknames, usernames, user IDs, mentions etc.\nTo find more information about a specific command:\n\`${suitePrefix} help <command>\``
        )
        .setThumbnail(PICS.HAMMER)
        .setColor(COLORS.PRIMARY)
        .setFooter({
          text: `Please note that the arguments of some commands can be optional.`,
        });
      client.modCommands.forEach(cmd => {
        const title = cmd.args
          ? `${cmd.name} ${cmd.args.map(a => `<${a}>`).join(" ")}`
          : `${cmd.name}`;
        let description = cmd.description;
        embed.addFields({
          name: title,
          value: description,
        });
      });
      return message.reply({ embeds: [embed] });
    }

    //help does have an argument, provide specific help
    const commandName = args.shift().toLowerCase();
    const command = client.modCommands.get(commandName);
    let embed = new EmbedBuilder();
    if (!command) {
      embed
        .setTitle("Not found")
        .setDescription(
          `\`${suitePrefix} help\` to view all available commands.`
        )
        .setThumbnail(PICS.HAMMER)
        .setColor(COLORS.ERROR);
      return message.reply({ embeds: [embed] });
    }
    embed = generateModCommandEmbed(command);
    return message.reply({ embeds: [embed] });
  },
};
