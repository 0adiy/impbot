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

    const emoji = reaction.emoji;
    const searches = [
      emoji.name?.toLowerCase(),
      emoji.id ? `${emoji.name}:${emoji.id}` : null,
    ].filter(Boolean);

    const command = client.reactionCommands.find(cmd =>
      cmd.reactions.some(r => searches.includes(r.toLowerCase()))
    );

    if (!command) return;
    console.log(command.name);
  },
};
