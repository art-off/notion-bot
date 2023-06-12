import { Scenes } from "telegraf"
import { IRepository, Repository } from "../database/reposiroty"
import { IInMemoryStorage } from "../in-memory/in-memory-storage"

export const makeUpdateNotionInfoScene = (
    repository: IRepository,
    inMemoryStorage: IInMemoryStorage
): Scenes.BaseScene => {
    let scene = new Scenes.WizardScene(
        'update-notion-info',
        async (ctx) => {
            ctx.reply('Enter notion api key')
            ctx.wizard.next()
        },
        async (ctx) => {
            if (!('text' in ctx.message)) {
                return ctx.reply('Only text')
            }
            let info = inMemoryStorage.getWritableObjWithId(ctx.from.id)
            info['notionKey'] = ctx.message.text
            await ctx.reply('Enter notion database id')
            ctx.wizard.next()
        },
        async (ctx) => {
            if (!('text' in ctx.message)) {
                return ctx.reply('Only text')
            }
            let info = inMemoryStorage.getWritableObjWithId(ctx.from.id)
            info['notionDatabaseId'] = ctx.message.text
            repository.createUser(ctx.from.id, info['notionKey'], info['notionDatabaseId'])
            inMemoryStorage.clearId(ctx.from.id)
            ctx.reply('Done')
            return ctx.scene.enter('notion-todo-adding')
        }
    )
    return scene
}