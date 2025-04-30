import { Events, User, MessageReaction, Client } from "discord.js";

export default {
  name: Events.MessageReactionAdd,
  /**
   * Binds reactions to specific actions
   *
   * @param {MessageReaction} reaction - The reaction object.
   * @param {User} user - The user object.
   * @param {Boolean} superReaction - The super reaction object.
   * @param {Client} client - The client object.
   */
  async execute(reaction, user, superReaction, client) {
    if (user.bot) return;
    const emoji = reaction.emoji.name.toLowerCase();
    console.log(client);

    const command = client.reactionCommands.find(cmd =>
      cmd.reactions?.includes(emoji)
    );

    console.log(command.name);
    // reaction.message.channel.send(`Reaction added by ${user}`);
  },
};
