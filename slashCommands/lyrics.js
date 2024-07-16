import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import config from "../config.js";
import { configureLyrixcope, getSongLyrics } from "lyrixcope";
import {logEvent, splitStringAtIntervals} from "../utils/generalUtils.js";
import { COLORS } from "../utils/enums.js";

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
    )
    .addStringOption(option =>
      option
        .setName("artist")
        .setDescription("The name of the artist")
        .setRequired(false)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    configureLyrixcope(
      config.apis.lyrics_api.user_id,
      config.apis.lyrics_api.token
    );
    const songName = interaction.options.getString("song");
    const artistName = interaction.options.getString("artist") ?? "";
    try {
      let response = await getSongLyrics(songName, artistName);
      let title = response.status == 200 ? `${response.song.song} by ${response.song.artist}` : "Not found.";
      let lyrics = response.status == 200 ? response.lyrics : "We were unable to find lyrics for this one.";
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(lyrics)
        .setTimestamp(new Date())
        .setColor(COLORS.SUCCESS);
      await interaction.followUp({ embeds: [embed] });
    } catch (e) {
      await logEvent("ERR", client, e);
    }
  },
};
