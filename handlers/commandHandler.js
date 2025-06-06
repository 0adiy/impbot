import { loadIndices } from "../utils/indexLoader.js";
import { CommandType } from "../constants/commandTypes.js";
import { Collection } from "discord.js";
import { CommandCategory } from "../constants/commandCategories.js";
import ascii from "ascii-table";
import { Routes, REST } from "discord.js";
import config from "../config.js";

const rest = new REST({ version: "10" }).setToken(config.TOKEN);

/**
 * Loads all commands from commands folder.
 * @param {Client} client - the client for which the commands are being loaded.
 * @returns {Promise<void>} - a promise which resolves when all commands are loaded.
 */
export async function loadAllCommands(client) {
  const table = new ascii().setHeading(
    "Commands",
    "Type",
    "Category",
    "Status"
  );

  const slashCommands = [];

  await client.slashCommands.clear();
  await client.messageCommands.clear();
  const cmdFiles = await loadIndices("commands");
  for (const file of cmdFiles) {
    try {
      const { default: command } = await import("file://" + file);
      table.addRow(command.name, command.type, command.category, "🟪");
      switch (command.type) {
        case CommandType.SLASH:
          client.slashCommands.set(command.data.name, command);
          slashCommands.push(command.data.toJSON());
          break;
        case CommandType.MESSAGE:
          if (command.category == CommandCategory.MODERATION) {
            client.modCommands.set(command.name, command);
            break;
          }
          client.messageCommands.set(command.name, command);
          break;
      }
    } catch (err) {
      console.log(file, err);
    }
  }

  //bulk register
  if (slashCommands.length) {
    await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
      body: slashCommands,
    });
  }
  return console.log(table.toString(), "\nCommands loaded");
}
