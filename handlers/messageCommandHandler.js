import { loadFiles } from "../utils/fileloader.js";
import ascii from "ascii-table";

async function loadMessageCommands(client) {
  const table = new ascii().setHeading("msgCommands", "Status"); // table for formatted printing

  await client.messageCommands.clear(); // clear all commands first

  const cmdFiles = await loadFiles("commands");

  for (const file of cmdFiles) {
    const imported = await import("file://" + file);
    const command = imported.default;

    client.messageCommands.set(command.name, command);

    table.addRow(command.name, "🟩"); //formatting
  }

  return console.log(table.toString(), "\nCommands loaded");
}

export { loadMessageCommands };
