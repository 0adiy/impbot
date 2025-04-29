import { SlashCommandBuilder, EmbedBuilder, Embed } from "discord.js";
import config from "../config.js";
import { COLORS } from "../utils/enums.js";
import {
  getRandomItems,
  capitalizeFirstLetter,
  logEvent,
  binarySearchLowerBound,
} from "../utils/generalUtils.js";
import wordsList from "an-array-of-english-words" assert { type: "json" }; //eslint-disable-line

async function get_Definition_Of_Given_Word(interaction, word) {
  let title = "",
    description = "",
    footer = "",
    color = "",
    embed = "";

  const request = await fetch(`${config.apis.dictionary_api.endpoint}${word}`);
  const response = await request.json();
  if (response.constructor != Array) {
    embed = new EmbedBuilder()
      .setTitle("No definitions found")
      .setDescription(`No definitions found for ${word}`)
      .setColor(COLORS.ERROR)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
  } else {
    embed = new EmbedBuilder()
      .setColor(COLORS.PRIMARY)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    let _w = response[0];
    let _def = _w.meanings[0].definitions;
    title = _w.word;
    embed.setTitle(capitalizeFirstLetter(title));
    for (let i = 0; i < _def.length; i++) {
      const def = _def[i];
      const _ex = def.example ? `**Example:** ${def.example}\n\n` : "\n";
      description += `\`#${i + 1}:\`\n${def.definition}\n${_ex}`;
    }
    description += "\n";
    embed.setDescription(description);
    embed.addFields({
      name: "Part of speech:",
      value: capitalizeFirstLetter(_w.meanings[0].partOfSpeech),
    });
    if (_w.phonetics && _w.phonetics.length > 0) {
      let _p = _w.phonetics[0];
      if (_p.text) embed.addFields({ name: "Phonetic:", value: _p.text });
      if (_p.audio)
        embed.addFields({ name: "Pronounciation:", value: _p.audio });
      if (_w.origin) embed.addFields({ name: "Origin:", value: _w.origin });
    }
    let photo_request = await fetch(
      `${config.apis.pixabay_photo_api.endpoint}?key=${config.apis.pixabay_photo_api.key}&q=${title}&image_type=photo`
    );
    let photo_data = await photo_request.json();
    let random_photo = getRandomItems(photo_data.hits, 1)[0];
    if (random_photo && random_photo.largeImageURL) {
      embed.setImage(random_photo.largeImageURL);
    }
  }

  return embed;
}

export default {
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Look up definitions of a given word")
    .addStringOption(option =>
      option
        .setName("word")
        .setDescription("The word to look up")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const word = interaction.options.getString("word");
    try {
      const response = await get_Definition_Of_Given_Word(interaction, word);
      await interaction.editReply({ embeds: [response] });
    } catch (e) {
      await logEvent("ERR", client, e);
    }
  },
  async autocomplete(interaction) {
    const word = interaction.options.getFocused();
    const wordIndex = binarySearchLowerBound(wordsList, word);
    return interaction.respond(
      wordsList
        .slice(wordIndex, wordIndex + 10)
        .map(w => ({ name: w, value: w }))
    );
  },
};
