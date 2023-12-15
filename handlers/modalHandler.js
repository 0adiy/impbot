import ascii from "ascii-table";
import { loadFiles } from "../utils/fileloader.js";

// REVIEW - read the code a bit more carefully
export default async function loadModals(client) {
  const table = new ascii().setHeading("Modals", "Status");
  await client.modals.clear(); // clear all modals first

  const Files = await loadFiles("components/modals");

  for (const file of Files) {
    const imported = await import("file://" + file);
    const modal = imported.default;

    const execute = (...args) => modal.execute(...args, client);
    client.modals.set(modal.name, execute);

    //formatting
    table.addRow(modal.name, "🟧");
  }
  return console.log(table.toString(), "\nButtons loaded");
}
