import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";

export default {
  name: "uptime",
  args: [],
  description: "Displays bot's uptime information.",
  aliases: ["u"],
  guildOnly: true,
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
