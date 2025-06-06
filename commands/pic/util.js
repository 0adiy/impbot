import { getRandomItems } from "../../utils/generalUtils.js";

/**
 * Fetches pictures from either Pexels or Pixabay
 *
 * @param {string} api - The name of the API to use. Can be either "api_pexels" or "api_pixabay".
 * @param {string} query - The search query to use.
 * @param {number} limit - The number of pictures to return.
 * @returns {Promise<Array<string>>} - A promise that resolves with an array of URLs of pictures.
 */
export async function getPic(api, query, limit) {
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
