import config from "../config.js";
import { COLORS, EMOJIS, PICS } from "./enums.js";
import { EmbedBuilder, User } from "discord.js";
import { suitePrefix } from "../messageCommands/mod.js";

// ─────────────────────────────────────────────
// Time & Utility
// ─────────────────────────────────────────────

function getFutureTimestamp(days, hours, minutes, seconds) {
  const now = Date.now();
  const futureTimestamp =
    now + days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000;
  return new Date(futureTimestamp);
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function getRandomItems(array, count) {
  return array
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(count, array.length));
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function binarySearchLowerBound(array, word) {
  let low = 0,
    high = array.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (array[mid] < word) low = mid + 1;
    else high = mid - 1;
  }
  return low;
}

function splitResponse(text, maxLength = 1500) {
  const parts = [];
  let current = "";
  for (const line of text.split("\n")) {
    if (current.length + line.length + 1 > maxLength) {
      parts.push(current);
      current = line;
    } else {
      current += (current ? "\n" : "") + line;
    }
  }
  if (current) parts.push(current);
  return parts;
}

// ─────────────────────────────────────────────
// Authentication
// ─────────────────────────────────────────────

function isSuperUser(user) {
  const id = user instanceof User ? user.id : String(user);
  return config.superUsersArray.includes(id);
}

// ─────────────────────────────────────────────
// Logging
// ─────────────────────────────────────────────
async function logEvent(type, client, information) {
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
    return;
    // return logChannel.send(`${EMOJIS.BOOT} ${information}`);
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

async function loadAndSetAllReminders(reminderSchema, client) {
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

async function setReminder(reminder, duration, client) {
  const timeoutId = setTimeout(
    () => sendReminderAlert(client, reminder),
    duration
  );
  reminderTimeoutList.push(timeoutId);
  console.log("Reminder set.");
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

// ─────────────────────────────────────────────
// Webhooks
// ─────────────────────────────────────────────

async function create_webhook_if_not_exists(channel, name, avatar) {
  const existing = await channel.fetchWebhooks();
  const found = existing.find(w => w.name === name);
  return found || (await channel.createWebhook({ name, avatar }));
}

async function send_message_with_webhook(webhook, message) {
  await webhook.send({ content: message });
}

// ─────────────────────────────────────────────
// Extra Utils
// ─────────────────────────────────────────────

async function loadAllTasks(taskSchema) {
  return (await taskSchema.find({ completed: false }).exec()) ?? [];
}

async function getChatHistory(channel) {
  let history = "";
  let lastMessageId = null;
  const messagesList = [];

  while (history.length < 1500) {
    const messages = await channel.messages.fetch({
      limit: 10,
      before: lastMessageId,
    });
    if (messages.size === 0) break;

    messages.forEach(msg => messagesList.push(msg));
    lastMessageId = messages.last().id;

    const temp = messagesList.map(m => m.content).join("\n");
    if (temp.length >= 1500) break;
  }

  messagesList.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  return messagesList
    .filter(msg => !msg.content.startsWith(config.prefix))
    .map(msg => `${msg.author.username.slice(0, 3)}: ${msg.content}`)
    .join("\n");
}

function generateRandomFilename(extension = "jpg", length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let name = "";
  for (let i = 0; i < length; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${name}.${extension}`;
}

//because javascript is retarded: [] == [] is false
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function generateModCommandEmbed(command) {
  let embed = new EmbedBuilder();
  let description = `
      **Syntax:**
      \`${suitePrefix} ${command.name} ${command.args
    .map(a => `<${a}>`)
    .join(" ")}\`

      **Description:**
      ${command.description}

      **Examples:**
      ${command.help}
      `;
  embed
    .setTitle(`${capitalizeFirstLetter(command.name)}`)
    .setDescription(description)
    .setThumbnail(PICS.SHIELD)
    .setColor(COLORS.PRIMARY);
  if (command.note) embed.setFooter({ text: command.note });
  return embed;
}

export {
  // Time
  getFutureTimestamp,
  sleep,
  getRandomItems,
  capitalizeFirstLetter,
  binarySearchLowerBound,
  splitResponse,

  // User
  isSuperUser,

  // Logging
  logEvent,

  // Reminders
  loadAndSetAllReminders,
  setReminder,

  // Webhook
  create_webhook_if_not_exists,
  send_message_with_webhook,

  // Misc
  loadAllTasks,
  getChatHistory,
  generateRandomFilename,
  arraysEqual,
  generateModCommandEmbed,
};
