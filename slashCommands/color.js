import { SlashCommandBuilder } from "discord.js";
import config from "../config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("color")
    .setDescription("Generates image based on specific hex colour")
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName("colour").setDescription("The desired colour to preview").setRequired(true),
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const colour = interaction.options.getString("colour").replace("#", "");
    const imageUrl = `${config.apis.colour_api.endpoint}${colour}/100x100`;
    interaction.reply(imageUrl);
  },
};
