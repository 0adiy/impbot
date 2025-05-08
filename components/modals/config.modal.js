import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import fs from "fs/promises";

const fileContents = await fs.readFile("./config.js", { encoding: "utf8" });
const customId = "configModal";
const textbox = new TextInputBuilder()
  .setCustomId("contents")
  .setLabel("config.js")
  .setRequired(true)
  .setValue(fileContents)
  .setStyle(TextInputStyle.Paragraph);

const configModal = new ModalBuilder()
  .setCustomId(customId)
  .setTitle("Configuration")
  .addComponents(new ActionRowBuilder().addComponents(textbox));

export default {
  name: customId,
  data: configModal,
  async execute(interaction, client) {
    await interaction.reply("Receieved");
  },
};
