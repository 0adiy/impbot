import { EmbedBuilder } from "discord.js";
import { COLORS, PICS } from "../utils/enums.js";
import config from "../config.js";
import { arraysEqual, generateModCommandEmbed } from "../utils/generalUtils.js";

//looks lowk ugly
const suite = `mod`;
const suitePrefix = `${config.prefix}${suite}`;

export default {
  name: suite,
  isPrivate: false,
  args: [], //uses discrete args
  description: "The most extensive moderation suite",
  aliases: ["m"],
  guildOnly: true,
  /**
   * The most comprehensive moderation suite
   *
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    if (
      !message.member.permissions.has([
        "BanMembers",
        "KickMembers",
        "ManageMessages",
        "ModerateMembers",
        "Administrator",
      ])
    )
      return;

    const args = message.content.slice(config.prefix.length).split(/ +|\n/g);

    //user called an empty command provide introduction
    if (args.shift() == suite && arraysEqual(args, [])) {
      const embed = new EmbedBuilder()
        .setTitle("Moderation Suite")
        .setDescription(
          `Use \`${suitePrefix} help\` to view all available moderation commands.\nThe suite offers a wide range of tools built for reliability, efficiency, and ease of use — whether you're managing a small server or a large community.`
        )
        .setThumbnail(PICS.HAMMER)
        .setColor(COLORS.PRIMARY);
      return message.reply({ embeds: [embed] });
    }

    //not empty, find and execute
    const name = args.shift(); //pop out at 1 in the morning 🎶
    const command = client.modCommands.get(name);
    if (command) await command.execute(client, message, args);
  },
};

export { suite, suitePrefix };
