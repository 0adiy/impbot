export default {
  name: "cosmic_LEFT",
  isPrivate: false,
  description: "Move your character to the left",
  async execute(interaction, client) {
    interaction.reply({ content: "received", ephimeral: true });
  },
};
