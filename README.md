# Horizon Discord Ticket Bot

Small Node.js service that logs a Discord bot in and exposes a protected endpoint for Horizon ticket notifications.

## Raven Environment

Required:

- `DISCORD_BOT_TOKEN` — Discord bot token. Keep this only in Raven Environment.
- `BOT_API_SECRET` — random server-to-server secret. Keep this only in Raven Environment and the Supabase Edge Function secret store.

Optional:

- `PORT` — Raven normally supplies this automatically.

## Discord settings

The Admin Panel stores only:

- Discord Server ID
- Ticket Notification Channel ID
- Discord server invite
- Notification enabled/disabled

The Horizon custom emoji IDs are fixed in `src/emoji.js` and are intentionally not configurable from the Admin Panel.

## API

`GET /health` — basic bot health.

`POST /api/tickets/notify` — protected by `Authorization: Bearer <BOT_API_SECRET>`.
