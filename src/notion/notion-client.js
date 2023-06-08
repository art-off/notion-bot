import { Client } from "@notionhq/client"

export class NotionClient {
    constructor(notionApiKey) {
        this.client = new Client({ auth: notionApiKey })
    }

    async addItemInto(databaseId, title) {
        try {
            const response = await this.client.pages.create({
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