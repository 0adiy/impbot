let result = "";
function print(String) {
  if (result.length < 1900) result += String;
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

  try {
    const asyncFunction = new Function(
      "client, message, guild, channel, print",
      `return (async () => { ${code} })()`
    );
    await asyncFunction(client, message, guild, channel, print);
    await message.react("<a:check:1054376181673234492>"); // TODO - extract into ENUMS
  } catch (error) {
    result = error;
    await message.react("<a:cross:1060641653121093803>"); // TODO - extract into ENUMS
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
