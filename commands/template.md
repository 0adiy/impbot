# Commands Template
Each command file should have these properties in the default exported object

## Properties

| Property  | Type     |Optional| Description                           | Default
| ---       | ---      | ---    | ---                                   | ---
| name      | string   |        | Name of the command                   | ""
| aliases  | string[] | ✅     | Aliases of the command                | []
| guildOnly | boolean  | ✅     | Whether the command can only be used in guilds | false
| args   | string[]   | ✅     | Usage of the command                  | undefined
| execute  | function |      | Function to execute the command        | undefined

## Example

```js
export default {
  name: 'ping',
  isPrivate: false,
  aliases: [ 'p', 'pong' ],
  guildOnly: false,
  args: [],
  execute: async (client, message) => {
    message.reply('Pong!');
  }
}
```