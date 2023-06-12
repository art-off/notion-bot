import { Scenes } from "telegraf"

export const makeUpdateNotionInfoScene = (repository, inMemoryStorage) => {
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