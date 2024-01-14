import { SlashCommandBuilder, EmbedBuilder, Embed } from "discord.js";
import config from "../config.js";
import { COLORS } from "../utils/enums.js";
import { getRandomItems, capitalize_First_Letter } from "../utils/generalUtils.js";

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
    embed.setTitle(capitalize_First_Letter(title));
    for (let i = 0; i < _def.length; i++) {
      const def = _def[i];
      const _ex = def.example ? `**Example:** ${def.example}\n\n` : "\n";
      description += `\`#${i + 1}:\`\n${def.definition}\n${_ex}`;
    }
    description += "\n";
    embed.setDescription(description);
    embed.addFields({
      name: "Part of speech:",
      value: capitalize_First_Letter(_w.meanings[0].partOfSpeech),
    });
    if (_w.phonetics) {
      let _p = _w.phonetics[0];
      if (_p.text) embed.addFields({ name: "Phonetic:", value: _p.text });
      if (_p.audio) embed.addFields({ name: "Pronounciation:", value: _p.audio });
      if (_w.origin) embed.addFields({ name: "Origin:", value: _w.origin });
    }
    let photo_request = await fetch(
      `${config.apis.pixabay_photo_api.endpoint}?key=${config.apis.pixabay_photo_api.key}&q=${title}&image_type=photo`,
    );
    let photo_data = await photo_request.json();
    let random_photo = getRandomItems(photo_data.hits, 1)[0];
    embed.setImage(random_photo.largeImageURL);
  }

  return embed;
}

export default {
  data: new SlashCommandBuilder()
    .setName("word")
    .setDescription("Look up definitions of a given word")
    .setDMPermission(false)
    .addStringOption((option) =>
      option.setName("query").setDescription("The word to look up").setRequired(true),
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const word = interaction.options.getString("query");
    const response = await get_Definition_Of_Given_Word(interaction, word);
    await interaction.editReply({ embeds: [response] });
  },
};
