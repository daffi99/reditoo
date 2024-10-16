const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { fileId } = JSON.parse(event.body)
    const fileLink = await bot.getFileLink(fileId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({ downloadUrl: fileLink })
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to get file' }) }
  }
}