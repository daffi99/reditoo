const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

exports.handler = async function(event, context) {
  try {
    // Get the list of files from your Telegram bot
    // This is a placeholder implementation. You'll need to implement the actual logic
    // to retrieve the list of files from your Telegram bot or your preferred storage solution.
    const files = [
      { file_id: '1', file_name: 'example1.txt', file_size: 1024 },
      { file_id: '2', file_name: 'example2.jpg', file_size: 2048 },
      // Add more files as needed
    ]

    return {
      statusCode: 200,
      body: JSON.stringify(files),
    }
  } catch (error) {
    console.error('Error fetching files:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch files' }),
    }
  }
}