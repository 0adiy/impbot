import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  InteractionContextType,
} from "discord.js";
import emojify from "../utils/emojify.js";

export default {
  data: new SlashCommandBuilder()
    .setName("emojify")
    .setDescription("Emojifies your messages")
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Your message to emojify")
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName("onlyme").setDescription("Only you will see the message")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const msg = interaction.options.get("message").value;
    const onlyme = interaction.options.get("onlyme")?.value; // Boolean value
    await interaction.reply({ content: emojify(msg), ephemeral: onlyme });
  },
};
