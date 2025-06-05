import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { COLORS, PICS } from "../../utils/enums.js";
import config from "../../config.js";
import * as util from "./util.js";

export default {
  name: util.suite,
  type: CommandType.MESSAGE,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.GUILD,
  args: [], //uses discrete args
  aliases: ["m"],
  description: "The most extensive moderation suite",
  /**
   * The most comprehensive moderation suite
   *
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    //your individual moderation modules should do their own auth as well
    if (!util.hasAnyPerm) return;

    const args = message.content.slice(config.prefix.length).split(/ +|\n/g);

    //user called an empty command provide introduction
    if (args.shift() == util.suite && util.arraysEqual(args, [])) {
      const embed = new EmbedBuilder()
        .setTitle("Moderation Suite")
        .setDescription(
          `Use \`${suitePrefix} manual\` to view all available moderation commands.\nThe suite offers a wide range of tools built for reliability, efficiency, and ease of use — whether you're managing a small server or a large community.`
        )
        .setThumbnail(PICS.HAMMER)
        .setColor(COLORS.PRIMARY);
      return message.reply({ embeds: [embed] });
    }
    //rewrite this logic
    //not empty, find and execute
    // const name = args.shift(); //pop out at 1 in the morning 🎶
    // const command = client.modCommands.get(name);
    // if (command) await command.execute(client, message, args);
  },
};
