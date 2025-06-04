import { ChannelType, User, Guild, GuildMember, Client } from "discord.js";

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
 * Resolves a Guild from the client. Supports Guild instance, ID, name, or object with an ID.
 *
 * @param {Client} client - The Discord client.
 * @param {string|Guild|{ id: string }} guildInput - Various formats for a guild.
 * @returns {Promise<Guild|null>} - The resolved guild or null if not found.
 */
async function getGuild(client, guildInput) {
  if (!guildInput || typeof client?.guilds?.fetch !== "function") return null;

  // already a guild
  if (guildInput instanceof Guild) return guildInput;

  // extract if possible
  let guildId = null;

  if (typeof guildInput === "string") {
    // if it was id and not name
    if (/^\d{17,19}$/.test(guildInput)) {
      guildId = guildInput;
    } else {
      // look up by name
      const byName = client.guilds.cache.find(
        g => g.name.toLowerCase() === guildInput.toLowerCase()
      );
      if (byName) return byName;
    }
  } else if (
    typeof guildInput === "object" &&
    typeof guildInput.id === "string"
  ) {
    guildId = guildInput.id;
  }

  if (!guildId) return null;

  //try cache first
  const cached = client.guilds.cache.get(guildId);
  if (cached) return cached;

  // fall back to api if no cigar
  return await client.guilds.fetch(guildId).catch(() => null);
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
        `${channel.name}: ${channel.id} as ${ChannelType[channel.type]}\n`
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
 * Retrieves a specific text channel from a guild.
 *
 * @param {Client} client - The Discord client.
 * @param {string|Guild} guildInput - The guild to retrieve the channel from.
 * @param {string} channelInput - The channel ID, mention, link, or name.
 * @returns {Promise<GuildChannel|null>} The retrieved channel, or null if not found.
 */
async function getChannel(client, guildInput, channelInput) {
  const guild = await getGuild(client, guildInput);
  if (!guild) return null;

  // extract channel ID from mention or link
  const mentionMatch = channelInput.match(/^<#(\d{17,19})>$/);
  if (mentionMatch) channelInput = mentionMatch[1];

  const linkMatch = channelInput.match(
    /discord(?:app)?\.com\/channels\/\d+\/(\d{17,19})/
  );
  if (linkMatch) channelInput = linkMatch[1];

  // id always first
  try {
    const channelById = await guild.channels.fetch(channelInput);
    if (channelById) return channelById;
  } catch {
    // ignore fetch errors and fallback to cache search
  }

  // fallback: by name (case-insensitive)
  const channelByName = guild.channels.cache.find(
    c => c.name.toLowerCase() === channelInput.toLowerCase()
  );
  return channelByName || null;
}

/**
 * Retrieves a user from a guild. Supports User instance, GuildMember, ID, username,
 * display name, and mention formats.
 *
 * @param {Client} client - The Discord client.
 * @param {string|Guild} guildInput - The guild or guild ID to retrieve the user from.
 * @param {string|User|GuildMember} userInput - Various formats of user input.
 * @returns {Promise<GuildMember|null>} The retrieved member or null if not found.
 */
async function getUser(client, guildInput, userInput) {
  const guild = await getGuild(client, guildInput);
  if (!guild) return null;

  // if already a GuildMember, ensure its in right guild
  if (userInput instanceof GuildMember && userInput.guild.id === guild.id) {
    return userInput;
  }

  // if User instance, fetch from guild
  if (userInput instanceof User) {
    return await guild.members.fetch(userInput.id).catch(() => null);
  }

  // mention -> id
  if (typeof userInput === "string") {
    const mentionMatch = userInput.match(/^<@!?(\d+)>$/);
    const id = mentionMatch ? mentionMatch[1] : userInput;

    // try fetching by id
    if (/^\d{17,19}$/.test(id)) {
      const byId = await guild.members.fetch(id).catch(() => null);
      if (byId) return byId;
    }

    // try matching by username or display name
    const lowerInput = userInput.toLowerCase();
    return (
      guild.members.cache.find(
        m =>
          m.user.username.toLowerCase() === lowerInput ||
          m.displayName.toLowerCase() === lowerInput
      ) || null
    );
  }

  return null;
}

/**
 * Attempts to ban a member from the guild.
 *
 * @param {GuildMember} executor - The member trying to ban (command author).
 * @param {GuildMember} target - The member to be banned.
 * @param {string} [reason] - Optional reason for the ban.
 * @returns {Promise<{status: boolean, message: string}>}
 */
async function banMember(executor, target, reason = "No reason provided") {
  // check executor perms
  if (!executor.permissions.has("BanMembers")) {
    return {
      status: false,
      message: "You don't have permission to ban members.",
    };
  }

  // prevent suicide
  if (executor.id === target.id) {
    return { status: false, message: "You cannot ban yourself." };
  }

  // don't let a normie ban a chad
  if (executor.roles.highest.position <= target.roles.highest.position) {
    return {
      status: false,
      message: "You cannot ban a member with an equal or higher role.",
    };
  }

  // check if bot can ban the target
  if (!target.bannable) {
    return {
      status: false,
      message:
        "The user can not be banned because of role hierarchy or missing permissions.",
    };
  }

  try {
    await target.ban({ reason });
    return { status: true, message: `Successfully banned ${target.user.tag}.` };
  } catch (error) {
    return {
      status: false,
      message: `Failed to ban ${target.user.tag}: ${error.message}`,
    };
  }
}

/**
 * Attempts to unban a user from a guild.
 *
 * @param {GuildMember} executor - The member issuing the unban command.
 * @param {Guild} guild - The guild where to unban.
 * @param {string} userInput - User ID or mention
 * @param {string} [reason] - Reason for the unban (optional).
 * @returns {Promise<{status: boolean, message: string}>}
 */
async function unbanMember(
  executor,
  guild,
  userInput,
  reason = "No reason provided"
) {
  if (!executor.permissions.has("BanMembers")) {
    return {
      status: false,
      message: "You don't have permission to unban members.",
    };
  }

  // extract user id from mention
  const mentionMatch = userInput.match(/^<@!?(\d+)>$/);
  const userId = mentionMatch ? mentionMatch[1] : userInput;

  if (!/^\d{17,19}$/.test(userId)) {
    return {
      status: false,
      message: "Please provide a valid user ID or mention.",
    };
  }

  try {
    const bans = await guild.bans.fetch();
    if (!bans.has(userId)) {
      return { status: false, message: "That user is not banned." };
    }

    await guild.bans.remove(userId, reason);
    return {
      status: true,
      message: `Successfully unbanned user with ID ${userId}.`,
    };
  } catch (error) {
    return { status: false, message: `Failed to unban user: ${error.message}` };
  }
}

export {
  getClientGuilds,
  getGuildDetails,
  getGuildChannels,
  getGuildMembers,
  getGuildRoles,
  getChannel,
  getUser,
  banMember,
  unbanMember,
};
