/**
 * Step 2 of manual login: completes sign-in with the code Telegram sent.
 * Reads state from /tmp written by 1-send-code.js.
 * argv[2] = login code. argv[3] = optional 2FA password.
 * Prints the final session string on success.
 */
require("dotenv").config();
const fs = require("fs");
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

async function main() {
  const apiId = Number(process.env.TELEGRAM_API_ID);
  const apiHash = process.env.TELEGRAM_API_HASH;
  const code = process.argv[2];
  const password = process.argv[3];

  if (!apiId || !apiHash || !code) {
    console.error("Usage: node 2-complete-login.js <code> [2fa_password]");
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync("/tmp/tg_login_state.json", "utf8"));

  const client = new TelegramClient(new StringSession(state.session), apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.connect();

  try {
    await client.invoke(
      new Api.auth.SignIn({
        phoneNumber: state.phoneNumber,
        phoneCodeHash: state.phoneCodeHash,
        phoneCode: code,
      })
    );
  } catch (err) {
    if (err.errorMessage === "SESSION_PASSWORD_NEEDED") {
      if (!password) {
        console.error("This account has 2FA enabled. Re-run with the password as the second argument.");
        process.exit(2);
      }
      await client.signInWithPassword(
        { apiId, apiHash },
        { password: async () => password, onError: (e) => console.error(e) }
      );
    } else {
      throw err;
    }
  }

  const sessionString = client.session.save();
  console.log("LOGIN_SUCCESS");
  console.log(sessionString);

  await client.disconnect();
  fs.unlinkSync("/tmp/tg_login_state.json");
  process.exit(0);
}

main().catch((err) => {
  console.error("Login failed:", err.message || err);
  process.exit(1);
});
