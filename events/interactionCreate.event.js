import { ChatInputCommandInteraction, Client, Events } from "discord.js";
import config from "../config.js";
import { logEvent } from "../utils/generalUtils.js";

export default {
  name: Events.InteractionCreate,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      console.log("🕹️ Chat Input");

      // TODO: have a condtion if(command.dm && interaction.channel instanceof Discord.DMChannel) then return, also need to add dm property for each command
      const command = client.slashCommands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content: "This is outdated",
          ephemeral: true,
        });

      if (
        command.devloper &&
        !config.superUsersArray.includes(interaction.user.id)
      ) {
        return interaction.reply({
          content: "This is for devs 🤓",
          ephemeral: true,
        });
      }

      command.execute(interaction, client);
      await logEvent("SLASHCMD", client, {
        interaction: interaction,
        command: command,
      });
    }
    //  else if (interaction.isButton()) {
    //   console.log("🔘 Button");

    //   const btnFunc = client.buttons.get(interaction.customId);
    //   if (!btnFunc) return;

    //   btnFunc(interaction, client);
    // }
    else if (interaction.isAutocomplete()) {
      const command = client.slashCommands.get(interaction.commandName);
      command?.autocomplete(interaction, client);
    } else if (interaction.isModalSubmit()) {
      console.log("🔘 Modal Submit");

      const modalFunc = client.modals.get(interaction.customId);
      if (!modalFunc) return;
      modalFunc(interaction, client);
    } else if (interaction.isStringSelectMenu()) {
      console.log("🔘 String Select Menu");
    }
  },
};
