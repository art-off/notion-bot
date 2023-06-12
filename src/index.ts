import dotenv from 'dotenv'
import assert from "assert"

import { Repository } from "./database/reposiroty";
import { InMemoryStorage } from "./in-memory/in-memory-storage";
import { makeBot } from "./telegram-bot/bot";
import { makeNotionClient } from "./notion/notion-client"
import { SpeechToTextTranslator } from './speech-to-text/speech-to-text-translator';

// load ENV from .env
dotenv.config()


const getEnvOrFail = (name: string) => process.env[name] || assert.fail(`${name} must be in env vars`)

// Create dependencies
const inMemoryStorage = new InMemoryStorage()
const repository = new Repository(
    getEnvOrFail('SQLITE_FILE_PATH')
).prepared()
const speechToTextTranslator = new SpeechToTextTranslator(
    getEnvOrFail('YANDEX_API_KEY'),
    getEnvOrFail('YANDEX_FORLDER_ID')
)

const bot = makeBot(
    getEnvOrFail('TELEGRAM_BOT_TOKEN'),
    repository,
    inMemoryStorage,
    makeNotionClient,
    speechToTextTranslator
)
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));