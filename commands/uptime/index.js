import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { EmbedBuilder } from "discord.js";
import { COLORS } from "../../utils/enums.js";

export default {
  name: "uptime",
  privacy: CommandPrivacy.PUBLIC,
  category: CommandCategory.UTILITY,
  scope: CommandScope.GUILD,
  type: CommandType.MESSAGE,
  args: [],
  aliases: ["u"],
  description: "Displays bot's uptime information.",
  /**
   * Shows the uptime of the bot
   *
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    const uptime = client.uptimeTrackerTimestamp.getTime();
    const uptimeCorrected = parseInt(uptime / 1000);

    const embed = new EmbedBuilder()
      .setTitle(`**<t:${uptimeCorrected}:R>**`)
      .setDescription(`The bot started **<t:${uptimeCorrected}:R>**`)
      .setColor(COLORS.PRIMARY)
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed] });
  },
};
