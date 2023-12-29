import config from "../config.js";
import { EMOJIS } from "../utils/enums.js";

let result = "";
function print(str) {
  if (result.length < 1900) result += str;
}

/**
 * Executes the given code asynchronously and handles the result and any errors.
 *
 * @param {Client} client - The Discord client.
 * @param {Message} message - The message object.
 * @param {Array} args - The arguments passed to the command.
 */
async function execute(client, message, args) {
  const code = args.join(" ").replace(/^```\w* |\n?```$/g, "");

  const [guild, channel] = [message.guild, message.channel]; // for later use

  if (!config.superUsersArray.includes(message.author.id)) {
    await message.react(EMOJIS.CROSS);
    await message.channel.send("Unauthorized access.");
    return;
  }

  console.log("eval: " + code);

  try {
    // TODO - find better way to implement replacement of console.log with print
    const asyncFunction = new Function(
      "client, message, guild, channel, print",
      `return (async () => {
        ${code.replaceAll("console.log(", "print(")} 
      })()`
    );
    await asyncFunction(client, message, guild, channel, print);
    await message.react(EMOJIS.CHECK);
  } catch (error) {
    result = error;
    await message.react(EMOJIS.CROSS);
  }

  if (result) {
    await message.channel.send({
      content: "```\n" + result + "\n```",
    });
  }
  result = "";
}

export default {
  name: "eval",
  aliases: ["e"],
  guildOnly: false,
  args: ["code"],
  execute: execute,
};
