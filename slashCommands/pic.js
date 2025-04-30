import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { getRandomItems } from "../utils/generalUtils.js";
import config from "../config.js";

async function getPic(api, query, limit) {
  let endpoint,
    params,
    headers = {};

  if (api === "api_pexels") {
    const pexelsApi = config.apis.pexel_photo_api;
    endpoint = pexelsApi.endpoint;
    params = { query };
    headers = { Authorization: pexelsApi.key };
  } else {
    const pixabayApi = config.apis.pixabay_photo_api;
    endpoint = pixabayApi.endpoint;
    params = { key: pixabayApi.key, q: query, image_type: "photo" };
  }

  const response = await fetch(`${endpoint}?${new URLSearchParams(params)}`, {
    headers,
  });
  const data = await response.json();

  let photos_array = api === "api_pexels" ? data.photos : data.hits;
  photos_array = getRandomItems(photos_array, limit);

  const photos = [];

  for (const photo of photos_array) {
    let url = api === "api_pexels" ? photo.src.original : photo.largeImageURL;
    photos.push(url);
  }
  return photos;
}

export default {
  data: new SlashCommandBuilder()
    .setName("pic")
    .setDescription("Search beautiful pictures.")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("The term to search")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("service")
        .setDescription("Select the service")
        .setRequired(true)
        .addChoices(
          { name: "Pixabay", value: "api_pixabay" },
          { name: "Pexels", value: "api_pexels" }
        )
    )
    .addIntegerOption(option =>
      option
        .setName("limit")
        .setDescription("Number of images to return")
        .setMinValue(1)
        .setMaxValue(10)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const limit = interaction.options.getInteger("limit") ?? 4;
    const query = interaction.options.getString("search");
    const api = interaction.options.getString("service");

    const response = await getPic(api, query, limit);
    interaction.reply(`Found ${response.length} images on ${query}`);
    for (const url of response) {
      interaction.channel.send(url);
    }
  },
};
