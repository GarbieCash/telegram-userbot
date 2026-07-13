const { createClient, resolveTarget } = require("./client");
const config = require("./config");

/**
 * Connects once and sends the message to every configured group,
 * rendered bold (Telegram's "**bold**" markdown -> bold text).
 * Used by both the scheduler (index.js) and the manual send-now script.
 */
async function sendMessage(text) {
  const client = createClient();
  await client.connect();
  const boldText = `**${text}**`;

  try {
    for (const group of config.targetGroups) {
      try {
        const entity = await resolveTarget(client, group);
        await client.sendMessage(entity, { message: boldText, parseMode: "md" });
        console.log(`[${new Date().toISOString()}] Sent to ${group}: ${text.slice(0, 60)}`);
      } catch (err) {
        console.error(`[${new Date().toISOString()}] Failed to send to ${group}:`, err.message || err);
      }
    }
  } finally {
    await client.disconnect();
  }
}

module.exports = { sendMessage };
