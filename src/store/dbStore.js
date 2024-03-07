import { defineStore } from "pinia"

export const useDbStore = defineStore('dbStore', {
    state: () => {
        return {
            fileKey: null,
            isBuildNewFile: false,
            isSaveAs: false,
        }
    },
    actions: {

    }
})