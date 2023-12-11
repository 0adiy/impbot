import config from "../config.js";

function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function getPic(query) {
  const headers = { Authorization: config.photoAPI.key };
  const response = await fetch(config.photoAPI.endpoint + query, {
    headers: headers,
  });
  const data = await response.json();
  const photos = getRandomItems(data.photos, 10);
  let photo_urls = [];
  for (const photo of photos) {
    photo_urls.push(photo.src.original);
  }
  return photo_urls;
}

export default {
  name: "pic",
  aliases: ["pic", "photo", "snap"],
  guildOnly: true,
  args: ["query"],
  /**
   * Seaches for images and sends them
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  execute: async (client, message, args) => {
    const query = args.shift();
    const response = await getPic(query);
    for (const url of response) {
      message.channel.send(url);
    }
  },
};
