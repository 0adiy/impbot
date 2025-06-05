/**
 * Ensures a webhook with the specified name exists in the given channel.
 * If a webhook with the name does not exist, a new one is created.
 *
 * @param {Channel} channel - The channel to check for existing webhooks.
 * @param {string} name - The name of the webhook to find or create.
 * @param {string} avatar - The avatar URL for the webhook to be created if it doesn't exist.
 * @returns {Promise<Webhook>} The existing or newly created webhook.
 */
export async function create_webhook_if_not_exists(channel, name, avatar) {
  const existing = await channel.fetchWebhooks();
  const found = existing.find(w => w.name === name);
  return found || (await channel.createWebhook({ name, avatar }));
}
/**
 * Sends a message using a specified webhook.
 *
 * @param {Webhook} webhook - The webhook through which the message will be sent.
 * @param {string} message - The content of the message to be sent.
 */
export async function send_message_with_webhook(webhook, message) {
  await webhook.send({ content: message });
}
