import { loadFiles } from "../utils/fileLoader.js";
import ascii from "ascii-table";

async function loadEvents(client) {
  const table = new ascii().setHeading("Events", "Status"); // table for formatted printing
  await client.events.clear(); // clear all events first

  const Files = await loadFiles("events");

  for (const file of Files) {
    const imported = await import("file://" + file);
    const event = imported.default;

    // Attaching the events with callbacks
    const execute = (...args) => event.execute(...args, client);
    client.events.set(event.name, execute);

    if (event.rest) {
      if (event.once) client.rest.once(event.name, execute);
      else client.rest.on(event.name, execute);
    } else {
      if (event.once) client.once(event.name, execute);
      else client.on(event.name, execute);
    }

    //formatting
    table.addRow(event.name, "🟦");
  }
  return console.log(table.toString(), "\nEvents loaded");
}

export { loadEvents };
