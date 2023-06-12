export interface IInMemoryStorage {
    getWritableObjWithId(id: string | number): Object
    clearId(id: string | number): void
}

export class InMemoryStorage implements IInMemoryStorage {
    #obj: Object

    constructor() {
        this.#obj = {}
    }

    getWritableObjWithId(id: string | number): Object {
        if (!this.#obj[id]) {
            this.#obj[id] = {}
        }
        return this.#obj[id]
    }

    clearId(id: string | number) {
        this.#obj[id] = null
    }
}