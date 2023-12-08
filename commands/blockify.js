function wrapCode(language, code) {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}
export default {
  name: "blockify",
  aliases: ["blockify", "wrap", "b", "w"],
  guildOnly: true,
  args: ["language"],
  execute: async (client, message, args) => {
    const language = args.shift();
    const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
    const code = repliedTo.content;

    const data = wrapCode(language, code);

    message.channel.send(data);
    repliedTo.delete();
  },
};
