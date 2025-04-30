import ascii from "ascii-table";
import { loadFiles } from "../utils/fileloader.js";

export default async function loadReactionCommands(client) {
  const table = new ascii().setHeading("Reaction Commands", "Status");
  await client.reactionCommands.clear();

  const Files = await loadFiles("reactionCommands");

  for (const file of Files) {
    const imported = await import("file://" + file);
    const command = imported.default;
    client.reactionCommands.set(command.name, command);
    console.log(client.reactionCommands);

    table.addRow(command.name, "🟥");
  }
  return console.log(table.toString(), "\nReaction Commands loaded");
}
