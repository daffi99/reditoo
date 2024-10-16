const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
const STORAGE_CHAT_ID = process.env.STORAGE_CHAT_ID

exports.handler = async function(event, context) {
  try {
    const chat = await bot.getChat(STORAGE_CHAT_ID)
    const files = chat.pinned_message ? JSON.parse(chat.pinned_message.text) : []
    
    return {
      statusCode: 200,
      body: JSON.stringify(files)
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch files' }) }
  }
}