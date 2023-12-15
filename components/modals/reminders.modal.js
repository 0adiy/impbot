import { ModalBuilder } from "discord.js";
import { ChatInputCommandInteraction, Client } from "discord.js";
export default {
  name: "reminder",
  data: new ModalBuilder(),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {},
};
