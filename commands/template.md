# 📘 Command File Template

This guide describes the standard structure for both **message commands** and **slash commands** in the bot. All command files must default-export an object with defined properties and follow the enum-based typing system.

---

## 🧩 Common Properties

| Property      | Type                  | Required   | Description                                         |
| ------------- | --------------------- | ---------- | --------------------------------------------------- |
| `name`        | `string`              | ✅         | The command's primary name                          |
| `description` | `string`              | ✅         | A description used in help or slash metadata        |
| `aliases`     | `string[]`            | ❌         | Alternate names (message commands only)             |
| `args`        | `string[]`            | ❌         | Expected arguments (message commands only)          |
| `privacy`     | `CommandPrivacy`      | ✅         | Defines who can use this command                    |
| `category`    | `CommandCategory`     | ✅         | Categorizes command (e.g., UTILITY, MODERATION)     |
| `scope`       | `CommandScope`        | ❌         | Where the command can be used (DM, GUILD, BOTH)     |
| `type`        | `CommandType`         | ✅         | Defines the command type (`MESSAGE`, `SLASH`, etc.) |
| `data`        | `SlashCommandBuilder` | ✅ (SLASH) | Slash command metadata builder from `discord.js`    |
| `execute`     | `Function`            | ✅         | Async function that executes the command            |

---

## 💬 Message Command Example

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

## ⚡ Slash Command Example

```js
import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { COLORS } from "../../utils/enums.js";

const meta = {
  name: "ping",
  type: CommandType.SLASH,
  category: CommandCategory.UTILITY,
  privacy: CommandPrivacy.PUBLIC,
};

export default {
  ...meta,
  description: "Outputs latency of the bot",
  data: new SlashCommandBuilder()
    .setName(meta.name)
    .setDescription("Outputs latency of the bot")
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`**${client.ws.ping}ms**`)
      .setDescription(
        `The latency of the bot is currently ${client.ws.ping}ms.`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp(new Date())
      .setColor(COLORS.SUCCESS);

    await interaction.reply({ embeds: [embed] });
  },
};
```

---

## 📁 Enum Imports

Make sure to import enums from your `constants` directory:

```js
import { CommandType } from "../../constants/commandTypes.js";
import { CommandCategory } from "../../constants/commandCategories.js";
import { CommandPrivacy } from "../../constants/commandPrivacy.js";
import { CommandScope } from "../../constants/commandScope.js";
```

You can adjust this path depending on file structure.
