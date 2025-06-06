/**
 * Sets a reminder to trigger after a specified duration.
 *
 * @param {Object} reminder - The reminder details, including message and identifiers.
 * @param {number} duration - The duration in milliseconds after which the reminder should be triggered.
 * @param {Object} client - The client instance to use for sending the reminder alert.
 */

export async function setReminder(reminder, duration, client) {
  const timeoutId = setTimeout(
    () => sendReminderAlert(client, reminder),
    duration
  );
  reminderTimeoutList.push(timeoutId);
  console.log("Reminder set.");
}
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Returns a Date object representing the current time plus the given amount of time.
 * @param {number} days - The number of days to add.
 * @param {number} hours - The number of hours to add.
 * @param {number} minutes - The number of minutes to add.
 * @param {number} seconds - The number of seconds to add.

 */
export function getFutureTimestamp(days, hours, minutes, seconds) {
  const now = Date.now();
  const futureTimestamp =
    now + days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000;
  return new Date(futureTimestamp);
}

/**
 * Parses a string representing a time duration into its constituent parts.
 * @param {string} string - The string to parse, e.g. "10d 4h 5m 10s".
 * @returns {Object} - An object containing the parsed values, with properties:
 *   - `hasErr`: A boolean indicating whether the string could be parsed.
 *   - `days`: The number of days in the duration, or 0 if not present.
 *   - `hours`: The number of hours in the duration, or 0 if not present.
 *   - `minutes`: The number of minutes in the duration, or 0 if not present.
 *   - `seconds`: The number of seconds in the duration, or 0 if not present.
 */
export function formatTimeString(string) {
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
