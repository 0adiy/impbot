import config from "../config.js";
import { EMOJIS } from "../utils/enums.js";
import * as dutil from "../utils/discordUtils.js";

let result = "";
function print(str) {
  if (result.length < 1900) result += str + "\n";
}

/**
 * Executes the given code asynchronously and handles the result and any errors.
 */
async function execute(client, message, args) {
  const code = args.join(" ").replace(/^```\w* |\n?```$/g, "");
  const [guild, channel] = [message.guild, message.channel];

  try {
    const asyncFunction = new Function(
      "client",
      "message",
      "guild",
      "channel",
      "print",
      "dutil",
      `
      const originalConsoleLog = console.log;
      console.log = (...args) => print(args.join(" "));
      try {
        return (async () => {
          ${code}
        })();
      } finally {
        console.log = originalConsoleLog;
      }
      `
    );

    await asyncFunction(client, message, guild, channel, print, dutil);
    await message.react(EMOJIS.CHECK);
  } catch (error) {
    result = error.toString();
    await message.react(EMOJIS.CROSS);
  }

  if (result) {
    await message.channel.send({
      content: "```js\n" + result + "\n```",
    });
  }

  result = "";
}

export default {
  name: "eval",
  isPrivate: true,
  aliases: ["e"],
  description:
    "Evaluates code in bot's runtime environment. Special privileges required.",
  guildOnly: false,
  args: ["code"],
  execute,
};
