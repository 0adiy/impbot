import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { generateDiscordMessage } from "drop-the-cap";
import { generateRandomFilename } from "../utils/generalUtils.js";

export default {
  data: new SlashCommandBuilder()
    .setName("faker")
    .setDescription("Generate fake chat screenshots of other members")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The user to screenshot")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("The message to add to screenshot")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("username_color")
        .setDescription("The color of username")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("message_color")
        .setDescription("The color of message")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("background_color")
        .setDescription("The background color of screenshot")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("time_color")
        .setDescription("The color of time")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("time")
        .setDescription("The time to add to screenshot")
        .setRequired(false)
    )
    .addNumberOption(option =>
      option
        .setName("x-offset")
        .setDescription("The X-offset for timestamp")
        .setRequired(false)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    const text = interaction.options.getString("message");
    const usernameColor = interaction.options.getString("username_color");
    const messageColor = interaction.options.getString("message_color");
    const backgroundColor = interaction.options.getString("background_color");
    const timeColor = interaction.options.getString("time_color");
    const time = interaction.options.getString("time");
    const xOffset = interaction.options.getNumber("x-offset");
    const outputPath = `/temp/${generateRandomFilename("jpg", 8)}`;
    const screenshot = await generateDiscordMessage({
      pfpPath: user.displayAvatarURL(),
      outputPath,
      username: user.username,
      timestamp: time,
      message: text,
      backgroundColor,
      usernameColor,
      timestampColor: timeColor,
      messageColor,
      time,
      timestampXOffset: xOffset,
    });
    interaction.editReply({ files: [screenshot] });
  },
};
