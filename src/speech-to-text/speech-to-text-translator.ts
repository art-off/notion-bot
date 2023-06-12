import axios from "axios"

export interface ISpeechToTextTranslator {
    speechToText(voiceData: string): Promise<string | null>
}

export class SpeechToTextTranslator implements ISpeechToTextTranslator {
    #yandexApiKey: string
    #yandexFolderId: string

    constructor(yandexApiKey: string, yandexFolderId: string) {
        this.#yandexApiKey = yandexApiKey
        this.#yandexFolderId = yandexFolderId
    }

    async speechToText(voiceData: string): Promise<string | null> {
        let iAmToken = await this.getIAmToken()
        if (!iAmToken) {
            console.log('iAmToken error')
            return null
        }
        let response = await axios.post(
            'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
            Buffer.from(voiceData),
            {
                params: {
                    folderId: this.#yandexFolderId,
                    lang: 'ru-RU'
                },
                headers: {
                    'Authorization': `Bearer ${iAmToken}`
                }
            }
        )

        return response['data']['result']
    }

    async getIAmToken(): Promise<string | undefined> {
        let response = await axios.post(
            'https://iam.api.cloud.yandex.net/iam/v1/tokens',
            {
                yandexPassportOauthToken: this.#yandexApiKey
            }
        )
        return response['data']['iamToken']
    }
}