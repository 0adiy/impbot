import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import { COLORS } from "../utils/enums.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Outputs latency of the bot")
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`**${client.ws.ping}ms**`)
      .setDescription(`The latency of the bot is currently ${client.ws.ping}ms.`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp(new Date())
      .setColor(COLORS.SUCCESS);
    await interaction.reply({ embeds: [embed] });
  },
};
