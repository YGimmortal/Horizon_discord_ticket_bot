# HorizonDev Discord Ticket Notification Bot

This bot sends a Discord embed whenever the Horizon Ticket backend tells it that a ticket was successfully created.

## What it does

1. Horizon Ticket creates a ticket in Supabase.
2. Your secure backend calls this bot's `/api/tickets/notify` endpoint.
3. The bot sends one embed to the configured Discord channel.
4. The embed has NO title. All ticket information is in the description.
5. A link button opens the ticket panel.

## Important security rule

Never put `DISCORD_BOT_TOKEN` in:
- HTML
- browser JavaScript
- localStorage
- client-side `.env`
- GitHub

Keep `.env` only on the private bot server.

## Requirements

- Node.js 22+
- A Discord application with a bot
- Bot invited to your HorizonDev server
- Bot can View Channel, Send Messages, and Embed Links in the notification channel

## Install

```bash
npm install
```

Copy `.env.example` to `.env` and fill in:

```text
DISCORD_BOT_TOKEN=...
DISCORD_NOTIFICATION_CHANNEL_ID=...
DISCORD_GUILD_ID=...
BOT_API_SECRET=...
DISCORD_SERVER_INVITE=...
```

Then:

```bash
npm start
```

## Test the API

After the bot is running, call:

```bash
curl http://localhost:3000/health
```

For a notification:

```bash
curl -X POST http://localhost:3000/api/tickets/notify \
  -H "Authorization: Bearer YOUR_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketNumber": "HZ-000421",
    "username": "@xyz",
    "userId": "USER-ID",
    "displayName": "XYZ",
    "subject": "I need help",
    "category": "General Question",
    "priority": "High",
    "status": "Open",
    "message": "My account needs help.",
    "createdAt": "2026-09-05T13:00:00+05:30",
    "ticketUrl": "https://ticket.horizondev.site/ticket.html?id=HZ-000421"
  }'
```

## Production architecture

```text
Horizon Ticket Panel
        |
        v
     Supabase
        |
        v
Secure backend / Edge Function
        |
        | HTTPS + BOT_API_SECRET
        v
Horizon Discord Bot
        |
        v
HorizonDev #ticket-info
```

The bot is only the notification sender. It does not create tickets and it does not decide whether tickets are valid.

## Recommended deployment

Run this Node.js service on a server/container that supports a persistent Node process.

Set all environment variables in the hosting provider's secret/environment settings rather than uploading `.env`.

## Next integration

The existing Horizon Ticket project can call:

`POST /api/tickets/notify`

only after the ticket has been successfully inserted.

The request body should contain:
- ticketNumber
- username/displayName
- userId
- subject
- category
- priority
- status
- message
- createdAt
- ticketUrl

The next step is integrating this endpoint with your existing Horizon Ticket backend and adding the Discord settings to the admin panel.
