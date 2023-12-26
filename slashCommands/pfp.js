import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pfp")
    .setDescription("Shows pfp of a desired user")
    .setDMPermission(false)
    .addUserOption(option =>
      option
        .setName("member")
        .setDescription("Display pfp of this user")
        .setRequired(true)
    ),
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
