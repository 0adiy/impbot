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
      .setTitle("Uptime!")
      .setDescription(`Uptime: **<t:${uptimeCorrected}:R>**`)
      .setTimestamp(new Date())
      .setColor(COLORS.SUCCESS)
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed] });
  },
};
