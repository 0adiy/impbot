/**
 * Enum for command types
 * @readonly
 * @enum {string}
 */
export const CommandType = Object.freeze({
  /**
   * Message command type
   */
  MESSAGE: "message",

  /**
   * Slash command type
   */
  SLASH: "slash",

  // /**
  //  * Both message and slash command type
  //  */
  // BOTH: "both",
});
