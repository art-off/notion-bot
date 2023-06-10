import { Scenes } from "telegraf"
import { message } from "telegraf/filters"

export const makeNotionTodoAddingScene = (repository) => {
    const scene = new Scenes.BaseScene('notion-todo-adding')
    // scene.enter((ctx) => ctx.reply('echo scene'))
    // scene.leave((ctx) => ctx.reply('exiting echo scene'))
    // scene.command('back', leave())
    scene.on(message('text'), ctx => ctx.reply(ctx.message.text))
    scene.on('message', (ctx) => ctx.reply('Only text messages please'))
    return scene
}