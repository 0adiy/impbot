import { CommandType } from "../../../../constants/commandTypes.js";
import { CommandCategory } from "../../../../constants/commandCategories.js";
import { CommandPrivacy } from "../../../../constants/commandPrivacy.js";
import { CommandScope } from "../../../../constants/commandScope.js";
import { COLORS, ANIMATIONS } from "../../../../utils/enums.js";
import { EmbedBuilder } from "discord.js";
import { getUser, banMember } from "../../../../utils/discordUtils.js";
import * as util from "../../util.js";

export default {
  name: "ban",
  type: CommandType.MESSAGE,
  category: CommandCategory.MODERATION,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.GUILD,
  args: ["user", "reason"],
  note: "You can't ban someone with a higher role than you.",
  description: "Bans a user from the server",
  help: `${util.suitePrefix} ban <@1053339940211142676> You are too annoying\n${util.suitePrefix} ban <@1053339940211142676>\n${util.suitePrefix} ban toxic.turtle spam is not allowed`,
  execute: async function (client, message, args) {
    if (!message.member.permissions.has("BanMembers")) return;

    if (args.length == 0)
      return message.reply({ embeds: [util.generateModCommandEmbed(this)] });

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
