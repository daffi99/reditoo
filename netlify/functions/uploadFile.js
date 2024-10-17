const { Telegraf } = require('telegraf')
const fetch = require('node-fetch')

const bot = new Telegraf(process.env.BOT_TOKEN)

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const formData = new FormData()
  formData.append('file', event.body)

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (result.ok) {
      const fileInfo = {
        file_id: result.result.document.file_id,
        file_name: result.result.document.file_name,
        file_size: result.result.document.file_size,
      }

      return {
        statusCode: 200,
        body: JSON.stringify(fileInfo),
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to upload file to Telegram' }),
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload file' }),
    }
  }
}