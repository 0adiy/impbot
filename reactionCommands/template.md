# Reaction Commands Template

Each reaction command file should export a default object with these properties:

## Properties

| Property    | Type     | Description                                                      |
| ----------- | -------- | ---------------------------------------------------------------- |
| name        | string   | Name of the reaction command (lowercase, snakecase)              |
| isPrivate   | boolean  | Whether the command is restricted to super users only            |
| reactions   | string[] | Array of emoji identifiers (e.g., `🗑️` or `customname:emoji_id`) |
| description | string   | Description of the command                                       |
| execute     | function | Function to run when a matching reaction is added                |

## Emoji Identifier Format

- **Unicode Emoji**: Use the emoji character directly (e.g., `🗑️`)
- **Custom Emoji**: Use the format `name:emoji_id` (e.g., `blackpink:1179139928119054468`)

## Example

```js
import { User, MessageReaction, Client } from "discord.js";

export default {
  name: "test_message",
  isPrivate: true,
  reactions: ["kekw:1180915803315519570", "😈"],
  description: "Example reaction command",
  /**
   * Example reaction command
   *
   * @param {Client} client
   * @param {MessageReaction} reaction
   * @param {User} user
   */
  execute: async (client, reaction, user) => {
    console.log(reaction.message.content);
  },
};
```
