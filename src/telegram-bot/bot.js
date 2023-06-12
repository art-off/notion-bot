import { Telegraf, Scenes, session } from "telegraf"

import { makeUpdateNotionInfoScene } from "./update-notion-info-scene.js"
import { makeNotionTodoAddingScene } from "./notion-todo-adding-scene.js"

export const makeBot = (tgBotToken, repository, inMemoryStorage, makeNotionClient, speechToTextTranslator) => {
    const bot = new Telegraf(tgBotToken)

    const updateNotionInfoScene = makeUpdateNotionInfoScene(repository, inMemoryStorage)
    const notionTodoAddingScene = makeNotionTodoAddingScene(repository, makeNotionClient, speechToTextTranslator)

    const stage = new Scenes.Stage([updateNotionInfoScene, notionTodoAddingScene], { default: 'notion-todo-adding' })

    bot.use(session())
    bot.use(stage.middleware())

    return bot
}