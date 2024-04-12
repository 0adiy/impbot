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

function setReminder(reminder, duration, client) {
  setTimeout(() => {
    sendReminderAlert(client, reminder);
  }, duration);
  console.log("Reminder set.");
}

function sendReminderAlert(client, reminder) {
  const channel = client.channels.cache.get(reminder.channelId);
  channel.send(`<@${reminder.userId}> its the time.\n${reminder.reminder}`);
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
};
