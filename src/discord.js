const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const config = require("./config");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

function customEmoji(id, animated = false) {
  return id ? `<${animated ? "a" : ""}:horizon:${id}>` : "";
}

// Discord custom emoji names are configurable in your server.
// This helper uses the actual emoji ID and the intended display name.
function emoji(name, id, animated = false) {
  if (!id) return "";
  return `<${animated ? "a" : ""}:${name}:${id}>`;
}

function priorityIcon(priority) {
  switch (String(priority || "").toLowerCase()) {
    case "critical": return "🔴";
    case "high": return "🟠";
    case "medium": return "🟡";
    case "low": return "🟢";
    default: return "⚪";
  }
}

function truncate(value, max = 900) {
  const text = String(value ?? "").trim();
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function safeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function buildTicketEmbed(ticket) {
  const ticketUrl = safeUrl(ticket.ticketUrl);
  const inviteUrl = safeUrl(config.invite);

  const lines = [
    `${emoji("horizon_tickets", config.emoji.tickets)} **NEW TICKET CREATED**`,
    "",
    `${emoji("horizon_dev", config.emoji.dev)} **User**`,
    truncate(ticket.username || ticket.displayName || ticket.userId, 200),
    "",
    `${emoji("horizon_note", config.emoji.note)} **Ticket**`,
    truncate(ticket.ticketNumber, 100),
    "",
    `📝 **Subject**`,
    truncate(ticket.subject, 300),
    "",
    `${emoji("horizon_tag", config.emoji.tag)} **Category**`,
    truncate(ticket.category, 150),
    "",
    `${priorityIcon(ticket.priority)} **Priority**`,
    truncate(ticket.priority, 100),
    "",
    `${emoji("horizon_note", config.emoji.note)} **First Message**`,
    truncate(ticket.message, 900),
    "",
    `🕐 **Created**`,
    truncate(ticket.createdAt, 100)
  ];

  if (ticket.status) {
    lines.push("", `📌 **Status**`, truncate(ticket.status, 100));
  }

  const embed = new EmbedBuilder()
    // Intentionally NO embed title. All content goes in description.
    .setDescription(lines.join("\n"))
    .setTimestamp(new Date(ticket.createdAt || Date.now()));

  if (ticketUrl) {
    embed.addFields({
      name: `${emoji("horizon_tool", config.emoji.tool)} Open Ticket`,
      value: `[Open ticket](${ticketUrl})`
    });
  }

  if (inviteUrl) {
    embed.addFields({
      name: "HorizonDev",
      value: `[Open Discord server](${inviteUrl})`
    });
  }

  return embed;
}

async function sendTicketNotification(ticket) {
  if (!client.isReady()) {
    throw new Error("Discord client is not ready.");
  }

  const channel = await client.channels.fetch(config.channelId);

  if (!channel || !channel.isTextBased()) {
    throw new Error("Configured Discord notification channel was not found or is not text-based.");
  }

  const embed = buildTicketEmbed(ticket);

  const components = [];
  const ticketUrl = safeUrl(ticket.ticketUrl);

  if (ticketUrl) {
    components.push(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Open Ticket")
          .setStyle(ButtonStyle.Link)
          .setURL(ticketUrl)
          .setEmoji(config.emoji.tool ? { id: config.emoji.tool, name: "horizon_tool" } : "🔗")
      )
    );
  }

  const message = await channel.send({
    embeds: [embed],
    components
  });

  return {
    messageId: message.id,
    channelId: channel.id,
    guildId: message.guildId
  };
}

module.exports = {
  client,
  sendTicketNotification
};
