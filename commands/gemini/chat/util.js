import config from "../../../config.js";
/**
 * Retrieves the last 1500 characters of chat history from the specified channel
 * @param {TextChannel} channel - The channel to retrieve the history from
 * @returns {string} The retrieved chat history
 */
export async function getChatHistory(channel) {
  let history = "";
  let lastMessageId = null;
  const messagesList = [];

  while (history.length < 1500) {
    const messages = await channel.messages.fetch({
      limit: 10,
      before: lastMessageId,
    });
    if (messages.size === 0) break;

    messages.forEach(msg => messagesList.push(msg));
    lastMessageId = messages.last().id;

    const temp = messagesList.map(m => m.content).join("\n");
    if (temp.length >= 1500) break;
  }

  messagesList.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  return messagesList
    .filter(msg => !msg.content.startsWith(config.prefix))
    .map(msg => `${msg.author.username.slice(0, 3)}: ${msg.content}`)
    .join("\n");
}
