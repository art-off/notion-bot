import { Telegraf, Scenes, session } from "telegraf"

import { makeUpdateNotionInfoScene } from "./update-notion-info-scene.js"
import { makeNotionTodoAddingScene } from "./notion-todo-adding-scene.js"
import { Repository } from "../database/reposiroty.js"
import { InMemoryStorage } from "../in-memory/in-memory-storage.js"
import { NotionClient } from "../notion/notion-client.js"
import { SpeechToTextTranslator } from "../speech-to-text/speech-to-text-translator.js"

export const makeBot = (
    tgBotToken: string,
    repository: Repository,
    inMemoryStorage: InMemoryStorage,
    makeNotionClient: (id: string) => NotionClient,
    speechToTextTranslator: SpeechToTextTranslator
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