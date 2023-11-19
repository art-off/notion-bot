import dotenv from 'dotenv'
import assert from "assert"
import { Repository } from "./database/reposiroty.js";
import { InMemoryStorage } from "./in-memory/in-memory-storage.js";
import { makeBot } from "./telegram-bot/bot.js";
import { makeNotionClient } from "./notion/notion-client.js"
import { SpeechToTextTranslator } from './speech-to-text/speech-to-text-translator.js';

// load ENV from .env
dotenv.config()

const getEnvOrFail = (name) => process.env[name] || assert.fail(`${name} must be in env vars`)

// Create dependencies
const inMemoryStorage = new InMemoryStorage()
const repository = new Repository(
    getEnvOrFail('SQLITE_FILE_PATH')
).prepared()
const speechToTextTranslator = new SpeechToTextTranslator(
    getEnvOrFail('YANDEX_API_KEY'),
    getEnvOrFail('YANDEX_FORLDER_ID')
)

const bot = makeBot(getEnvOrFail('TELEGRAM_BOT_TOKEN'), repository, inMemoryStorage, makeNotionClient, speechToTextTranslator)
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
