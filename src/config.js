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

  // Comma-separated list of usernames, invite links, or numeric chat IDs.
  // e.g. "mygroup,https://t.me/+abc123,-1001234567890"
  targetGroups: required("TELEGRAM_GROUP")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // IANA timezone name, e.g. "America/New_York", "Europe/London", "Asia/Karachi".
  // Global fallback used by any session that doesn't set its own TIMEZONE_n.
  timezone: process.env.TIMEZONE || "UTC",
};

// Sessions: any number of daily sends, each configured via MESSAGE_n /
// CRON_TIME_n / TIMEZONE_n (n = 1, 2, 3, ...). Detection stops at the first
// missing MESSAGE_n, so sessions must be numbered contiguously from 1.
// Sessions 1 and 2 fall back to defaults (9 AM / 6 PM UTC) for backward
// compatibility with older setups that predate this env var scheme.
const defaultMessages = { 1: "Good morning! \u{1F44B}", 2: "Good evening! \u{1F44B}" };
const defaultCronTimes = { 1: "0 9 * * *", 2: "0 18 * * *" };

const sessions = [];
for (let n = 1; ; n++) {
  const message = process.env[`MESSAGE_${n}`] || defaultMessages[n];
  if (!message) break;

  sessions.push({
    name: `session-${n}`,
    message,
    cronTime: process.env[`CRON_TIME_${n}`] || defaultCronTimes[n],
    timezone: process.env[`TIMEZONE_${n}`] || config.timezone,
  });
}

// Special rotating "good morning" session -- doesn't read a MESSAGE env var;
// its text comes from messages.js's daily-rotating variant pool instead.
sessions.push({
  name: "session-morning",
  rotating: true,
  cronTime: process.env.CRON_TIME_MORNING || "0 3 * * *",
  timezone: process.env.TIMEZONE_MORNING || config.timezone,
});

config.sessions = sessions;

// Backward-compatible aliases (used by older scripts/tests).
config.message1 = sessions[0]?.message;
config.message2 = sessions[1]?.message;
config.cronTime1 = sessions[0]?.cronTime;
config.cronTime2 = sessions[1]?.cronTime;
config.timezone1 = sessions[0]?.timezone;
config.timezone2 = sessions[1]?.timezone;

module.exports = config;
