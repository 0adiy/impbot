import config from "../config.js";
import { COLORS, EMOJIS } from "./enums.js";
import { EmbedBuilder } from "discord.js";

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

async function loadAndSetAllReminders(reminderSchema, client) {
  let currentDate = new Date();
  const reminders = await reminderSchema
    .find({ date: { $gt: currentDate } })
    .exec();
  console.log(`Loaded ${reminders.length} reminders`);
  reminders.forEach(reminder => {
    const offset = new Date(reminder.date) - Date.now();
    setReminder(reminder, offset, client);
  });
}

async function setReminder(reminder, duration, client) {
  setTimeout(async () => {
    await sendReminderAlert(client, reminder);
  }, duration);
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

function capitalize_First_Letter(str) {
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
    logChannel.send("uwu error");
    let error = information;
    let embed = new EmbedBuilder()
      .setTitle(error.name)
      .setDescription(`\`\`\`js\n${error.toString()}\n${error.stack}\n\`\`\``)
      .setFields([
        {
          name: "Cause",
          value: error.cause,
          inline: false,
        },
        {
          name: "Message",
          value: error.message,
          inline: false,
        },
      ])
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
      `${EMOJIS.SLASHCMD} \`${interaction.user.username}\` : \`/${command.name}\` > https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.id}`
    );
  }
}

function splitStringAtIntervals(str, interval) {
  let result = [];
  for (let i = 0; i < str.length; i += interval) {
    result.push(str.substring(i, i + interval));
  }
  return result;
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

export {
  getFutureTimestamp,
  loadAndSetAllReminders,
  setReminder,
  getChannel,
  create_webhook_if_not_exists,
  send_message_with_webhook,
  getRandomItems,
  capitalize_First_Letter,
  sleep,
  logEvent,
  splitStringAtIntervals,
  binarySearchLowerBound,
};
