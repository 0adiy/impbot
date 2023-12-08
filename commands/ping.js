import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";

export default {
  name: "ping",
  args: [],
  aliases: ["p"],
  guildOnly: false,
  /**
   * Replies with "Pong!"
   *
   * @param {Client} client - The client object.
   * @param {Message} message - The message object.
   */
  execute: async (client, message) => {
    const embed = new EmbedBuilder()
      .setTitle(`**${client.ws.ping}ms**`)
      .setDescription(`The latency of bot is currently ${client.ws.ping}ms.`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp(new Date())
      .setColor(COLORS.SUCCESS);
    message.reply({ embeds: [embed] });
  },
};
