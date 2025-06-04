import { EmbedBuilder } from "discord.js";
import { COLORS, PICS, ANIMATIONS, EMOJIS } from "../utils/enums.js";
import config from "../config.js";
import { arraysEqual, capitalizeFirstLetter } from "../utils/generalUtils.js";
import {
  getUser,
  banMember,
  unbanMember,
  purgeMessages,
} from "../utils/discordUtils.js";

//looks lowk ugly
const suite = `mod`;
const suitePrefix = `${config.prefix}${suite}`;

function generateCommandEmbed(command) {
  let embed = new EmbedBuilder();
  let description = `
      **Syntax:**
      \`${suitePrefix} ${command.name} ${command.args
    .map(a => `<${a}>`)
    .join(" ")}\`

      **Description:**
      ${command.description}

      **Examples:**
      ${command.help}
      `;
  embed
    .setTitle(`${capitalizeFirstLetter(command.name)}`)
    .setDescription(description)
    .setThumbnail(PICS.SHIELD)
    .setColor(COLORS.PRIMARY);
  if (command.note) embed.setFooter({ text: command.note });
  return embed;
}

//commands within commands within commands....
const ban = {
  name: "ban",
  description: "Bans a user from the server",
  args: ["user", "reason"],
  help: `${suitePrefix} ban <@1053339940211142676> You are too annoying\n${suitePrefix} ban <@1053339940211142676>\n${suitePrefix} ban toxic.turtle spam is not allowed`,
  execute: async (client, message, args) => {
    if (!message.member.permissions.has("BanMembers")) return;

    if (args.length == 0)
      return message.reply({ embeds: [generateCommandEmbed(ban)] });

    let embed = new EmbedBuilder();
    let userToBan = await getUser(client, message.guild, args[0]);
    //conversion from User to GuildMember
    let executor = await getUser(client, message.guild, message.author);
    //user not found
    if (!userToBan) {
      embed
        .setTitle("Invalid User")
        .setDescription(`Could not find user with ID or username ${args[0]}`)
        .setColor(COLORS.ERROR)
        .setThumbnail(ANIMATIONS.CROSS);
    } else {
      const ban = await banMember(executor, userToBan, args.slice(1).join(" "));
      embed
        .setTitle(ban.status ? "Successfully Banned" : "Failed to Ban")
        .setDescription(ban.message)
        .setColor(ban.status ? COLORS.SUCCESS : COLORS.ERROR)
        .setThumbnail(ban.status ? ANIMATIONS.CHECK : ANIMATIONS.CROSS);
    }
    return message.reply({ embeds: [embed] });
  },
};

const unban = {
  name: "unban",
  description: "Unbans a user from the server",
  args: ["user", "reason"],
  note: "Discord doesn’t support unbanning by username, so ID or mention is best.",
  help: `${suitePrefix} unban 1053339940211142676 behave this time\n${suitePrefix} unban <@1053339940211142676> oops it was a mistake\n${suitePrefix} unban sorry_ahh`,
  execute: async (client, message, args) => {
    if (!message.member.permissions.has("BanMembers")) return;

    if (args.length == 0)
      return message.reply({ embeds: [generateCommandEmbed(unban)] });

    let embed = new EmbedBuilder();

    const unban = await unbanMember(message.member, message.guild, args[0]);
    embed
      .setTitle(unban.status ? "Successfully Unbanned" : "Failed to Unban")
      .setDescription(unban.message)
      .setColor(unban.status ? COLORS.SUCCESS : COLORS.ERROR)
      .setThumbnail(unban.status ? ANIMATIONS.CHECK : ANIMATIONS.CROSS);

    return message.reply({ embeds: [embed] });
  },
};

const purge = {
  name: "purge",
  description: "Bulk deletes messages from current channel",
  args: ["amount"],
  help: `${suitePrefix} purge 25`,
  execute: async (client, message, args) => {
    if (!message.member.permissions.has("ManageMessages")) return;

    if (args.length == 0)
      return message.reply({ embeds: [generateCommandEmbed(unban)] });

    const result = await purgeMessages(
      client,
      message.member,
      message.guild,
      message.channel,
      args[0]
    );

    let embed = new EmbedBuilder()
      .setTitle(result.status ? "Successfully Purged" : "Failed to Purge")
      .setDescription(result.message)
      .setColor(result.status ? COLORS.SUCCESS : COLORS.ERROR)
      .setThumbnail(result.status ? ANIMATIONS.CHECK : ANIMATIONS.CROSS);
    //send hidden embed only on failure
    if (!result.status) {
      message.react(EMOJIS.CROSS);
      return message.reply({ embeds: [embed], ephemeral: true });
    }
    message.delete();
  },
};

//purge is experimental
const commands = [ban, unban];

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
          `
        Use \`${suitePrefix} help\` to view all available moderation commands.
        The suite offers a wide range of tools built for reliability, efficiency, and ease of use — whether you're managing a small server or a large community.
        `
        )
        .setThumbnail(PICS.HAMMER)
        .setColor(COLORS.PRIMARY);
      return message.reply({ embeds: [embed] });
    }
    //user called for help, provide help
    if (args[0] == "help") {
      args.shift(); //pop out at 1 in the morning 🎶
      //help has no arguments, provide general help
      if (arraysEqual(args, [])) {
        let embed = new EmbedBuilder()
          .setTitle("Moderation Help")
          .setDescription(
            `
            The syntax for moderation commands is:
            \`${suitePrefix} <command> <arguments>\`
            The commands support multiple types of arguments such as nicknames, usernames, user IDs, mentions etc.
            To find more information about a specific command:
            \`${suitePrefix} help <command>\`
            `
          )
          .setThumbnail(PICS.HAMMER)
          .setColor(COLORS.PRIMARY)
          .setFooter({
            text: `Please note that only super users and moderators can use these commands.`,
          });
        for (const cmd of commands) {
          const title = cmd.args
            ? `${cmd.name} ${cmd.args.map(a => `<${a}>`).join(" ")}`
            : `${cmd.name}`;
          let description = cmd.description;
          embed.addFields({
            name: title,
            value: description,
          });
        }
        return message.reply({ embeds: [embed] });
      }
      //help does have an argument, provide specific help
      const commandName = args.shift().toLowerCase();
      const command = commands.find(cmd => cmd.name == commandName);
      let embed = new EmbedBuilder();
      if (!command) {
        embed
          .setTitle("Not found")
          .setDescription(
            `\`${suitePrefix} help\` to view all available commands.`
          )
          .setThumbnail(PICS.HAMMER)
          .setColor(COLORS.ERROR);
        return message.reply({ embeds: [embed] });
      }
      embed = generateCommandEmbed(command);
      return message.reply({ embeds: [embed] });
    }

    //neither help, nor empty, something else
    const name = args.shift(); //pop out at 1 in the morning 🎶
    const command = commands.find(cmd => cmd.name == name);
    command.execute(client, message, args);
  },
};
