import { Events, Message, User MessageReaction, Client } from "discord.js";

export default {
  name: Events.MessageReactionAdd,
  /**
   * Binds reactions to specific actions
   *
   * @param {MessageReaction} reaction - The reaction object.
   * @param {User} user - The user object.
   * @param {Client} client - The client object.
   */
  async execute(reaction, user, client) {
    reaction.message.channel.send(`Reaction added by ${user}`);   
}
};
