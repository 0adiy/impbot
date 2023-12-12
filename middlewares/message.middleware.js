import { Client, Message } from "discord.js";
/**
 *
 * @param {Message} message
 * @param {Client} client
 */
function messageMiddleWare(message, client) {
  const content = message.content;
  const pattern =
    /^(https?:\/\/(www\.)?)instagram(\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?)/g;
  if (pattern.test(content)) {
    const newContent = content.replace(
      pattern,
      (m, p1, p2, p3) => p1 + "ddinstagram" + p3
    );
    message.channel.send(newContent);
  }
}

export { messageMiddleWare };
