import { User, MessageReaction, Client } from "discord.js";
export default {
  name: "delete_message",
  isPrivate: true,
  reactions: ["blackpink:1179139928119054468", "🗑️"],
  description: "Deletes the message when reacted by super users",
  /**
   * Deletes the message when reacted by super users
   *
   * @param {Client} client
   * @param {MessageReaction} reaction
   * @param {User} user
   */
  execute: async (client, reaction, user) => {},
};
