import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("pfp")
    .setDescription("Displays profile picture of the mentioned user")
    .addUserOption(option =>
      option
        .setName("member")
        .setDescription("The user to display")
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
