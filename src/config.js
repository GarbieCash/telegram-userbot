require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env and fill it in (or set it in Render's Environment tab).`
    );
  }
  return value;
}

const config = {
  // From https://my.telegram.org/apps
  apiId: Number(required("TELEGRAM_API_ID")),
  apiHash: required("TELEGRAM_API_HASH"),

  // Generated once via `npm run login`, then stored as a secret.
  sessionString: process.env.TELEGRAM_SESSION || "",

  // Username (e.g. "mygroup"), invite link, or numeric chat ID of the group.
  targetGroup: required("TELEGRAM_GROUP"),

  // The two daily messages. MESSAGE_2 falls back to MESSAGE_1 if not set.
  message1: process.env.MESSAGE_1 || "Good morning! \u{1F44B}",
  message2: process.env.MESSAGE_2 || process.env.MESSAGE_1 || "Good evening! \u{1F44B}",

  // Cron expressions. Defaults: 9:00 AM and 6:00 PM.
  cronTime1: process.env.CRON_TIME_1 || "0 9 * * *",
  cronTime2: process.env.CRON_TIME_2 || "0 18 * * *",

  // IANA timezone name, e.g. "America/New_York", "Europe/London", "Asia/Karachi".
  // TIMEZONE_1 / TIMEZONE_2 let the two messages use different timezones;
  // each falls back to TIMEZONE if not set.
  timezone: process.env.TIMEZONE || "UTC",
  timezone1: process.env.TIMEZONE_1 || process.env.TIMEZONE || "UTC",
  timezone2: process.env.TIMEZONE_2 || process.env.TIMEZONE || "UTC",
};

module.exports = config;
