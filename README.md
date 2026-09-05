# Horizon Discord Ticket Bot

Discord notification service for the Horizon Ticket System.

## Private environment variables

Set these in Raven Environment:

- `DISCORD_BOT_TOKEN` — Discord bot token
- `BOT_API_SECRET` — private API secret shared with the Horizon Supabase Edge Function
- `PORT` — optional, defaults to `3000`

The Discord server ID, notification channel, invite URL and emoji IDs are **not** environment variables. They are controlled by the Horizon Admin Panel and sent to the bot server-side for each notification.

## Run

```bash
npm install
npm start
```

## Endpoints

- `GET /health`
- `POST /api/tickets/notify` with `Authorization: Bearer <BOT_API_SECRET>`

Never commit a real `.env` file or secret values to GitHub.
