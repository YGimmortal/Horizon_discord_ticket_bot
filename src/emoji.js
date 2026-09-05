/*
 * Horizon Discord emoji set.
 * These are intentionally fixed in the bot source so the Admin Panel stays simple.
 * IDs come from the Horizon emoji set supplied for this bot.
 */
const HORIZON_EMOJI = Object.freeze({
  tickets: { name: 'horizon_tickets', id: '1538886853418164295' },
  dev: { name: 'horizon_dev', id: '1538886957084446823' },
  note: { name: 'horizon_note', id: '1538886889539637419' },
  tag: { name: 'horizon_tag', id: '1538886934846509136' },
  tool: { name: 'horizon_tool', id: '1538886730537633196' },
  diamond: { name: 'horizon_diamond', id: '1538887005469933640' },
  tick: { name: 'horizon_tick', id: '1538887861204557885' },
  cross: { name: 'horizon_cross', id: '1538887679859499088' },
  shield: { name: 'horizon_shield', id: '1538886762468876368' },
  lock: { name: 'horizon_lock', id: '1538886712829215748' }
});

function discordEmoji(key, fallback = '') {
  const item = HORIZON_EMOJI[key];
  return item ? `<:${item.name}:${item.id}>` : fallback;
}

function discordEmojiObject(key) {
  const item = HORIZON_EMOJI[key];
  return item ? { id: item.id, name: item.name } : null;
}

module.exports = { HORIZON_EMOJI, discordEmoji, discordEmojiObject };
