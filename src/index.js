import { NotionClient } from "./notion/notion-client.js";
import { Telegraf, Scenes, session, Markup } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from 'dotenv'
import { Repository } from "./database/reposiroty.js";
import assert from "assert"
import { Session } from "inspector";
import { InMemoryStorage } from "./in-memory/in-memory-storage.js";
import { makeBot } from "./telegram-bot/bot.js";

// load ENV from .env
dotenv.config()

// TODO: Перенести все зависимости в контекст
const inMemoryStorage = new InMemoryStorage()
const repository = new Repository(
    process.env.SQLITE_FILE_PATH || assert.fail("SQLITE_FILE_PATH must be in env vars")
).prepared()

const bot = makeBot(repository, inMemoryStorage)
bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));