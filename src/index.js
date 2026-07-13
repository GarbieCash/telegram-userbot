/**
 * Long-running scheduler: keeps a Telegram userbot session alive and
 * sends the two configured daily messages to the target group.
 *
 * Deploy this as a Background Worker on Render (not a Web Service --
 * it doesn't listen on a port).
 */
const cron = require("node-cron");
const config = require("./config");
const { sendMessage } = require("./sendMessage");

function scheduleJob(name, cronExpression, text, timezone) {
  if (!cron.validate(cronExpression)) {
    throw new Error(`Invalid cron expression for ${name}: "${cronExpression}"`);
  }

  cron.schedule(
    cronExpression,
    async () => {
      try {
        await sendMessage(text);
      } catch (err) {
        console.error(`[${name}] failed to send scheduled message:`, err);
      }
    },
    { timezone }
  );

  console.log(`Scheduled "${name}" at cron "${cronExpression}" (${timezone})`);
}

function main() {
  console.log("Telegram userbot scheduler starting...");
  console.log(`Target groups: ${config.targetGroups.join(", ")}`);

  for (const session of config.sessions) {
    scheduleJob(session.name, session.cronTime, session.message, session.timezone);
  }

  console.log("Scheduler running. Waiting for the next scheduled send...");
}

main();
