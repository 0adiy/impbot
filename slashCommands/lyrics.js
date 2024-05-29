import { SlashCommandBuilder } from "discord.js";
import config from "../config.js";
import { configureLyrixcope, getSongLyrics } from "lyrixcope";

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
    let response = await getSongLyrics(songName, artistName);
    // TODO - add multi-emebeds (each emebed can have upto 6000 chars while simple message can have upto 2000 chars)
    // and even maybe paginationr
    let lyrics = response.status == 200 ? response.lyrics : "No lyrics found";
    await interaction.followUp(lyrics);
  },
};
