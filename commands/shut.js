import { EmbedBuilder } from "discord.js";
import { COLORS } from "../utils/enums.js";

export default {
  name: "shut",
  isPrivate: true,
  args: [],
  description: "Shuts down the bot.",
  aliases: ["kill", "shutdown"],
  guildOnly: true,
  /**
   * Shuts down the bot
   *
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    const embed = new EmbedBuilder()
      .setTitle(`**Shutdown**`)
      .setDescription(
        `All operations are halted. The bot will no longer respond until restarted.`
      )
      .setColor(COLORS.ERROR)
      .setFooter({
        text: `Ordered by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });
    message.reply({ embeds: [embed] });
  },
};
