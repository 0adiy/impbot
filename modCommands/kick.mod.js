import { EmbedBuilder } from "discord.js";
import { COLORS, ANIMATIONS } from "../../utils/enums.js";
import { unbanMember } from "../../utils/discordUtils.js";
import { generateModCommandEmbed } from "../../utils/generalUtils.js";
import { suitePrefix } from "../mod.js";

export default {
  name: "unban",
  description: "Unbans a user from the server",
  args: ["user", "reason"],
  note: "Discord doesn’t support unbanning by username, so ID or mention is best.",
  help: `${suitePrefix} unban 1053339940211142676 behave this time\n${suitePrefix} unban <@1053339940211142676> oops it was a mistake\n${suitePrefix} unban sorry_ahh`,
  execute: async function (client, message, args) {
    if (!message.member.permissions.has("BanMembers")) return;

    if (args.length == 0)
      return message.reply({ embeds: [generateModCommandEmbed(this)] });

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
