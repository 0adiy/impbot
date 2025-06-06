import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { SlashCommandBuilder, InteractionContextType } from "discord.js";
import * as util from "./util.js";

const emojify = {
  name: "emojify",
  type: CommandType.SLASH,
  category: CommandCategory.FUN,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...emojify,
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
    await interaction.reply({ content: util.emojify(msg), ephemeral: onlyme });
  },
};
