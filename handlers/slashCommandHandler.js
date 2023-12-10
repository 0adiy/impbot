import { Routes, REST } from "discord.js";
import config from "../config.js";
import { loadFiles } from "../utils/fileloader.js";
import ascii from "ascii-table";

//setting up REST for discord
const rest = new REST({ version: "10" }).setToken(config.TOKEN);

async function loadSlashCommands(client) {
  const commandsArray = [];
  const table = new ascii().setHeading("Slash Commands", "Status"); // table for formatted printing

  await client.slashCommands.clear();

  const commandFiles = await loadFiles("slashCommands");

  for (const file of commandFiles) {
    const imported = await import("file://" + file);
    const command = imported.default;

    client.slashCommands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());

    //formatting
    table.addRow(command.data.name, "🟩");
  }

  await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
    body: commandsArray,
  });

  return console.log(table.toString(), "\nCommands loaded");
}

async function removeGlobalCommands(client) {
  try {
    console.log("Started removing commands");

    rest.get(Routes.applicationCommands(config.CLIENT_ID)).then(data => {
      const promises = [];
      for (const command of data) {
        const deleteUrl = `${Routes.applicationCommands(config.CLIENT_ID)}/${
          command.id
        }`;
        promises.push(rest.delete(deleteUrl));
      }

      console.log("Removed commands succesfully");
    });
  } catch {
    console.log("Failed to remove commands");
  }
}

export { loadSlashCommands, removeGlobalCommands };
