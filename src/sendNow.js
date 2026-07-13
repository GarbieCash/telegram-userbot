/**
 * Manual test: sends session 1's message immediately, useful for verifying
 * setup before relying on the schedule. Run with `npm run send-now`.
 */
const config = require("./config");
const { sendMessage } = require("./sendMessage");

sendMessage(config.sessions[0].message)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to send message:", err);
    process.exit(1);
  });
