import { NotionClient } from "./notion/notion-client.js";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from 'dotenv'

// load ENV from .env
dotenv.config()

const databaseId = process.env.NOTION_DATABASE_ID

const notionClient = new NotionClient(process.env.NOTION_KEY)
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.on(message('text'), async (cxt) => {
    let success = await notionClient.addItemInto(databaseId, cxt.message.text)
    await cxt.reply(success ? 'Done' : 'Fail')
})
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));