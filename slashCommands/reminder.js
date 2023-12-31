import { SlashCommandBuilder } from "discord.js";

function formatTimeString(string) {
  //example input: "10d 4h 5m 10s"
  const regex = /^(\d+d)? ?(\d+h)? ?(\d+m)? ?(\d+s)?$/;
  const match = string.match(regex);
  let response = { hasErr: false, days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (!match) {
    response.hasErr = true;
    return response;
  }
  response.days = match[1] ? parseInt(match[1]) : 0;
  response.hours = match[2] ? parseInt(match[2]) : 0;
  response.minutes = match[3] ? parseInt(match[3]) : 0;
  response.seconds = match[4] ? parseInt(match[4]) : 0;
  return response;
}

export default {
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Sets a reminder for a desired time.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of reminder. e.g. 10d 4h 5m 10s")
        .setMaxLength(20)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message or description of reminder")
        .setRequired(true),
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const timeString = interaction.options.getString("duration");
    const reminderMessage = interaction.options.getString("message");
    const formattedTime = formatTimeString(timeString);
    if (formattedTime.hasErr) {
      interaction.reply(
        `The time is in invalid format. Please recheck and try again. Time provided:\n${timeString}`,
      );
      return;
    }
    if (
      formattedTime.days == 0 &&
      formattedTime.hours == 0 &&
      formattedTime.minutes == 0 &&
      formattedTime.seconds == 0
    ) {
      interaction.reply("The time provided is 0, same as your IQ; can not set reminder.");
      return;
    }
    interaction.reply(
      `days: ${formattedTime.days}\nhours: ${formattedTime.hours}\nminutes: ${formattedTime.minutes}\nseconds: ${formattedTime.seconds}\nmessage: ${reminderMessage}`,
    );
  },
};
