const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const config = require('./config');
const { discordEmoji, discordEmojiObject } = require('./emoji');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function priorityIcon(priority) {
  switch (String(priority || '').toLowerCase()) {
    case 'critical': return discordEmoji('cross', '🔴');
    case 'high': return discordEmoji('tag', '🟠');
    case 'medium': return discordEmoji('diamond', '🟡');
    case 'low': return discordEmoji('shield', '🟢');
    default: return discordEmoji('diamond', '⚪');
  }
}

function truncate(value, max = 900) {
  const text = String(value ?? '').trim();
  if (!text) return '—';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function safeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function buildTicketEmbed(ticket, discord) {
  const ticketUrl = safeUrl(ticket.ticketUrl);
  const inviteUrl = safeUrl(discord.invite);

  const lines = [
    `${discordEmoji('tickets')} **NEW TICKET CREATED**`,
    '',
    `${discordEmoji('dev')} **User**`,
    truncate(ticket.username || ticket.displayName || ticket.userId, 200),
    '',
    `${discordEmoji('note')} **Ticket**`,
    truncate(ticket.ticketNumber, 100),
    '',
    `**Subject**`,
    truncate(ticket.subject, 300),
    '',
    `${discordEmoji('tag')} **Category**`,
    truncate(ticket.category, 150),
    '',
    `${priorityIcon(ticket.priority)} **Priority**`,
    truncate(ticket.priority, 100),
    '',
    `${discordEmoji('note')} **First Message**`,
    truncate(ticket.message, 900),
    '',
    `**Created**`,
    truncate(ticket.createdAt, 100)
  ];

  if (ticket.status) lines.push('', `**Status**`, truncate(ticket.status, 100));

  const embed = new EmbedBuilder()
    .setDescription(lines.join('\n'))
    .setTimestamp(new Date(ticket.createdAt || Date.now()));

  if (ticketUrl) {
    embed.addFields({
      name: `${discordEmoji('tool')} Open Ticket`,
      value: `[Open ticket](${ticketUrl})`
    });
  }

  if (inviteUrl) {
    embed.addFields({
      name: `${discordEmoji('shield')} HorizonDev`,
      value: `[Open Discord server](${inviteUrl})`
    });
  }

  return embed;
}

async function sendTicketNotification(ticket) {
  if (!client.isReady()) throw new Error('Discord client is not ready.');
  const discord = ticket.discord || {};
  if (!discord.channelId) throw new Error('No Discord notification channel is configured.');

  const channel = await client.channels.fetch(discord.channelId);
  if (!channel || !channel.isTextBased()) {
    throw new Error('Configured Discord notification channel was not found or is not text-based.');
  }

  if (discord.guildId && channel.guildId && channel.guildId !== discord.guildId) {
    throw new Error('Configured channel does not belong to the configured Discord server.');
  }

  const embed = buildTicketEmbed(ticket, discord);
  const components = [];
  const ticketUrl = safeUrl(ticket.ticketUrl);
  const toolEmoji = discordEmojiObject('tool');

  if (ticketUrl) {
    const button = new ButtonBuilder()
      .setLabel('Open Ticket')
      .setStyle(ButtonStyle.Link)
      .setURL(ticketUrl);
    if (toolEmoji) button.setEmoji(toolEmoji);
    components.push(new ActionRowBuilder().addComponents(button));
  }

  const message = await channel.send({
    embeds: [embed],
    components
  });
  return { messageId: message.id, channelId: channel.id, guildId: message.guildId };
}

module.exports = { client, sendTicketNotification };
