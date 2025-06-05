# 📦 Command File Template

Each command should **default export an object** with the following standardized properties.

## 🧩 Properties

| Property      | Type                            | Optional | Description                                                |
| ------------- | ------------------------------- | -------- | ---------------------------------------------------------- |
| `name`        | `string`                        | ❌       | Primary name of the command                                |
| `description` | `string`                        | ❌       | Description shown in help or docs                          |
| `aliases`     | `string[]`                      | ✅       | Alternate names that can trigger the command               |
| `args`        | `string[]`                      | ✅       | Expected arguments for usage help                          |
| `privacy`     | `CommandPrivacy`                | ❌       | Visibility or permission level (`PUBLIC`, `PRIVATE`, etc.) |
| `category`    | `CommandCategory`               | ❌       | Logical grouping (`FUN`, `MODERATION`, `UTILITY`, etc.)    |
| `scope`       | `CommandScope`                  | ❌       | Where the command can be used (`DM`, `GUILD`, `BOTH`)      |
| `type`        | `CommandType`                   | ❌       | Command type (`MESSAGE`, `SLASH`, etc.)                    |
| `execute`     | `(client, message, ...args) =>` | ❌       | Function called when the command is run                    |

> 💡 All enums are imported from their respective `constants/` files.

---

## ✅ Example

```js
import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
import { EmbedBuilder } from "discord.js";
import { COLORS } from "../../utils/enums.js";

export default {
  name: "uptime",
  description: "Displays bot's uptime information.",
  aliases: ["u"],
  args: [],
  privacy: CommandPrivacy.PUBLIC,
  category: CommandCategory.UTILITY,
  scope: CommandScope.GUILD,
  type: CommandType.MESSAGE,

  /**
   * @param {Client} client
   * @param {Message} message
   */
  execute: async (client, message) => {
    const uptime = client.uptimeTrackerTimestamp.getTime();
    const seconds = Math.floor(uptime / 1000);

    const embed = new EmbedBuilder()
      .setTitle(`**<t:${seconds}:R>**`)
      .setDescription(`The bot started **<t:${seconds}:R>**`)
      .setColor(COLORS.PRIMARY)
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    message.reply({ embeds: [embed] });
  },
};
```

---

## 🧱 Enum Locations

| Enum              | File                             |
| ----------------- | -------------------------------- |
| `CommandType`     | `constants/commandTypes.js`      |
| `CommandCategory` | `constants/commandCategories.js` |
| `CommandPrivacy`  | `constants/commandPrivacy.js`    |
| `CommandScope`    | `constants/commandScope.js`      |
