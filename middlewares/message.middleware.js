import { Client, Message } from "discord.js";
import fs from "fs";

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

function messageMiddleWare(message, client) {
  const content = message.content;
  const pattern =
    /^(https?:\/\/(www\.)?)instagram(\.com(\/[A-Za-z0-9_-]+)?\/(p|reel)\/[A-Za-z0-9_-]+\/?)$/;
  if (pattern.test(content)) {
    const newContent = content.replace(
      pattern,
      (m, p1, p2, p3) => p1 + "ddinstagram" + p3
    );
    message.delete();
    message.channel.send(newContent);
  }

  // if (is_Instagram_Reel(message.content)) {
  //   message.channel.send("Instagram Reel detected.").then((__message) => {
  //     get_Direct_Instagram_Reel_Video_URL(message.content, (video_url) => {
  //       __message.edit(`Instagram Reel fetched: ${video_url}`);
  //       download_Video(video_url, "tmp_vids/output.mp4", (output) => {
  //         __message.edit(`Reel downloaded successfully.`);
  //         message.channel.send({
  //           files: [output],
  //         });
  //       });
  //     });
  //   });
  // }
}

export { messageMiddleWare };
