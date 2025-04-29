import { ChatInputCommandInteraction, Client, Events } from "discord.js";
import { logEvent, isSuperUser } from "../utils/generalUtils.js";

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
      // NOTE - This is outdated. Discord provides fields to enable or disable commands in DMs. We don't have to enable checks here
      // TODO: remove this after reading
      const command = client.slashCommands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content: "This action is outdated.",
          ephemeral: true,
        });

      if (command.isPrivate && !isSuperUser(interaction.user))
        return interaction.reply({
          content: "This operation is forbidden.",
        });

      try {
        await command.execute(interaction, client);
      } catch (e) {
        await logEvent("ERR", client, e);
      }

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
      console.log("📃 String Select Menu");
      const selectMenu = client.selectMenus.get(interaction.customId);
      if (!selectMenu) return;
      if (selectMenu.isPrivate && !isSuperUser(interaction.user))
        return interaction.reply({
          content: "This operation is not permitted.",
        });
      try {
        await selectMenu.execute(interaction, client);
      } catch (e) {
        await logEvent("ERR", client, e);
      }
    }
  },
};
