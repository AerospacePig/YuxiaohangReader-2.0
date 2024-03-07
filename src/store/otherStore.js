import { defineStore } from "pinia";

export const useOtherStore = defineStore('otherStore', {
    state: () => {
        return {
            coverDisplay: true,
            
            windowMaximized: false,

            noticeShow: false,
            noticeText: null,
            niticeOutAnimation: true,

            dialogShow: false,
            dialogHeader: null,
            dialogText: null,
            dialogCallback: null,
            cancelButton: false,

            addTextName: false,
            addAuthor: false,
            addDescription: false,

            searchShow: false,
            searchResult: null,

            isDispalyBackgroundImage: false,
        }
    },
    actions: {
        reDialogShow() {
            setTimeout(() => {
                this.dialogShow = true;
            }, 50); // 防止连续打开时动画被越过
        },
    }
})
