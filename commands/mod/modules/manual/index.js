import { CommandType } from "../../../../constants/commandTypes.js";
import { CommandCategory } from "../../../../constants/commandCategories.js";
import { CommandPrivacy } from "../../../../constants/commandPrivacy.js";
import { CommandScope } from "../../../../constants/commandScope.js";
import { EmbedBuilder } from "discord.js";
import { COLORS, PICS } from "../../../../utils/enums.js";
import { generateModCommandEmbed, arraysEqual } from "../../util.js";
import { suitePrefix } from "../../util.js";

export default {
  name: "manual",
  type: CommandType.MESSAGE,
  category: CommandCategory.MODERATION,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.GUILD,
  description: "Provides manual for moderation commands",
  args: ["command"],
  help: `${suitePrefix} manual\n${suitePrefix} manual unban`,
  execute: async (client, message, args) => {
    const commands = client.modCommands;
    //manual has no arguments, provide general manual
    if (arraysEqual(args, [])) {
      let embed = new EmbedBuilder()
        .setTitle("Moderation Manual")
        .setDescription(
          `The syntax for moderation commands is:\n\`${suitePrefix} <command> <arguments>\`\nThe commands support multiple types of arguments such as nicknames, usernames, user IDs, mentions etc.\nTo find more information about a specific command:\n\`${suitePrefix} manual <command>\``
        )
        .setThumbnail(PICS.HAMMER)
        .setColor(COLORS.PRIMARY)
        .setFooter({
          text: `Please note that the arguments of some commands can be optional.`,
        });
      commands.forEach(cmd => {
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
    const command = commands.get(commandName);
    let embed = new EmbedBuilder();
    if (!command) {
      embed
        .setTitle("Not found")
        .setDescription(
          `\`${suitePrefix} manual\` to view all available commands.`
        )
        .setThumbnail(PICS.HAMMER)
        .setColor(COLORS.ERROR);
      return message.reply({ embeds: [embed] });
    }
    embed = generateModCommandEmbed(command);
    return message.reply({ embeds: [embed] });
  },
};
