import { defineStore } from "pinia";

export const useLocalStore = defineStore('localStore', {
    state: () => {
        return {
            count: null,
            size: null,
            maxSize: null,
            cloudSongs: null
        }
    },
    actions: {
        updateCloudSongs(list) {
            this.cloudSongs = list
        }
    },
})
