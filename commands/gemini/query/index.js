import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { logEvent } from "../../../utils/generalUtils.js";
import * as util from "./util.js";

const gemini = {
  name: "gemini",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...gemini,
  data: new SlashCommandBuilder()
    .setName("gemini")
    .setDescription("Ask Gemini anything!")
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("Enter your prompt")
        .setRequired(true)
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
   * Ask Gemini
   *
   * @typedef {import("discord.js").ChatInputCommandInteraction} ChatInputCommandInteraction
   * @typedef {import("discord.js").Client} Client
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const query = interaction.options.getString("query");
    try {
      const result = await client.queryAI.generateContent(
        `${interaction.user.username}: ${query}`
      );
      const response = await result.response.text();
      const parts = util.splitResponse(response);
      await interaction.editReply(parts[0]);
      if (!(parts.length > 0)) return;
      for (let i = 1; i < parts.length; i++) {
        if (interaction.guild != null) interaction.channel.send(parts[i]);
        else interaction.followUp(parts[i]);
      }
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
