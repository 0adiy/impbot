import { logEvent } from "../utils/generalUtils.js";
import { EMOJIS } from "../utils/enums.js";
import config from "../config.js";
/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("discord.js").Message} Message
 * @param {Message} message
 * @param {Client} client
 */
async function messageMiddleWare(message, client) {
  //log DMS if enabled
  if (config.DMLogging && message.guild == null) {
    try {
      await message.react(EMOJIS.CHECK);
      await logEvent("DM", client, message);
    } catch (e) {
      await logEvent("ERR", client, e);
    }
  }
}

export { messageMiddleWare };
