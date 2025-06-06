import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { EmbedBuilder } from "discord.js";
import { COLORS } from "../../utils/enums.js";
import config from "../../config.js";
import { logEvent, isSuperUser } from "../../utils/generalUtils.js";

export default {
  name: "help",
  type: CommandType.MESSAGE,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.BOTH,
  args: [],
  aliases: ["h"],
  description: "Provides descriptions of available commands.",
  /**
   * Provides help for commands
   *
   * @param {Client} client - The client object.
   * @param {Message} message - The message object.
   */
  execute: async (client, message) => {
    const isSuper = isSuperUser(message.author.id);
    let description = isSuper
      ? "Also includes private commands."
      : "DM the bot if you have any complaints.";
    let embed = new EmbedBuilder()
      .setTitle(`Available commands`)
      .setDescription(description)
      .setColor(COLORS.PRIMARY);
    client.messageCommands.forEach(cmd => {
      if (cmd.privacy === CommandPrivacy.PRIVATE && !isSuper) return;
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
