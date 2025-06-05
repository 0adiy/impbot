/**
 * Enum for command scopes
 * @readonly
 * @enum {string}
 */
export const CommandScope = Object.freeze({
  /**
   * Guild scope type
   */
  GUILD: "guild",

  /**
   * Direct Message scope type
   */
  DM: "dm",

  /**
   * Both Guild and Direct Message scope type
   */
  BOTH: "both",
});
