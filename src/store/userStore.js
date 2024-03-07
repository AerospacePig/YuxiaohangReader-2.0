import { defineStore } from "pinia"

export const useUserStore = defineStore('userStore', {
    state: () => {
        return {
            user: null,
            appOptionShow: false,
            homePage: true,
        }
    },
    actions: {
        updateUser(userinfo) {
            this.user = userinfo
        },
    },
})
