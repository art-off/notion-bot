import { Telegraf, Scenes, session } from "telegraf"

import { makeUpdateNotionInfoScene } from "./update-notion-info-scene.js"
import { makeNotionTodoAddingScene } from "./notion-todo-adding-scene.js"

export const makeBot = (repository, inMemoryStorage, makeNotionClient, voiceFileManager) => {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

    const updateNotionInfoScene = makeUpdateNotionInfoScene(repository, inMemoryStorage)
    const notionTodoAddingScene = makeNotionTodoAddingScene(repository, makeNotionClient, voiceFileManager)

    const stage = new Scenes.Stage([updateNotionInfoScene, notionTodoAddingScene], { default: 'notion-todo-adding' })

    bot.use(session())
    bot.use(stage.middleware())

    return bot
}