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
      .setTitle("Pong!")
      .setDescription(`Latency: ${client.ws.ping}ms`)
      .setTimestamp(new Date())
      .setColor(COLORS.SUCCESS)
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed] });
  },
};
