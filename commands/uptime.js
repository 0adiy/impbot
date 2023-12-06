export default {
  name: "uptime",
  usage: "",
  aliases: ["u"],
  guildOnly: true,
  execute: async (client, message) => {
    const uptime = new Date() - client.uptimeTrackerTimestamp;
    message.reply(`bots been up for <t:${uptime}:R>`);
  },
};
