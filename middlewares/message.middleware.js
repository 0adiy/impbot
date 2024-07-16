import { Client, Message } from "discord.js";
import { logEvent } from "../utils/generalUtils.js";
import { EMOJIS } from "../utils/enums.js";
import config from "../config.js";

/**
 *
 * @param {Message} message
 * @param {Client} client
 */

// function is_Instagram_Reel(url) {
//   const instagramReelRegex =
//     /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[a-zA-Z0-9_-]+\/?(\?.*)?$/;
//   return instagramReelRegex.test(url);
// }

// function get_Direct_Instagram_Reel_Video_URL(url, callback) {
//   fetch(url)
//     .then((resp) => resp.json())
//     .then((jsonData) => {
//       const video_url = jsonData.graphql.shortcode_media.video_url;
//       console.log("FETCH::SUCCESS");
//       callback(video_url);
//       return video_url;
//     })
//     .catch((error) => {
//       console.error("ERR::FETCH", error);
//     });
// }

// function download_Video(url, output, callback) {
//   fetch(url)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`ERR::HTTP.STATUS:${response.status}`);
//       }
//       return response.arrayBuffer();
//     })
//     .then((buffer) => {
//       fs.writeFileSync(output, Buffer.from(buffer));
//       console.log("DOWNLOAD::SUCCESS");
//       callback(output);
//     })
//     .catch((error) => {
//       console.error("DOWNLOAD::ERR:", error);
//     });
// }

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
