import ascii from "ascii-table";
import { loadFiles } from "../utils/fileloader.js";

export default async function loadButtons(client) {
  const table = new ascii().setHeading("Button Actions", "Status");
  await client.buttons.clear();

  const Files = await loadFiles("components/buttons");

  for (const file of Files) {
    const imported = await import("file://" + file);
    const button = imported.default;
    client.buttons.set(button.name, button);
    table.addRow(button.name, "🟦");
  }
  return console.log(table.toString(), "\nButtons loaded");
}
