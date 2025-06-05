import { loadFiles } from "../utils/fileloader.js";
import ascii from "ascii-table";

async function loadModCommands(client) {
  const table = new ascii().setHeading("Mod Commands", "Status");

  await client.modCommands.clear();

  const cmdFiles = await loadFiles("messageCommands/modCommands");

  for (const file of cmdFiles) {
    const imported = await import("file://" + file);
    const command = imported.default;
    client.modCommands.set(command.name, command);

    table.addRow(command.name, "🛡️"); //formatting
  }

  return console.log(table.toString(), "\nMod commands loaded");
}

export { loadModCommands };
