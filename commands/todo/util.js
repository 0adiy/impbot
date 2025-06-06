/**
 * Loads all the tasks from the task schema.
 *
 * @param {import("mongoose").Model} taskSchema - The task schema.
 * @returns {Promise<import("../../models/task.model").Task[]>} - An array of tasks.
 */
export async function loadAllTasks(taskSchema) {
  return (await taskSchema.find({ completed: false }).exec()) ?? [];
}

/**
 * Formats a given timestamp into a string in the format DD/MM/YYYY.
 *
 * @param {number} timestamp - The timestamp to be formatted.
 * @returns {string} The formatted timestamp.
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
