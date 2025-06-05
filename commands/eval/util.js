import { EMOJIS } from "../../utils/enums.js";

/**
 * Appends to result string if under limit.
 */
export function makePrintFn(resultRef) {
  return function print(str) {
    if (resultRef.value.length < 1900) resultRef.value += str + "\n";
  };
}

/**
 * Formats a value for console logging in eval.
 */
export function formatValue(val) {
  try {
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return String(val);
  } catch {
    return "[Unserializable]";
  }
}

/**
 * Logs available dutil functions.
 */
export function createHelpFn(dutil) {
  return function help() {
    const functionList = Object.keys(dutil).filter(
      key => typeof dutil[key] === "function"
    );
    console.log(
      `Context being passed:\n\tclient, message, guild, channel.\nFunction available under dutil:\n${functionList.join(
        "\n"
      )}`
    );
  };
}

/**
 * Evaluates the code and returns result.
 */
export async function runEvalCode({
  client,
  message,
  args,
  dutil,
  print,
  help,
  formatValue,
  resultRef,
}) {
  const code = args.join(" ").replace(/^```\w* |\n?```$/g, "");
  //looks cool so why not?
  const [guild, channel] = [message.guild, message.channel];
  //global hijack
  const originalConsoleLog = console.log;
  console.log = (...args) => print(args.map(formatValue).join(" "));

  try {
    const asyncFunction = new Function(
      "client",
      "message",
      "guild",
      "channel",
      "print",
      "dutil",
      "help",
      `
    return (async () => {
      ${code}
    })()
    `
    );
    await asyncFunction(client, message, guild, channel, print, dutil, help);
    await message.react(EMOJIS.CHECK);
  } catch (error) {
    resultRef.value = error.stack || error.toString();
    await message.react(EMOJIS.CROSS);
  } finally {
    console.log = originalConsoleLog;
  }

  if (resultRef.value) {
    await message.channel.send({
      content: "```js\n" + resultRef.value + "\n```",
    });
  }

  resultRef.value = "";
}
