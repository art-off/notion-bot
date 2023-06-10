import { NotionClient } from "./notion/notion-client.js";
import { Telegraf, Scenes, session, Markup } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from 'dotenv'
import { Repository } from "./database/reposiroty.js";
import assert from "assert"
import { Session } from "inspector";
import { InMemoryStorage } from "./in-memory/in-memory-storage.js";

// load ENV from .env
dotenv.config()

// TODO: Перенести все зависимости в контекст
const inMemoryStorage = new InMemoryStorage()
const repository = new Repository(
    process.env.SQLITE_FILE_PATH || assert.fail("SQLITE_FILE_PATH must be in env vars")
).prepared()

const makeUpdateNotionInfoScene = () => {
    let scene = new Scenes.WizardScene('update-notion-info',
        (ctx) => {
            ctx.reply('Enter notion api key')
            return ctx.wizard.next()
        },
        (ctx) => {
            let info = inMemoryStorage.getWritableObjWithId(ctx.from.id)
            info.notionKey = ctx.message.text
            ctx.reply('Enter notion database id')
            return ctx.wizard.next()
        },
        (ctx) => {
            let info = inMemoryStorage.getWritableObjWithId(ctx.from.id)
            info.notionDatabaseId = ctx.message.text
            repository.createUser(ctx.from.id, info.notionKey, info.notionDatabaseId)
            inMemoryStorage.clearId(ctx.from.id)
            ctx.reply('Done')
            return ctx.scene.enter('notion-todo-adding')
        }
    )
    return scene
}

const makeNotionTodoAddingScene = () => {
    const scene = new Scenes.BaseScene('notion-todo-adding')
    // scene.enter((ctx) => ctx.reply('echo scene'))
    // scene.leave((ctx) => ctx.reply('exiting echo scene'))
    // scene.command('back', leave())
    scene.on(message('text'), ctx => ctx.reply(ctx.message.text))
    scene.on('message', (ctx) => ctx.reply('Only text messages please'))
    return scene
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const updateNotionInfoScene = makeUpdateNotionInfoScene()
const notionTodoAddingScene = makeNotionTodoAddingScene()
const stage = new Scenes.Stage([updateNotionInfoScene, notionTodoAddingScene], { default: 'update-notion-info' })
bot.use(session())
bot.use(stage.middleware())

// bot.command('update_info', ctx => ctx.scene.enter('update-notion-info'))
// bot.command('')

// bot.on(message('text'), async (cxt) => {
//     let success = await notionClient.addItemInto(databaseId, cxt.message.text)
//     await cxt.reply(success ? 'Done' : 'Fail')
// })
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));