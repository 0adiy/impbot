import { ChannelType, User, Guild, Client } from "discord.js";

/**
 * Retrieves a collection of all guilds the client is currently handling.
 *
 * @param {Client} client - The Discord client.
 * @param {boolean} [shouldLog=false] - Whether to log the guild names and IDs to the console.
 * @returns {Collection<Snowflake, Guild>} A collection of guilds managed by the client.
 */
async function getClientGuilds(client, shouldLog = false) {
  const guilds = client.guilds.cache;
  if (shouldLog)
    guilds.forEach(guild => console.log(`${guild.name}: ${guild.id}\n`));
  return guilds;
}

/**
 * Returns a Guild object by either ID or Guild object.
 *
 * @param {Client} client - The Discord client.
 * @param {Guild|String} guild - The guild to retrieve.
 * @returns {Promise<Guild>} A promise that resolves with the Guild object.
 */
async function getGuild(client, guild) {
  if (guild instanceof Guild) return guild;
  return client.guilds.cache.get(guild);
}

/**
 * Fetches detailed information about a specified guild.
 *
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The ID of the guild to retrieve details for.
 * @param {boolean} [shouldLog=false] - Whether to log the guild details to the console.
 * @returns {Promise<Object>} A promise that resolves to an object containing detailed information about the guild, including its name, ID, description, owner ID, member count, channel count, role count, emoji count, icon URL, partnership status, verification level, bot permissions, and creation date.
 */

async function getGuildDetails(client, guildId, shouldLog = false) {
  const guild = await getGuild(client, guildId);
  const me = guild.members.me;
  const details = {
    name: guild.name,
    id: guild.id,
    description: guild.description ?? "No description",
    owner: guild.ownerId,
    members: guild.memberCount,
    channels: guild.channels.cache.size,
    roles: guild.roles.cache.size,
    emojis: guild.emojis.cache.size,
    icon: guild.iconURL({ size: 2048 }) ?? "No icon",
    partnered: guild.partnered ?? "No partenered",
    verificationLevel: guild.verificationLevel,
    botPermissions: me.permissions,
    createdAt: guild.createdAt,
  };
  if (shouldLog) console.log(JSON.stringify(details, null, 2));
  return details;
}

/**
 * Retrieves a collection of all channels in the specified guild.
 *
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The ID of the guild to retrieve channels for.
 * @param {boolean} [shouldLog=false] - Whether to log the channel details to the console.
 * @returns {Collection<Snowflake, GuildChannel>} A collection of channels managed by the guild.
 */

async function getGuildChannels(client, guildId, shouldLog = false) {
  const guild = await getGuild(client, guildId);
  const channels = guild.channels.cache;
  if (shouldLog)
    channels.forEach(channel =>
      console.log(
        `${channel.name}: ${channel.id} with ${ChannelType[channel.type]}\n`
      )
    );
  return channels;
}

/**
 * Retrieves a collection of all members in the specified guild.
 *
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The ID of the guild to retrieve members for.
 * @param {boolean} [shouldLog=false] - Whether to log the member details to the console.
 * @returns {Collection<Snowflake, GuildMember>} A collection of members managed by the guild.
 */
async function getGuildMembers(client, guildId, shouldLog = false) {
  const guild = await getGuild(client, guildId);
  const members = guild.members.cache;
  if (shouldLog)
    members.forEach(member =>
      console.log(`${member.user.username}: ${member.id}\n`)
    );
  return members;
}

/**
 * Retrieves a collection of all roles in the specified guild.
 *
 * @param {Client} client - The Discord client.
 * @param {string} guildId - The ID of the guild to retrieve roles for.
 * @param {boolean} [shouldLog=false] - Whether to log the role details to the console.
 * @returns {Collection<Snowflake, Role>} A collection of roles managed by the guild.
 */

async function getGuildRoles(client, guildId, shouldLog = false) {
  const guild = await getGuild(client, guildId);
  const roles = guild.roles.cache;
  roles.sort((a, b) => b.position - a.position);
  if (shouldLog)
    roles.forEach(role => console.log(`${role.name}: ${role.id}\n`));
  return roles;
}

/**
 * Retrieves a specific channel from a guild.
 *
 * @param {Client} client - The Discord client.
 * @param {string|Guild} guildInput - The guild to retrieve the channel from.
 * @param {string} channelInput - The ID or name of the channel to retrieve.
 * @returns {GuildChannel|null} The retrieved channel, or null if not found.
 */
async function getChannel(client, guildInput, channelInput) {
  const guild = await getGuild(client, guildInput);
  const byId = await guild.channels.fetch(channelInput).catch(() => null);
  if (byId) return byId;
  return guild.channels.cache.find(c => c.name === channelInput) || null;
}

/**
 * Retrieves a user from a guild. If the user is already an instance of User,
 * that user is returned. Otherwise, the function attempts to fetch the user
 * by ID and username.
 *
 * @param {Client} client - The Discord client.
 * @param {string|Guild} guildInput - The guild to retrieve the user from.
 * @param {string|User} userInput - The ID or username of the user to retrieve,
 * or an instance of User.
 * @returns {User|null} The retrieved user, or null if not found.
 */
async function getUser(client, guildInput, userInput) {
  if (userInput instanceof User) return userInput;
  const guild = await getGuild(client, guildInput);
  const byId = await guild.members.fetch(userInput).catch(() => null);
  if (byId) return byId;
  return guild.members.cache.find(c => c.username === userInput) || null;
}

export {
  getClientGuilds,
  getGuildDetails,
  getGuildChannels,
  getGuildMembers,
  getGuildRoles,
  getChannel,
  getUser,
};
