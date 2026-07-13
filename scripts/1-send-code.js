/**
 * Step 1 of manual login: requests a login code from Telegram.
 * Reads TELEGRAM_API_ID / TELEGRAM_API_HASH from env, and phone number
 * from argv[2]. Writes phoneCodeHash + partial session to /tmp so
 * step 2 can complete the sign-in.
 */
require("dotenv").config();
const fs = require("fs");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

async function main() {
  const apiId = Number(process.env.TELEGRAM_API_ID);
  const apiHash = process.env.TELEGRAM_API_HASH;
  const phoneNumber = process.argv[2];

  if (!apiId || !apiHash || !phoneNumber) {
    console.error("Usage: node 1-send-code.js <phone_number_with_country_code>");
    process.exit(1);
  }

  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.connect();

  const result = await client.sendCode({ apiId, apiHash }, phoneNumber);

  fs.writeFileSync(
    "/tmp/tg_login_state.json",
    JSON.stringify({
      phoneNumber,
      phoneCodeHash: result.phoneCodeHash,
      session: client.session.save(),
    })
  );

  console.log("Code sent. Check your Telegram app for the login code.");
  await client.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to send code:", err.message || err);
  process.exit(1);
});
