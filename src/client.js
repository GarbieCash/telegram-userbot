const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const config = require("./config");

function createClient() {
  if (!config.sessionString) {
    throw new Error(
      "Missing TELEGRAM_SESSION. Run `npm run login` first to generate a session string, then set it as the TELEGRAM_SESSION env var / secret."
    );
  }

  const session = new StringSession(config.sessionString);
  return new TelegramClient(session, config.apiId, config.apiHash, {
    connectionRetries: 5,
  });
}

/**
 * Resolves the configured target into something sendMessage() can use.
 * Supports plain usernames/IDs as well as private invite links
 * (https://t.me/+xxxx or https://t.me/joinchat/xxxx) -- joining the
 * chat first if the account isn't already a member.
 */
async function resolveTarget(client, target) {
  const inviteMatch = target.match(/t\.me\/(?:\+|joinchat\/)([\w-]+)/);
  const hash = inviteMatch ? inviteMatch[1] : target.startsWith("+") ? target.slice(1) : null;

  if (!hash) {
    return target;
  }

  const invite = await client.invoke(new Api.messages.CheckChatInvite({ hash }));

  if (invite.chat) {
    // Already a member -- ChatInviteAlready includes the chat entity directly.
    return invite.chat;
  }

  const joined = await client.invoke(new Api.messages.ImportChatInvite({ hash }));
  return joined.chats[0];
}

module.exports = { createClient, resolveTarget };
