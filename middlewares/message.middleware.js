import { Client, Message } from "discord.js";
/**
 *
 * @param {Message} message
 * @param {Client} client
 */
function messageMiddleWare(message, client) {
  const pattern =
    /(https?:\/\/(www\.)?)instagram(\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?)/g;
  if (pattern.test(message.content)) {
    const newContent =
      message.author +
      " said : " +
      message.content.replace(
        pattern,
        (m, p1, p2, p3) => p1 + "ddinstagram" + p3
      );
    message.channel.send(newContent);
    message.delete();
  }
}

export { messageMiddleWare };
