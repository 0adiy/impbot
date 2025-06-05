import { CommandType } from "../../../../constants/commandTypes.js";
import { CommandCategory } from "../../../../constants/commandCategories.js";
import { CommandPrivacy } from "../../../../constants/commandPrivacy.js";
import { CommandScope } from "../../../../constants/commandScope.js";
import { COLORS, ANIMATIONS } from "../../../../utils/enums.js";
import { EmbedBuilder } from "discord.js";
import { unbanMember } from "../../../../utils/discordUtils.js";
import * as util from "../../util.js";

export default {
  name: "unban",
  type: CommandType.MESSAGE,
  category: CommandCategory.MODERATION,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.GUILD,
  args: ["user", "reason"],
  description: "Unbans a user from the server",
  note: "Discord doesn’t support unbanning by username, so ID or mention is best.",
  help: `${util.suitePrefix} unban 1053339940211142676 behave this time\n${util.suitePrefix} unban <@1053339940211142676> oops it was a mistake\n${util.suitePrefix} unban sorry_ahh`,
  execute: async function (client, message, args) {
    if (!message.member.permissions.has("BanMembers")) return;

    if (args.length == 0)
      return message.reply({ embeds: [util.generateModCommandEmbed(this)] });

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
