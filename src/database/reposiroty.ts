import sqlite3 from "sqlite3"

export class Repository {
    #db: sqlite3.Database

    constructor(sqlitePath: string) {
        this.#db = new sqlite3.Database(sqlitePath)
    }

    prepared(): Repository {
        this.#db.serialize(() => {
            this.#makeTables()
        })
        return this
    }

    createUser(tgId: number, notionKey: string, notionDatabaseId: string) {
        try {
            this.#db
                .prepare("INSERT OR REPLACE INTO tg_users VALUES (?, ?, ?)")
                .run(tgId, notionKey, notionDatabaseId)
                .finalize()
        } catch (err) {
            console.log(`createUser error: ${err}`)
        }
    }

    async getUser(tgId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.#db
                    .get(`SELECT * FROM tg_users WHERE tg_id = ${tgId}`, (err, row) => {
                        if (err) { throw err }
                        resolve(row)
                    })
            } catch (err) {
                console.log(`getUser error: ${err}`)
                reject(err)
            }
        })
    }


    // Helpers
    #makeTables() {
        this.#db.run(`CREATE TABLE IF NOT EXISTS tg_users (
            tg_id INTEGER PRIMARY KEY, 
            notion_key TEXT, 
            notion_database_id TEXT
        );`)
    }
}