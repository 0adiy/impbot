import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Setup reminders")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("format")
        .setDescription("The time in formatted way eg. 10d 1h 5m 10s")
        .setMinLength(1)
        .setMaxLength(20)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("The reminder message")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const formattedTime = interaction.options.getString("format");
    const msg =
      interaction.options.getString("message") ?? "You specified nothing";

    interaction.reply(`${formattedTime} ${msg}`);
  },
};
