import { Events, User, MessageReaction, Client } from "discord.js";
import { isSuperUser, logEvent } from "../utils/generalUtils.js";
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
    let command = client.reactionCommands.find(cmd =>
      cmd.reactions.includes(emoji.name)
    );
    //custom emoji
    if (emoji.id) {
      command = client.reactionCommands.find(cmd =>
        cmd.reactions.includes(emoji.identifier)
      );
    }
    if (!command) return;
    if (!isSuperUser(user) && command.isPrivate) return;
    try {
      await logEvent("RXN", client, { reaction, command, user });
      await command.execute(client, reaction, user);
    } catch (e) {
      await logEvent("ERR", client, e);
    }
  },
};
