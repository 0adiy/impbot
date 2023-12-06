export default {
  name: "ping",
  usage: "",
  aliases: ["p"],
  guildOnly: false,
  execute: async (client, message) => {
    message.reply("Pong!");
  },
};
