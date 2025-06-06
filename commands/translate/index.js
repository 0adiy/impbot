import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";

const translate = {
  name: "translate",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...translate,
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translates text into desired language (AI based)")
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
    await interaction.deferReply();
    const text = interaction.options.getString("text");
    const language = interaction.options.getString("language") ?? "English";
    const source = interaction.options.getString("source") ?? "Auto Detect";
    const request = `Translate to: ${language}\nText language: ${source}\n Translate: ${text}`;
    const result = await client.translatorAI.generateContent(request);
    const translation = await result.response.text();
    await interaction.editReply(translation);
  },
};
