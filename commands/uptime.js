import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";

export default {
  name: "uptime",
  args: [],
  aliases: ["u"],
  guildOnly: true,
  execute: async (client, message) => {
    const uptime = client.uptimeTrackerTimestamp.getTime();
    const uptimeCorrected = parseInt(uptime / 1000);

    const embed = new EmbedBuilder()
      .setTitle(`**<t:${uptimeCorrected}:R>**`)
      .setDescription(`The bot started **<t:${uptimeCorrected}:R>**`)
      .setColor(COLORS.DEFAULT)
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed] });
  },
};
