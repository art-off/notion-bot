import { Scenes } from "telegraf"
import { message } from "telegraf/filters"

export const makeNotionTodoAddingScene = (repository) => {
    const goToUpdateInfoIfNeeded = async (ctx) => {
        let user = await repository.getUser(ctx.from.id)
        if (user == undefined) {
            ctx.scene.enter('update-notion-info')
            return true
        }
        return false
    }

    const scene = new Scenes.BaseScene('notion-todo-adding')

    scene.on(message('text'), async ctx => {
        if (await goToUpdateInfoIfNeeded(ctx)) return
        ctx.reply(ctx.message.text)
    })
    scene.on('message', async (ctx) => {
        ctx.reply('Only text messages please')
    })

    return scene
}