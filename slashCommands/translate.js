import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translates given text into desired language")
    .addStringOption(option =>
      option
        .setName("text")
        .setDescription("The text to translate")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("language")
        .setDescription("The language to translate into")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("source")
        .setDescription("The language of the text")
        .setRequired(false)
    )
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
    const text = interaction.options.getString("text");
    const language = interaction.options.getString("language") ?? "English";
    const source = interaction.options.getString("source") ?? "Auto Detect";
    const request = `Translate to: ${language}\nText language: ${source}\n Translate: ${text}`;
    const translation = client.translatorAI.generateContent(request);
    interaction.reply(translation);
  },
};
