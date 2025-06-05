import { EmbedBuilder } from "discord.js";
import { COLORS, ANIMATIONS } from "../../utils/enums.js";
import { getUser, banMember } from "../../utils/discordUtils.js";
import { generateModCommandEmbed } from "../../utils/generalUtils.js";
import { suitePrefix } from "../mod.js";

export default {
  name: "ban",
  description: "Bans a user from the server",
  args: ["user", "reason"],
  help: `${suitePrefix} ban <@1053339940211142676> You are too annoying\n${suitePrefix} ban <@1053339940211142676>\n${suitePrefix} ban toxic.turtle spam is not allowed`,
  execute: async (client, message, args) => {
    if (!message.member.permissions.has("BanMembers")) return;

    if (args.length == 0)
      return message.reply({ embeds: [generateModCommandEmbed(ban)] });

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
