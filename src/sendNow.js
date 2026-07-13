/**
 * Manual test: sends message 1 immediately, useful for verifying setup
 * before relying on the schedule. Run with `npm run send-now`.
 */
const config = require("./config");
const { sendMessage } = require("./sendMessage");

sendMessage(config.message1)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to send message:", err);
    process.exit(1);
  });
