import { Scenes } from "telegraf"
import { message } from "telegraf/filters"

export const makeNotionTodoAddingScene = (repository, makeNotionClient) => {
    const scene = new Scenes.BaseScene('notion-todo-adding')

    scene
        .command('update_info', ctx => ctx.scene.enter('update-notion-info'))
        .on(message('text'), async cxt => {
            let user = await repository.getUser(cxt.from.id)

            // Если нет такого юзера, значит отправляем его обновлять инфу
            if (user == undefined) {
                return cxt.scene.enter('update-notion-info')
            }

            let notionClient = makeNotionClient(user.notion_key)
            let success = await notionClient.addItemInto(user.notion_database_id, cxt.message.text)

            await cxt.reply(success ? 'Done' : 'Fail, try /update_info')
        })
        .on('message', async (ctx) => {
            ctx.reply('Only text messages please')
        })

    return scene
}