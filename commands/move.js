import { EMOJIS } from "../utils/enums.js";
import {
  getChannel,
  create_webhook_if_not_exists,
  send_message_with_webhook,
  logEvent,
} from "../utils/generalUtils.js";

export default {
  name: "move",
  description: "Moves messages to some other desired channel",
  isPrivate: false,
  aliases: ["move", "m", "shift"],
  guildOnly: true,
  args: ["channel", "range"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args) => {
    try {
      message.channel.send("hi");

      let final_channel = args.shift();
      let range = args.shift() ?? 0;

      final_channel = await getChannel(final_channel, client, message);
      if (
        !message.reference ||
        !final_channel ||
        message.channel == final_channel
      )
        return message.channel.send("invalid destination");

      let tagged = {
        message: message.reference,
        location: message.channel,
        siblings: [],
        destination: final_channel,
      };

      tagged.message = await message.channel.messages.fetch(
        tagged.message.messageId
      );

      message.channel.send("ln47");

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
          const hook = await create_webhook_if_not_exists(
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
        const hook = await create_webhook_if_not_exists(
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
