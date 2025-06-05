import { loadIndices } from "../utils/indexLoader.js";
import { CommandType } from "../constants/commandTypes.js";
import { Collection } from "discord.js";
import { CommandCategory } from "../constants/commandCategories.js";

export async function getAllCommands() {
  const cmdFiles = await loadIndices("commands");
  const commands = new Collection();
  for (const file of cmdFiles) {
    try {
      const { default: command } = await import("file://" + file);
      commands.set(command.name, command);
    } catch (err) {
      console.log(file, err);
    }
  }
  return commands;
}

export async function getModCommands() {
  const commands = await getAllCommands();
  return commands.filter(cmd => cmd.category === CommandType.MODERATION);
}

export async function getMessageCommands() {
  const commands = await getAllCommands();
  return commands.filter(
    cmd =>
      cmd.type === CommandType.MESSAGE &&
      cmd.category !== CommandCategory.MODERATION
  );
}
