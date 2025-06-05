import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { logEvent } from "../../utils/generalUtils.js";
import * as util from "./util.js";
import { EMOJIS } from "../../utils/enums.js";
import { getChannel } from "../../utils/discordUtils.js";

export default {
  name: "move",
  type: CommandType.MESSAGE,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
  scope: CommandScope.GUILD,
  description: "Moves messages to some other desired channel",
  aliases: ["move", "m", "shift"],
  args: ["channel", "range"],
  /**
   * Moves messages to some other desired channel
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args) => {
    try {
      let final_channel = args.shift();
      let range = args.shift() ?? 0;

      final_channel = await getChannel(client, message.guild, final_channel);

      if (
        !message.reference ||
        !final_channel ||
        message.channel == final_channel
      )
        return;

      let tagged = {
        message: message.reference,
        location: message.channel,
        siblings: [],
        destination: final_channel,
      };

      tagged.message = await message.channel.messages.fetch(
        tagged.message.messageId
      );

      if (range != 0) {
        const messages = await tagged.location.messages.fetch({
          before: tagged.message.id,
          limit: range,
        });

        messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        messages.forEach(msg => {
          if (msg.id != tagged.message.id && msg.id != message.id) {
            tagged.siblings.push(msg);
          }
        });

        tagged.siblings.push(tagged.message);

        for (const msg of tagged.siblings) {
          const hook = await util.create_webhook_if_not_exists(
            tagged.destination,
            msg.author.username,
            msg.author.avatarURL({ size: 1024 })
          );
          await hook.send({
            content: msg.content,
            embeds: [...msg.embeds],
            files: [
              ...msg.attachments.map(attachment => attachment.attachment),
            ],
          });
          msg.delete();
        }
      } else {
        const hook = await util.create_webhook_if_not_exists(
          tagged.destination,
          tagged.message.author.username,
          tagged.message.author.avatarURL({ size: 1024 })
        );
        await hook.send({
          content: tagged.message.content,
          embeds: [...tagged.message.embeds],
          files: [
            ...tagged.message.attachments.map(
              attachment => attachment.attachment
            ),
          ],
        });
        tagged.message.delete();
      }
      await message.react(EMOJIS.CHECK);
    } catch (error) {
      await logEvent("ERR", client, error);
    }
  },
};
