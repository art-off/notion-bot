export class InMemoryStorage {
    #obj

    constructor() {
        this.#obj = {}
    }

    getWritableObjWithId(id) {
        if (!this.#obj[id]) {
            this.#obj[id] = {}
        }
        return this.#obj[id]
    }

    clearId(id) {
        this.#obj[id] = null
    }
}