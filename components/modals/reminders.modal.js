import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalSubmitInteraction,
  Client,
} from "discord.js";

const name = "reminder";

const days = new TextInputBuilder()
  .setCustomId("days")
  .setLabel("Days")
  .setRequired(true)
  .setStyle(TextInputStyle.Short);

const hours = new TextInputBuilder()
  .setCustomId("hours")
  .setLabel("Hours")
  .setRequired(true)
  .setStyle(TextInputStyle.Short);

const minutes = new TextInputBuilder()
  .setCustomId("minutes")
  .setLabel("Minutes")
  .setRequired(true)
  .setStyle(TextInputStyle.Short);

const seconds = new TextInputBuilder()
  .setCustomId("seconds")
  .setLabel("Seconds")
  .setRequired(true)
  .setStyle(TextInputStyle.Short);

const reminder = new TextInputBuilder()
  .setCustomId(name)
  .setLabel("Reminder")
  .setRequired(true)
  .setStyle(TextInputStyle.Paragraph);

const reminderModal = new ModalBuilder()
  .setCustomId("reminder")
  .setTitle("Reminder")
  .addComponents(
    new ActionRowBuilder().addComponents(days),
    new ActionRowBuilder().addComponents(hours),
    new ActionRowBuilder().addComponents(minutes),
    new ActionRowBuilder().addComponents(seconds),
    // NOTE - this doesn't make sense, why use an action row when you can only have 1 thing in it at once??
    // new ActionRowBuilder().addComponents(minutes, seconds)
    new ActionRowBuilder().addComponents(reminder)
  );

export default {
  name,
  data: reminderModal,
  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const days = interaction.fields.getTextInputValue("days");
    const hours = interaction.fields.getTextInputValue("hours");
    const minutes = interaction.fields.getTextInputValue("minutes");
    const seconds = interaction.fields.getTextInputValue("seconds");
    const reminder = interaction.fields.getTextInputValue("reminder");

    interaction.reply(`${days} ${hours} ${minutes} ${seconds} : ${reminder}`);
  },
};
