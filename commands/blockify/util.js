/**
 * Wraps given code in a code block with given language.
 * @param {string} language - The language to wrap the code in.
 * @param {string} code - The code to be wrapped.
 * @returns {string} The wrapped code.
 */
function wrapCode(language, code) {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

export { wrapCode };
