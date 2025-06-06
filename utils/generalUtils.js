import config from "../config.js";
import { COLORS, EMOJIS, PICS } from "./enums.js";
import { EmbedBuilder, User } from "discord.js";

export function getRandomItems(array, count) {
  return array
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(count, array.length));
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isSuperUser(user) {
  const id = user instanceof User ? user.id : String(user);
  return config.superUsersArray.includes(id);
}

export async function logEvent(type, client, information) {
  const logChannel = await client.channels.cache.get(config.logChannel);
  if (type == "DM") {
    let message = information;
    return logChannel.send(
      `:speech_balloon: ${message.author.username}: ${message.content}`
    );
  }
  if (type == "ERR") {
    let error = information;
    let embed = new EmbedBuilder()
      .setTitle("Error occured")
      .setDescription(`\`\`\`js\n${error.stack}\n\`\`\``)
      .setColor(COLORS.ERROR)
      .setTimestamp(new Date());
    return logChannel.send({ embeds: [embed] });
  }
  if (type == "MSGCMD") {
    let message = information.message;
    let command = information.command;
    return logChannel.send(
      `${EMOJIS.MSGCMD} \`${message.author.username}\` : \`$${command.name}\` > ${message.url}`
    );
  }
  if (type == "SLASHCMD") {
    let interaction = information.interaction;
    let command = information.command.data;
    return logChannel.send(
      `${EMOJIS.SLASHCMD} \`${interaction.user.username}\` : \`/${command.name}\` > ${interaction.channel.url}/${interaction.id}`
    );
  }
  if (type == "UP") {
    information = `${client.user.tag} is ready!`;
    console.log(`🚀 ${information}`);
    return logChannel.send(`${EMOJIS.BOOT} ${information}`);
  }
  if (type == "RXN") {
    const { reaction, command, user } = information;
    return logChannel.send(
      `${reaction.emoji.toString()} \`${user.username}\` : \`:${
        command.name
      }:\` > ${reaction.message.url}`
    );
  }
  if (type == "CTX") {
    let embed = new EmbedBuilder()
      .setTitle("Contextual Payload")
      .setDescription(information)
      .setColor(COLORS.PRIMARY)
      .setTimestamp(new Date());
    return logChannel.send({ embeds: [embed] });
  }
}

// ─────────────────────────────────────────────
// Reminder System
// ─────────────────────────────────────────────

let reminderTimeoutList = [];

export async function setReminder(reminder, duration, client) {
  const timeoutId = setTimeout(
    () => sendReminderAlert(client, reminder),
    duration
  );
  reminderTimeoutList.push(timeoutId);
  console.log("Reminder set.");
}

export async function loadAndSetAllReminders(reminderSchema, client) {
  reminderTimeoutList.forEach(clearTimeout);
  reminderTimeoutList = [];

  const now = new Date();
  const twoDaysAhead = new Date(now.getTime() + 2 * 86400000);
  const reminders = await reminderSchema
    .find({ date: { $gt: now, $lte: twoDaysAhead } })
    .exec();

  console.log(`Loaded ${reminders.length} reminders`);
  for (const reminder of reminders) {
    const offset = new Date(reminder.date) - Date.now();
    setReminder(reminder, offset, client);
  }
}

async function sendReminderAlert(client, reminder) {
  const channel = await client.channels.fetch(reminder.channelId);
  const user = await client.users.fetch(reminder.userId);

  const embed = new EmbedBuilder()
    .setTitle(":bell: Gentle Reminder")
    .setDescription(reminder.reminder)
    .setColor(COLORS.SUCCESS)
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() });

  channel.send({ content: `<@${reminder.userId}>`, embeds: [embed] });
}
