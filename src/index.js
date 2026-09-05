const express = require("express");
const config = require("./config");
const { client, sendTicketNotification } = require("./discord");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

function authenticate(req, res, next) {
  const auth = req.get("authorization") || "";
  const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!supplied || supplied !== config.apiSecret) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  next();
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    discordReady: client.isReady(),
    notificationChannelId: config.channelId
  });
});

app.post("/api/tickets/notify", authenticate, async (req, res) => {
  try {
    const ticket = req.body || {};

    if (!ticket.ticketNumber) {
      return res.status(400).json({
        ok: false,
        error: "ticketNumber is required"
      });
    }

    if (!ticket.subject) {
      return res.status(400).json({
        ok: false,
        error: "subject is required"
      });
    }

    const result = await sendTicketNotification(ticket);

    return res.status(200).json({
      ok: true,
      ...result
    });
  } catch (error) {
    console.error("[Discord notification]", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to send Discord notification"
    });
  }
});

app.listen(config.port, () => {
  console.log(`[Horizon Bot] Notification API listening on port ${config.port}`);
});

client.once("ready", async () => {
  console.log(`[Horizon Bot] Logged in as ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(config.channelId);
    console.log(`[Horizon Bot] Notification channel: #${channel?.name || config.channelId}`);

    if (config.guildId && channel?.guildId !== config.guildId) {
      console.warn("[Horizon Bot] WARNING: channel is not in DISCORD_GUILD_ID.");
    }
  } catch (error) {
    console.error("[Horizon Bot] Could not access notification channel:", error.message);
  }
});

client.on("error", (error) => {
  console.error("[Horizon Bot] Discord client error:", error);
});

client.login(config.token);
