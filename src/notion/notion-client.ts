import { Client } from "@notionhq/client"

export class NotionClient {
    #client: Client

    constructor(notionApiKey: string) {
        this.#client = new Client({ auth: notionApiKey })
    }

    async addItemInto(databaseId: string, title: string): Promise<boolean> {
        try {
            await this.#client.pages.create({
                parent: { database_id: databaseId },
                properties: {
                    title: {
                        title: [
                            {
                                "text": {
                                    "content": title
                                }
                            }
                        ]
                    }
                },
            })
            return true
        } catch (error) {
            return false
        }
    }
}

export const makeNotionClient = (notionApiKey: string): NotionClient => {
    return new NotionClient(notionApiKey)
}