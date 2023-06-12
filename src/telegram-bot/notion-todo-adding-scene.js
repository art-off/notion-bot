import { Scenes } from "telegraf"
import { message } from "telegraf/filters"
import axios from "axios"

export const makeNotionTodoAddingScene = (repository, makeNotionClient, speechToTextTranslator) => {
    const scene = new Scenes.BaseScene('notion-todo-adding')

    scene
        .command('update_info', ctx => ctx.scene.enter('update-notion-info'))
        .on(message('voice'), async ctx => {
            let user = await repository.getUser(ctx.from.id)

            // TODO: Перенести в мидлварь
            // Если нет такого юзера, значит отправляем его обновлять инфу
            if (user == undefined) {
                return cxt.scene.enter('update-notion-info')
            }

            let voiceUrl = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
            let voiceResponse = await axios.get(voiceUrl, { responseType: 'arraybuffer' })
            let text = await speechToTextTranslator.speechToText(voiceResponse.data)
            if (text) {
                let notionClient = makeNotionClient(user.notion_key)
                let success = await notionClient.addItemInto(user.notion_database_id, text)
                await ctx.reply(success ? `Todo "${text}" added` : 'Fail, try /update_info')
            } else {
                await ctx.reply('speech to text error')
            }
        })
        .on(message('text'), async cxt => {
            let user = await repository.getUser(cxt.from.id)

            // TODO: Перенести в мидлварь
            // Если нет такого юзера, значит отправляем его обновлять инфу
            if (user == undefined) {
                return cxt.scene.enter('update-notion-info')
            }

            let notionClient = makeNotionClient(user.notion_key)
            let success = await notionClient.addItemInto(user.notion_database_id, cxt.message.text)

            await cxt.reply(success ? 'Done' : 'Fail, try /update_info')
        })
        .on('message', async (ctx) => {
            ctx.reply('Only text/audio messages please')
        })

    return scene
}