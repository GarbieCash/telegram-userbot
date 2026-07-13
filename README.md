# Telegram Userbot

Logs in as your own Telegram account (not a bot) and automatically sends two
messages a day to a group you choose.

## 1. Get API credentials

1. Go to https://my.telegram.org/apps, log in with your phone number.
2. Create an app (any name/description works).
3. Copy the **api_id** and **api_hash** shown.

## 2. Configure

```bash
cd telegram-userbot
npm install
cp .env.example .env
```

Edit `.env`:

- `TELEGRAM_API_ID` / `TELEGRAM_API_HASH` -- from step 1.
- `TELEGRAM_GROUP` -- the group's username (without `@`), invite link, or numeric chat ID.
- `MESSAGE_1` / `MESSAGE_2` -- the two messages to send each day.
- `CRON_TIME_1` / `CRON_TIME_2` -- when to send them, as cron expressions (`minute hour * * *`). Defaults: 9:00 AM and 6:00 PM.
- `TIMEZONE` -- an IANA timezone, e.g. `America/New_York`, `Europe/London`, `Asia/Karachi`.

## 3. Log in once to generate a session

```bash
npm run login
```

You'll be asked for your phone number, the login code Telegram sends to your
app, and your 2FA password if you have one. It prints a **session string** at
the end -- copy it into `TELEGRAM_SESSION` in your `.env` (and later into
Render's environment variables).

Keep this session string private. It grants full access to your Telegram
account, the same as your password. Never commit it to git (`.env` is already
git-ignored).

## 4. Test it

```bash
npm run send-now
```

This sends `MESSAGE_1` immediately so you can confirm everything works before
relying on the schedule.

## 5. Run the scheduler

```bash
npm start
```

This keeps running and sends the two messages at the times you configured,
every day, until stopped.

## 6. Deploy to Render

1. Push this repo to GitHub (already done if you're reading this from your repo).
2. In Render, click **New +** -> **Blueprint**, and point it at your GitHub repo. Render will read `render.yaml` and create a **Background Worker** automatically. (If you'd rather set it up by hand, create a new **Background Worker** service, set the root directory to `telegram-userbot`, build command `npm install`, start command `npm start`.)
3. In the service's **Environment** tab, add the same variables from your `.env` file: `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_SESSION`, `TELEGRAM_GROUP`, `MESSAGE_1`, `MESSAGE_2`, and optionally `CRON_TIME_1`, `CRON_TIME_2`, `TIMEZONE`.
4. Deploy. Check the service logs -- you should see `Scheduler running. Waiting for the next scheduled send...`.

A Background Worker (not a Web Service) is the right fit here since this
process doesn't serve HTTP requests -- it just stays alive and fires on a
schedule.

## Notes

- This automates your personal Telegram account. Sending frequent or bulk
  messages can trigger Telegram's spam/anti-abuse limits -- twice a day to one
  group is well within normal use, but avoid pointing this at many groups or
  increasing frequency without understanding Telegram's rate limits.
- If you ever suspect the session string leaked, revoke it from Telegram's
  **Settings -> Devices** (it shows up as an active session) and run
  `npm run login` again to get a new one.
