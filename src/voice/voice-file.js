import fs from "fs/promises"

export class VoiceFileManager {

    constructor(voicesFolderPath) {
        this.voicesFolderPath = voicesFolderPath
    }

    async saveFile(voiceData, id) {
        try {
            return await fs.writeFile(`${this.voicesFolderPath}/${id}.ogg`, voiceData)
        } catch (err) {
            console.log(`file saving error: ${err}`)
            return null
        }
    }
}