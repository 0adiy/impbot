import { EMOJIS } from "../utils/enums.js";

async function getChannel(param, client, message) {
  if (/^\d+$/.test(param)) {
    //ID was provided
    return client.channels.cache.get(param);
  } else {
    //Name was provided
    param.toLowerCase().replaceAll(" ", "-");
    return message.guild.channels.cache.find((channel) => channel.name.toLowerCase() == param);
  }
}

export default {
  name: "move",
  description: "Move messages to some other channel",
  aliases: ["move", "m", "shift"],
  guildOnly: true,
  args: ["channel", "range"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args) => {
    let final_channel = args.shift();
    let range = args.shift() ?? 0;

    final_channel = await getChannel(final_channel, client, message);
    if (!message.reference || !final_channel || message.channel == final_channel) return;

    let tagged = {
      message: message.reference,
      location: message.channel,
      siblings: [],
      destination: final_channel,
    };

    tagged.message = await message.channel.messages.fetch(tagged.message.messageId);

    if (range != 0) {
      tagged.location.messages
        .fetch({ before: tagged.message.id, limit: range })
        .then((messages) => {
          messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
          messages.forEach((msg) => {
            if (msg.id != tagged.message.id && msg.id != message.id) {
              tagged.siblings.push(msg);
            }
          });
          tagged.siblings.push(tagged.message);
          for (const msg of tagged.siblings) {
            tagged.destination.send(msg.content);
            msg.delete();
          }
        });
    } else {
      tagged.destination.send(tagged.message.content);
      tagged.message.delete();
    }
    await message.react(EMOJIS.CHECK);
  },
};
