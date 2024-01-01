function getFutureTimestamp(days, hours, minutes, seconds) {
  // Get the current timestamp in milliseconds.
  const now = Date.now();

  // Convert the input parameters to milliseconds.
  const daysInMilliseconds = days * 24 * 60 * 60 * 1000;
  const hoursInMilliseconds = hours * 60 * 60 * 1000;
  const minutesInMilliseconds = minutes * 60 * 1000;
  const secondsInMilliseconds = seconds * 1000;

  // Calculate the future timestamp in milliseconds.
  const futureTimestamp =
    now + daysInMilliseconds + hoursInMilliseconds + minutesInMilliseconds + secondsInMilliseconds;

  // Create a new Date object with the future timestamp.
  const futureDate = new Date(futureTimestamp);

  // Return the future Date object.
  return futureDate;
}

async function loadAndSetAllReminders(reminderSchema, client) {
  let currentDate = new Date();
  const reminders = await reminderSchema.find({ date: { $gt: currentDate } }).exec();
  console.log(`Loaded ${reminders.length} reminders`);
  reminders.forEach((reminder) => {
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

export { getFutureTimestamp, loadAndSetAllReminders, setReminder };
