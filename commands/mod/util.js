import { COLORS, PICS } from "../../utils/enums.js";
import config from "../../config.js";

export const suite = `mod`;
export const suitePrefix = `${config.prefix}${suite}`;
/**
 * Compares two arrays for equality.
 *
 * @param {Array} arr1 - The first array to compare.
 * @param {Array} arr2 - The second array to compare.
 * @returns {boolean} - Returns true if both arrays are of the same length and contain the same elements in the same order; otherwise, false.
 */

export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
/**
 * Generates an embed for a mod command.
 *
 * @param {Object} command - The command to generate an embed for.
 * @param {string} command.name - The name of the command.
 * @param {Array<string>} command.args - The arguments of the command.
 * @param {string} command.description - The description of the command.
 * @param {string} command.help - The help text of the command.
 * @param {string} [command.note] - The note of the command.
 * @returns {EmbedBuilder} - The generated embed.
 */
export function generateModCommandEmbed(command) {
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

export const requiredPerms = [
  "BanMembers",
  "KickMembers",
  "ManageMessages",
  "ModerateMembers",
  "Administrator",
];

export function hasAnyPerm(message) {
  return requiredPerms.some(perm => message.member.permissions.has(perm));
}
