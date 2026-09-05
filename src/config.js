require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

module.exports = {
  token: required("DISCORD_BOT_TOKEN"),
  channelId: required("DISCORD_NOTIFICATION_CHANNEL_ID"),
  guildId: process.env.DISCORD_GUILD_ID?.trim() || null,
  apiSecret: required("BOT_API_SECRET"),
  port: Number(process.env.PORT || 3000),
  invite: process.env.DISCORD_SERVER_INVITE?.trim() || null,

  emoji: {
    tickets: process.env.EMOJI_TICKETS_ID?.trim() || null,
    dev: process.env.EMOJI_DEV_ID?.trim() || null,
    note: process.env.EMOJI_NOTE_ID?.trim() || null,
    tag: process.env.EMOJI_TAG_ID?.trim() || null,
    tool: process.env.EMOJI_TOOL_ID?.trim() || null,
    tick: process.env.EMOJI_TICK_ID?.trim() || null,
    cross: process.env.EMOJI_CROSS_ID?.trim() || null
  }
};
