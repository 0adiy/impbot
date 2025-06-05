import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { COLORS } from "../../utils/enums.js";
import { EmbedBuilder } from "discord.js";
import * as util from "./util.js";

export default {
  name: "run",
  type: CommandType.MESSAGE,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.GUILD,
  aliases: ["r"],
  args: ["language", "code"],
  description:
    "Executes the provided code in the specified programming language.",
  execute: async (client, message, args) => {
    const language = args.shift();
    const code = args.join(" ").replace(/^```\w* |\n?```$/g, "");

    const data = await util.evaluateCode(language, code);
    if (data === null) return message.reply("Some API error occured");

    let [stdout, stderr, executionTime] = data;

    const embed = new EmbedBuilder()
      .setTitle("Execution Time")
      .setDescription(`${executionTime}ms`)
      .setTimestamp(new Date())
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setColor(stderr ? COLORS.ERROR : COLORS.SUCCESS);

    message.reply({
      content: `\`\`\`${language}\n${stdout || stderr}\n\`\`\``,
      embeds: [embed],
    });
  },
};
