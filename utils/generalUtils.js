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
    now +
    daysInMilliseconds +
    hoursInMilliseconds +
    minutesInMilliseconds +
    secondsInMilliseconds;

  // Create a new Date object with the future timestamp.
  const futureDate = new Date(futureTimestamp);

  // Return the future Date object.
  return futureDate;
}

export { getFutureTimestamp };
