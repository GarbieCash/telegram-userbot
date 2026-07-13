const { createClient, resolveTarget } = require("./client");
const config = require("./config");

/**
 * Connects, sends a single message to the configured group, and disconnects.
 * Used by both the scheduler (index.js) and the manual send-now script.
 */
async function sendMessage(text) {
  const client = createClient();
  await client.connect();

  try {
    const entity = await resolveTarget(client, config.targetGroup);
    await client.sendMessage(entity, { message: text });
    console.log(`[${new Date().toISOString()}] Sent message: ${text.slice(0, 60)}`);
  } finally {
    await client.disconnect();
  }
}

module.exports = { sendMessage };
