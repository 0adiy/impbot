import { SlashCommandBuilder } from "discord.js";
import config from "../config.js";

function getRandomItems(array, count) {
  count = count > array.length ? array.length : count;
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function getPic(query, limit) {
  const headers = { Authorization: config.photoAPI.key };
  const response = await fetch(config.photoAPI.endpoint + query, { headers: headers });
  const data = await response.json();
  const photos = getRandomItems(data.photos, limit);
  let photo_urls = [];
  for (const photo of photos) {
    photo_urls.push(photo.src.original);
  }
  return photo_urls;
}

export default {
  data: new SlashCommandBuilder()
    .setName("pic")
    .setDescription("Search beautiful pictures")
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName("search").setDescription("The term to search").setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("Number of images to return")
        .setMinValue(1)
        .setMaxValue(10),
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const limit = interaction.options.getInteger("limit") ?? 4;
    const query = interaction.options.getString("search");
    const response = await getPic(query, limit);
    interaction.reply(`Found ${response.length} images on ${query}`);
    for (const url of response) {
      interaction.channel.send(url);
    }
  },
};
