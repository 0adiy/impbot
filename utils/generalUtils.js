import config from "../config.js";
import { COLORS, EMOJIS } from "./enums.js";
import { EmbedBuilder } from "discord.js";

// Global list for storing cancellable timeout IDs
let reminderTimeoutList = [];

function getFutureTimestamp(days, hours, minutes, seconds) {
  const now = Date.now();

  const daysInMilliseconds = days * 24 * 60 * 60 * 1000;
  const hoursInMilliseconds = hours * 60 * 60 * 1000;
  const minutesInMilliseconds = minutes * 60 * 1000;
  const secondsInMilliseconds = seconds * 1000;

  const futureTimestamp =
    now +
    daysInMilliseconds +
    hoursInMilliseconds +
    minutesInMilliseconds +
    secondsInMilliseconds;
  const futureDate = new Date(futureTimestamp);
  return futureDate;
}

/* REVIEW - the changes here connects a lot of functions to each other, might wanna change how they are structured?
 *  the global variable is also weird, maybe wanna change that too
 *  current logic is to remove all pending reminders, then get all the new 2 days ahead reminders and load them in
 *  this function itself it supposed to be called every 24 hours so there should be no misses
 *  (delete after reading)
 */
async function loadAndSetAllReminders(reminderSchema, client) {
  // clear the already existing reminders using IDs and clear the list as well
  reminderTimeoutList.forEach(id => clearTimeout(id));
  reminderTimeoutList = [];

  let currentDate = new Date();
  let twoDaysAhead = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days ahead

  const reminders = await reminderSchema
    .find({ date: { $gt: currentDate, $lte: twoDaysAhead } })
    .exec();

  console.log(`Loaded ${reminders.length} reminders`);

  reminders.forEach(reminder => {
    const offset = new Date(reminder.date) - Date.now();
    setReminder(reminder, offset, client);
  });
}

async function setReminder(reminder, duration, client) {
  const id = setTimeout(async () => {
    await sendReminderAlert(client, reminder);
  }, duration);

  reminderTimeoutList.push(id);

  console.log("Reminder set.");
}

async function sendReminderAlert(client, reminder) {
  const channel = await client.channels.fetch(reminder.channelId);
  const user = await client.users.fetch(reminder.userId);
  const embed = new EmbedBuilder()
    .setTitle(":bell: Gentle Reminder")
    .setDescription(reminder.reminder)
    .setColor(COLORS.SUCCESS)
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    });
  channel.send({ content: `<@${reminder.userId}>`, embeds: [embed] });
}

async function getChannel(param, client, message) {
  if (/^\d+$/.test(param)) {
    return client.channels.cache.get(param);
  } else {
    param.toLowerCase().replaceAll(" ", "-");
    return message.guild.channels.cache.find(
      channel => channel.name.toLowerCase() == param
    );
  }
}

async function create_webhook_if_not_exists(channel, name, pfp) {
  const previousWebhooks = await channel.fetchWebhooks();
  const hasWebhookAlready = previousWebhooks.find(
    webhook => webhook.name == name
  );
  if (hasWebhookAlready) return hasWebhookAlready;
  const newWebhook = await channel.createWebhook({ name: name, avatar: pfp });
  return newWebhook;
}

async function send_message_with_webhook(webhook, message) {
  await webhook.send({ content: message });
}

function getRandomItems(array, count) {
  count = count > array.length ? array.length : count;
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function sleep(ms) {
  await new Promise(r => setTimeout(r, ms));
}

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
    return logChannel.send(`${EMOJIS.BOOT} ${information}`);
  }
}

function binarySearchLowerBound(array, word) {
  let low = 0;
  let high = array.length - 1;
  let mid;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    if (array[mid] < word) {
      low = mid + 1;
    } else if (array[mid] > word) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return low;
}

async function getChatHistory(channel) {
  let history = "";
  let lastMessageId = null;
  const allMessages = [];

  while (history.length < 1500) {
    const messages = await channel.messages.fetch({
      limit: 10,
      before: lastMessageId,
    });

    if (messages.size === 0) break;

    messages.forEach(message => allMessages.push(message));

    lastMessageId = messages.last().id;

    const tempHistory = allMessages.map(msg => msg.content).join("\n");
    if (tempHistory.length >= 1500) break;
  }

  allMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  history = allMessages
    .filter(msg => !msg.content.startsWith(config.prefix))
    .map(msg => `${msg.author.username.slice(0, 3)}: ${msg.content}`)
    .join("\n");

  return history;
}

function splitResponse(text, maxLength = 1500) {
  const parts = [];
  let currentPart = "";
  text.split("\n").forEach(line => {
    if (currentPart.length + line.length + 1 > maxLength) {
      parts.push(currentPart);
      currentPart = line;
    } else {
      currentPart += (currentPart ? "\n" : "") + line;
    }
  });
  if (currentPart) parts.push(currentPart);
  return parts;
}

export {
  getFutureTimestamp,
  loadAndSetAllReminders,
  setReminder,
  getChannel,
  create_webhook_if_not_exists,
  send_message_with_webhook,
  getRandomItems,
  capitalizeFirstLetter,
  sleep,
  logEvent,
  binarySearchLowerBound,
  getChatHistory,
  splitResponse,
};
