function wrapCode(language, code) {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}
export default {
  name: "blockify",
  isPrivate: false,
  aliases: ["blockify", "wrap", "b", "w"],
  description: "Wraps a message in code block.",
  guildOnly: true,
  args: ["language"],
  /**
   * Makes a code block from the replied message using the language provided
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args) => {
    const language = args.shift();
    if (!message.reference) {
      return;
    }
    const repliedTo = await message.channel.messages.fetch(
      message.reference.messageId
    );
    const code = repliedTo.content;

    const data = wrapCode(language, code);

    message.channel.send(data);
    repliedTo.delete();
  },
};
