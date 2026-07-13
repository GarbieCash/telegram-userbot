/**
 * One-time interactive login.
 *
 * Run this locally (or in the Replit shell) with:
 *   npm run login
 *
 * It will ask for your phone number, the login code Telegram sends you,
 * and your 2FA password if you have one enabled. It then prints a
 * session string — copy it and set it as the TELEGRAM_SESSION
 * environment variable / secret wherever the bot runs (Render, etc).
 *
 * Never share this session string. It grants full access to your
 * Telegram account, just like your password.
 */
require("dotenv").config();
const readline = require("readline");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const apiId = Number(process.env.TELEGRAM_API_ID);
  const apiHash = process.env.TELEGRAM_API_HASH;

  if (!apiId || !apiHash) {
    console.error(
      "Set TELEGRAM_API_ID and TELEGRAM_API_HASH first (in a .env file or as env vars). Get them from https://my.telegram.org/apps"
    );
    process.exit(1);
  }

  const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => ask("Phone number (with country code, e.g. +15551234567): "),
    password: async () => ask("2FA password (leave blank if you don't have one): "),
    phoneCode: async () => ask("Login code sent to your Telegram app: "),
    onError: (err) => console.error(err),
  });

  const sessionString = client.session.save();

  console.log("\nLogin successful. Here is your session string:\n");
  console.log(sessionString);
  console.log(
    "\nSave this as the TELEGRAM_SESSION environment variable / secret. Keep it private -- it is equivalent to your account password.\n"
  );

  await client.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Login failed:", err);
  process.exit(1);
});
