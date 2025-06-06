import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import config from "../../config.js";
import * as util from "./util.js";

const picCmd = {
  name: "pic",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...picCmd,
  data: new SlashCommandBuilder()
    .setName("pic")
    .setDescription("Search beautiful pictures.")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("The term to search")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("service")
        .setDescription("Select the service")
        .setRequired(true)
        .addChoices(
          { name: "Pixabay", value: "api_pixabay" },
          { name: "Pexels", value: "api_pexels" }
        )
    )
    .addIntegerOption(option =>
      option
        .setName("limit")
        .setDescription("Number of images to return")
        .setMinValue(1)
        .setMaxValue(10)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const limit = interaction.options.getInteger("limit") ?? 4;
    const query = interaction.options.getString("search");
    const api = interaction.options.getString("service");

    const response = await util.getPic(api, query, limit);
    interaction.editReply(`Found ${response.length} images on ${query}`);
    for (const url of response) {
      if (interaction.guild != null) interaction.channel.send(url);
      else interaction.followUp(url);
    }
  },
};
