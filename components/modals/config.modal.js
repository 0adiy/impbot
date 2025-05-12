import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import fs from "fs/promises";
import { exec } from "child_process";
import util from "util";
const execProm = util.promisify(exec);

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
        "Successfully updated `config.js`.\nOld content has been saved to `config.backup.js`.\nRestarting the bot...",
    });
    setTimeout(async () => {
      await execProm("pm2 restart impbot");
    }, 2000);
  },
};
