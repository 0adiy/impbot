async function getPfp(client, user) {
  try {
    const targetUser = /^\d+$/.test(user)
      ? await client.users.fetch(user)
      : findUserByName(client, user);

    return targetUser ? targetUser.displayAvatarURL({ size: 2048 }) : "Error: User not found.";
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

function findUserByName(client, name) {
  const regex = /[^a-zA-Z0-9]/g;
  return client.users.cache.find(
    (user) =>
      user.username.toLowerCase().replace(regex, "") === name.toLowerCase().replace(regex, ""),
  );
}

export default {
  name: "pfp",
  aliases: ["pfp", "dp", "profile"],
  guildOnly: true,
  args: ["user"],
  execute: async (client, message, args) => {
    const user = args.shift();
    const pfp = await getPfp(client, user);
    message.channel.send(pfp);
  },
};
