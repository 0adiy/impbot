import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import * as util from "./util.js";
import wordsList from "an-array-of-english-words" assert { type: "json" };
import { logEvent } from "../../utils/generalUtils.js";

const define = {
  name: "define",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...define,
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Look up definitions of a given word")
    .addStringOption(option =>
      option
        .setName("word")
        .setDescription("The word to look up")
        .setRequired(true)
        .setAutocomplete(true)
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
    const word = interaction.options.getString("word");
    try {
      const response = await util.get_definition_of_given_word(
        interaction,
        word
      );
      await interaction.editReply({ embeds: [response] });
    } catch (e) {
      await logEvent("ERR", client, e);
    }
  },
  async autocomplete(interaction) {
    const word = interaction.options.getFocused();
    const wordIndex = util.binarySearchLowerBound(wordsList, word);
    return interaction.respond(
      wordsList
        .slice(wordIndex, wordIndex + 10)
        .map(w => ({ name: w, value: w }))
    );
  },
};
