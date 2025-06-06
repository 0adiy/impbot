import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import reminderSchema from "../../models/reminder.model.js";
import * as util from "./util.js";
import { setReminder } from "../../utils/generalUtils.js";

const reminder = {
  name: "reminder",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...reminder,
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Sets a reminder for a desired time.")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM])
    .addStringOption(option =>
      option
        .setName("duration")
        .setDescription("The duration of reminder. e.g. 10d 4h 5m 10s")
        .setMaxLength(20)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("The message or description of reminder")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();

    const timeString = interaction.options.getString("duration");
    const reminderMessage = interaction.options.getString("message");
    const formattedTime = util.formatTimeString(timeString);
    if (formattedTime.hasErr) {
      interaction.editReply(
        `The time format is invalid. Please recheck and try again. Time provided: ${timeString}`
      );
      return;
    }

    if (
      formattedTime.days == 0 &&
      formattedTime.hours == 0 &&
      formattedTime.minutes == 0 &&
      formattedTime.seconds == 0
    ) {
      interaction.editReply(
        "The time provided is 0, same as your IQ; can not set reminder."
      );
      return;
    }

    if (
      formattedTime.days > 365 &&
      formattedTime.hours > 100 &&
      formattedTime.minutes > 100 &&
      formattedTime.seconds > 6000
    ) {
      interaction.editReply(
        "Don't go over 356 days, or 100 hours or 100 minutes or 6000 seconds, yes our limits are arbitrary"
      );
      return;
    }

    const dateObj = util.getFutureTimestamp(
      formattedTime.days,
      formattedTime.hours,
      formattedTime.minutes,
      formattedTime.seconds
    );

    let reminder = {
      userId: interaction.user.id,
      reminder: reminderMessage,
      date: dateObj,
      channelId: interaction.channelId,
    };

    const doc = new reminderSchema(reminder);
    await doc.save();

    const offset = new Date(reminder.date) - Date.now();

    console.log(new Date(reminder.date), Date.now(), offset);

    if (offset < 24 * 60 * 60 * 1000) {
      // 24 hours
      await setReminder(reminder, offset, client);
    }

    interaction.editReply(
      `The reminder was set. You will be reminded in ${timeString}.`
    );
  },
};
