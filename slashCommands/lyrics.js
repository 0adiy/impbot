import { SlashCommandBuilder } from "discord.js";
import config from "../config.js";
const axios = require("axios");
const cheerio = require("cheerio");

async function getSongLink(songName) {
  let responseData = { status: 400, song: null };
  const api = config.apis.lyrics_api;
  try {
    const response = await fetch(
      `${api.endpoint}?uid=${api.user_id}&tokenid=${
        api.token
      }&term=${encodeURIComponent(songName)}&format=${api.format}`
    );
    const responseBody = await response.text();
    if (responseBody == "{}") {
      responseData.status = 404;
    } else {
      let jsonData = JSON.parse(responseBody);
      responseData.status = 200;
      responseData.song = jsonData.result[0];
    }
  } catch (error) {
    console.error("Error fetching song link:", error);
    responseData.status = 500;
  }
  return responseData;
}

async function scrapeLyrics(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const lyrics = $("pre.lyric-body").text().trim();
    return lyrics;
  } catch (error) {
    console.error("An error occured while scraping song:", error);
    return null;
  }
}

async function getSongLyrics(songName) {
  const response = await getSongLink(songName);
  if (response.status == 200) {
    const lyrics = await scrapeLyrics(response.song["song-link"]);
    return lyrics;
  } else {
    return null;
  }
}

export default {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get lyrics of the desired song")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("song")
        .setDescription("The song to display lyrics for")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const songName = interaction.options.getString("song");
    let response;
    let lyrics = await getSongLyrics(songName);
    response = lyrics == null ? "No lyrics found" : lyrics;
    await interaction.reply(response);
  },
};
