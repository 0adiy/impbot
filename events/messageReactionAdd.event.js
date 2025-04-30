import { Events, User, MessageReaction, Client } from "discord.js";

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
    if (user.bot) return;
    const command = [...client.reactionCommands.values()].find(cmd =>
      cmd.reactions?.includes(emojiName)
    );
    console.log(command.name);
    // reaction.message.channel.send(`Reaction added by ${user}`);
  },
};
