import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { SlashCommandBuilder } from "discord.js";
import config from "../../config.js";

const color = {
  name: "color",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...color,
  data: new SlashCommandBuilder()
    .setName("color")
    .setDescription("Previews a specific hex colour")
    .addStringOption(option =>
      option
        .setName("colour")
        .setDescription("The desired colour to preview (e.g. #FFFFFF)")
        .setRequired(true)
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    const colour = interaction.options.getString("colour").replace("#", "");
    const imageUrl = `${config.apis.colour_api.endpoint}${colour}/100x100`;
    interaction.reply(imageUrl);
  },
};
