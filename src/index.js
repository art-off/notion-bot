import dotenv from 'dotenv'
import assert from "assert"
import { Repository } from "./database/reposiroty.js";
import { InMemoryStorage } from "./in-memory/in-memory-storage.js";
import { makeBot } from "./telegram-bot/bot.js";
import { makeNotionClient } from "./notion/notion-client.js"

// load ENV from .env
dotenv.config()

// Create dependencies
const inMemoryStorage = new InMemoryStorage()
const repository = new Repository(
    process.env.SQLITE_FILE_PATH || assert.fail("SQLITE_FILE_PATH must be in env vars")
).prepared()


const bot = makeBot(repository, inMemoryStorage, makeNotionClient)
bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));