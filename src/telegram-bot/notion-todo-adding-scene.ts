import { Scenes } from "telegraf"
import { message } from "telegraf/filters"
import axios from "axios"
import { IRepository } from "../database/reposiroty"
import { INotionClient } from "../notion/notion-client"
import { ISpeechToTextTranslator } from "../speech-to-text/speech-to-text-translator"

export const makeNotionTodoAddingScene = (
    repository: IRepository,
    makeNotionClient: (notionApiKey: string) => INotionClient,
    speechToTextTranslator: ISpeechToTextTranslator
): Scenes.BaseScene => {
    const scene = new Scenes.BaseScene('notion-todo-adding')

    const failMessage = 'Fail, try /update_info'

    scene
        .use(async (ctx, next) => {
            let user = await repository.getUser(ctx.from.id)
            // Если нет такого юзера, значит отправляем его обновлять инфу
            if (user == undefined) {
                // @ts-ignore: Property 'scene' does not exist on type 'Context<Update>'.ts(2339)
                return ctx.scene.enter('update-notion-info')
            }
            return await next()
        })
        .command('update_info', ctx => {
            // @ts-ignore: Property 'scene' does not exist on type 'Context<Update>'.ts(2339)
            ctx.scene.enter('update-notion-info')
        })
        .on(message('voice'), async ctx => {
            let user = await repository.getUser(ctx.from.id)
            let voiceUrl = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
            let voiceResponse = await axios.get(voiceUrl.toString(), { responseType: 'arraybuffer' })
            let text = await speechToTextTranslator.speechToText(voiceResponse.data)

            if (!text) {
                return await ctx.reply('Speech to text error')
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