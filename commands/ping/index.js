import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { COLORS } from "../../utils/enums.js";

const ping = {
  name: "ping",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...ping,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Outputs latency of the bot")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`**${client.ws.ping}ms**`)
      .setDescription(
        `The latency of the bot is currently ${client.ws.ping}ms.`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp(new Date())
      .setColor(COLORS.SUCCESS);
    await interaction.reply({ embeds: [embed] });
  },
};
