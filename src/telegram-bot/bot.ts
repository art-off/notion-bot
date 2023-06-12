import { Telegraf, Scenes, session } from "telegraf"

import { makeUpdateNotionInfoScene } from "./update-notion-info-scene.js"
import { makeNotionTodoAddingScene } from "./notion-todo-adding-scene.js"
import { IRepository } from "../database/reposiroty.js"
import { IInMemoryStorage } from "../in-memory/in-memory-storage.js"
import { INotionClient } from "../notion/notion-client.js"
import { ISpeechToTextTranslator } from "../speech-to-text/speech-to-text-translator.js"

export const makeBot = (
    tgBotToken: string,
    repository: IRepository,
    inMemoryStorage: IInMemoryStorage,
    makeNotionClient: (id: string) => INotionClient,
    speechToTextTranslator: ISpeechToTextTranslator
) => {
    const bot = new Telegraf(tgBotToken)

    const stage = new Scenes.Stage(
        [
            // @ts-ignore
            makeUpdateNotionInfoScene(repository, inMemoryStorage),
            // @ts-ignore
            makeNotionTodoAddingScene(repository, makeNotionClient, speechToTextTranslator)
        ],
        { default: 'notion-todo-adding' }
    )

    bot.use(session())
    bot.use(stage.middleware())

    return bot
}