const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN)
const STORAGE_CHAT_ID = process.env.STORAGE_CHAT_ID

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { name, content } = JSON.parse(event.body)
    const buffer = Buffer.from(content.split(',')[1], 'base64')
    
    const sentMessage = await bot.sendDocument(STORAGE_CHAT_ID, buffer, {}, { filename: name })
    
    const file = {
      id: sentMessage.document.file_id,
      name: sentMessage.document.file_name,
      type: sentMessage.document.mime_type,
      size: `${(sentMessage.document.file_size / 1024 / 1024).toFixed(2)} MB`,
      modified: new Date().toISOString(),
    }

    const chat = await bot.getChat(STORAGE_CHAT_ID)
    const files = chat.pinned_message ? JSON.parse(chat.pinned_message.text) : []
    files.push(file)
    await bot.unpinChatMessage(STORAGE_CHAT_ID)
    const pinnedMessage = await bot.sendMessage(STORAGE_CHAT_ID, JSON.stringify(files))
    await bot.pinChatMessage(STORAGE_CHAT_ID, pinnedMessage.message_id)

    return {
      statusCode: 200,
      body: JSON.stringify(file)
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to upload file' }) }
  }
}