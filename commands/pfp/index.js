import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";

const pfp = {
  name: "pfp",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...pfp,
  data: new SlashCommandBuilder()
    .setName("pfp")
    .setDescription("Displays profile picture of the mentioned user")
    .addUserOption(option =>
      option
        .setName("member")
        .setDescription("The user to display")
        .setRequired(true)
    )
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  /**
   * Shows pfp of a desired user
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const user = interaction.options.getUser("member");
    interaction.reply(user.displayAvatarURL({ size: 2048 }));
  },
};
