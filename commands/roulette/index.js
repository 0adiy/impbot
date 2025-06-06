import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import * as util from "./util.js";

const roulette = {
  name: "roulette",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...roulette,
  data: new SlashCommandBuilder()
    .setName("roulette")
    .setDescription("Let's see how much luck you got!")
    .addUserOption(option =>
      option
        .setName("player2")
        .setDescription("The second player")
        .setRequired(true)
    )
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([InteractionContextType.Guild]),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const first_player = interaction.user;
    const second_player = interaction.options.getUser("player2");

    if (second_player.id == client.user.id) {
      await interaction.reply(
        `Sorry but Russian roulette isn't my cup of tea.`
      );
      return;
    }

    if (second_player.id == first_player.id) {
      await interaction.reply(`This isn't roulette, this is suicide.`);
      return;
    }

    await interaction.reply(
      `${second_player}, you have been invited to play Russian roulette with ${first_player}. You have 12 seconds, please type "yes" to consent.`
    );

    const filter = response => {
      return (
        response.author.id == second_player.id &&
        (response.content.toLowerCase() === "yes" ||
          response.content.toLowerCase() === "no")
      );
    };

    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 12000,
    });

    collector.on("collect", async response => {
      if (response.content.toLowerCase() === "no") {
        await interaction.channel.send(
          `${second_player} has declined to play. Game cancelled.`
        );
        return collector.stop();
      }
      collector.stop();
      const members = await interaction.guild.members.fetch();

      const to_be_kicked = members.get(
        [first_player.id, second_player.id][Math.floor(Math.random() * 2)]
      );

      if (to_be_kicked && to_be_kicked.kickable) {
        await interaction.channel.send(
          `Sorry ${to_be_kicked}, but you ran out of luck. Kicking you in 8 seconds...`
        );
        await util.sleep(8000);
        await to_be_kicked.kick();
        await interaction.channel.send(`${to_be_kicked} has been kicked.`);
      } else if (to_be_kicked && !to_be_kicked.kickable) {
        await interaction.channel.send(
          `${to_be_kicked} is above the law. Can't be kicked. Game over.`
        );
      } else {
        await interaction.followUp("Error: User not found.");
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        interaction.followUp(
          `${second_player} did not reply in time, the game has been cancelled.`
        );
      }
    });
  },
};
