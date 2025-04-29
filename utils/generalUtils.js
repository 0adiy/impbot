import config from "../config.js";
import { COLORS, EMOJIS } from "./enums.js";
import { EmbedBuilder, User } from "discord.js";

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

async function logEvent(type, client, info) {
  const logChannel = client.channels.cache.get(config.logChannel);
  if (!logChannel) return;

  switch (type) {
    case "DM":
      return logChannel.send(`💬 ${info.author.username}: ${info.content}`);
    case "ERR":
      return logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error occurred")
            .setDescription(`\`\`\`js\n${info.stack}\n\`\`\``)
            .setColor(COLORS.ERROR)
            .setTimestamp(),
        ],
      });
    case "MSGCMD":
      return logChannel.send(
        `${EMOJIS.MSGCMD} \`${info.message.author.username}\` : \`$${info.command.name}\` > ${info.message.url}`
      );
    case "SLASHCMD":
      return logChannel.send(
        `${EMOJIS.SLASHCMD} \`${info.interaction.user.username}\` : \`/${info.command.data.name}\` > ${info.interaction.channel.url}/${info.interaction.id}`
      );
    case "UP":
      console.log(`🚀 ${info}`);
      return logChannel.send(`${EMOJIS.BOOT} ${info}`);
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
};
