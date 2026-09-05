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
  apiSecret: required("BOT_API_SECRET"),
  port: Number(process.env.PORT || 3000)
};
