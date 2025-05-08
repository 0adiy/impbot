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
  .setCustomId("content")
  .setLabel("Content:")
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
  isPrivate: true,
  async execute(interaction, client) {
    const newContent = interaction.fields.getTextInputValue("content");
    const oldContent = await fs.readFile("./config.js", { encoding: "utf8" });
    await fs.writeFile("./config.backup.js", oldContent);
    await fs.writeFile("./config.js", newContent);
    await interaction.reply({
      content:
        "Successfully updated `config.js`.\nPrevious configuration backed up as `config.backup.js`.",
    });
  },
};
