import config from "../config.js";
import { EMOJIS } from "../utils/enums.js";

// FIXME -  not working as intended cause meme api is not online
export default {
  name: "save",
  description: "Saves memes with desired tags to Meme API",
  aliases: ["s", "save"],
  guildOnly: true,
  args: ["description", "tags"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args) => {
    let description = args.shift();
    let tags = args;
    let tagged = message.reference;

    if (!tagged) {
      return;
    }

    tagged = await message.channel.messages.fetch(tagged.messageId);

    let url =
      tagged.attachments.size > 0 ? tagged.attachments.first().url : null;

    if (!url) return;

    // TODO - try catch?
    const response = await fetch(config.apis.meme_api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.apis.meme_api.key,
      },
      body: JSON.stringify({
        url,
        tags,
        description,
      }),
    });

    if (response.ok) await message.react(EMOJIS.CHECK);
    else await message.react(EMOJIS.CROSS);
  },
};
