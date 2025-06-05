import { loadFiles } from "../utils/fileloader.js";
import ascii from "ascii-table";

export async function getAllCommands() {
  const table = new ascii().setHeading("Name", "Type");
  const cmdFiles = await loadFiles("commands");
  const commands = new Map();
  for (const file of cmdFiles) {
    try {
      const { default: command } = await import("file://" + file);
      table.addRow(command.name, command.type);
      commands.set(command.name, command);
    } catch (err) {
      console.log(file, err);
    }
  }

  console.log(table.toString(), "\nCommands loaded");
}
