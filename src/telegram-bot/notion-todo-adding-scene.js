import { Scenes } from "telegraf"
import { message } from "telegraf/filters"
import axios from "axios"

export const makeNotionTodoAddingScene = (repository, makeNotionClient, speechToTextTranslator) => {
    const scene = new Scenes.BaseScene('notion-todo-adding')

    const failMessage = 'Fail, try /update_info'

    scene
        .use(async (ctx, next) => {
            let user = await repository.getUser(ctx.from.id)
            // Если нет такого юзера, значит отправляем его обновлять инфу
            if (user == undefined) {
                return ctx.scene.enter('update-notion-info')
            }
            return await next()
        })
        .command('update_info', ctx => ctx.scene.enter('update-notion-info'))
        .on(message('voice'), async ctx => {
            let user = await repository.getUser(ctx.from.id)
            let voiceUrl = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
            let voiceResponse = await axios.get(voiceUrl, { responseType: 'arraybuffer' })
            let text = await speechToTextTranslator.speechToText(voiceResponse.data)

            if (!text) {
                return await ctx.reply('speech to text error')
            }

            let notionClient = makeNotionClient(user.notion_key)
            let success = await notionClient.addItemInto(user.notion_database_id, text)
            return await ctx.reply(success ? `Todo "${text}" added` : failMessage)
        })
        .on(message('text'), async ctx => {
            let user = await repository.getUser(ctx.from.id)
            let notionClient = makeNotionClient(user.notion_key)
            let success = await notionClient.addItemInto(user.notion_database_id, ctx.message.text)
            await ctx.reply(success ? 'Done' : failMessage)
        })
        .on('message', async (ctx) => {
            ctx.reply('Only text/audio messages please')
        })

    return scene
}