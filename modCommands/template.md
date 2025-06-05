# MODule Template

Each mod command file should export a default object containing the properties below.

## Properties

| Property    | Type     | Optional | Description                                       | Default   |
| ----------- | -------- | -------- | ------------------------------------------------- | --------- |
| name        | string   |          | Name of the command                               |           |
| description | string   |          | Short description of the command                  |           |
| note        | string   | ✅       | Message to be put inside the footer of help embed | undefined |
| args        | string[] | ✅       | Parameters of the command                         | []        |
| help        | string   |          | Detailed usage of the command                     |           |
| execute     | function |          | Function to execute the command                   |           |

## Note

- Even though the binder checks for permissions, your command should still verify the necessary permissions on `message.member` within the `execute()` function itself.
- The binder does not validate that all required arguments are present—it simply invokes the command. This allows for flexibility (e.g. optional parameters or different behaviors based on argument count), so structure your function accordingly.
- Avoid duplicating functionality—many helpful utilities are already available in [discordUtils.js](../../utils/discordUtils.js), so check there before writing your own.
- Don't use arrow syntax for `execute()` function, because that won't allow `this` to be passed

## Example

```js
import { EmbedBuilder } from "discord.js";
import { COLORS, ANIMATIONS } from "../../utils/enums.js";
import { getUser, banMember } from "../../utils/discordUtils.js";
import { generateModCommandEmbed } from "../../utils/generalUtils.js";
import { suitePrefix } from "../mod.js";

export default {
  name: "ban",
  description: "Bans a user from the server",
  args: ["user", "reason"], //not guaranteed to be available
  help: `${suitePrefix} ban <@1053339940211142676> You are too annoying`,
  note: "You can not ban a user with higher role.",
  execute: async function (client, message, args) {
    //verifying again as stated above
    if (!message.member.permissions.has("BanMembers")) return;

    //if no arguments is provided: send command's help embed
    if (args.length == 0)
      return message.reply({ embeds: [generateModCommandEmbed(this)] });

    let embed = new EmbedBuilder();

    //returns GuildMember
    let userToBan = await getUser(client, message.guild, args[0]);

    //conversion from User to GuildMember
    let executor = await getUser(client, message.guild, message.author);

    //user not found
    if (!userToBan) {
      embed
        .setTitle("Invalid User")
        .setDescription(`Could not find user with ID or username ${args[0]}`)
        .setColor(COLORS.ERROR)
        .setThumbnail(ANIMATIONS.CROSS);
    } else {
      const ban = await banMember(executor, userToBan, args.slice(1).join(" "));
      embed
        .setTitle(ban.status ? "Successfully Banned" : "Failed to Ban")
        .setDescription(ban.message)
        .setColor(ban.status ? COLORS.SUCCESS : COLORS.ERROR)
        .setThumbnail(ban.status ? ANIMATIONS.CHECK : ANIMATIONS.CROSS);
    }
    return message.reply({ embeds: [embed] });
  },
};
```
