import config from "../config.js";
import { evaluateCode } from "../commands/evaluateCode.js";
async function handleMessage(message) {
  if (!message.content) return;
  const isCommand = message.content.startsWith(config.prefix);
  if (!isCommand) return;
  const commandName = message.content.split(" ")[0].substring(config.prefix.length);
  if (!commandName) return;
  const commandContent = message.content.slice(config.prefix.length + commandName.length).trim();
  switch (commandName) {
    case "eval":
      await evaluateCode(message, commandContent);
      break;
    case "run":
      await evaluateCode(message, commandContent);
      break;
    case "e":
      await evaluateCode(message, commandContent);
      break;
    case "r":
      await evaluateCode(message, commandContent);
      break;
    default:
      break;
  }
}

export { handleMessage };
