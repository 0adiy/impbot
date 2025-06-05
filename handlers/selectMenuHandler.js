import ascii from "ascii-table";
import { loadFiles } from "../utils/indexLoader.js";

export default async function loadSelectMenus(client) {
  const table = new ascii().setHeading("SelectMenus", "Status");
  await client.selectMenus.clear();

  const Files = await loadFiles("components/selectMenus");

  for (const file of Files) {
    const imported = await import("file://" + file);
    const selectMenu = imported.default;

    const execute = (...args) => selectMenu.execute(...args, client);
    client.selectMenus.set(selectMenu.id, {
      isPrivate: selectMenu.isPrivate,
      execute,
    });

    table.addRow(selectMenu.id, "🟧");
  }
  return console.log(table.toString(), "\nSelectMenus loaded");
}
