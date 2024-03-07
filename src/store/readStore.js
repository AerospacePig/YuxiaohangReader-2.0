import { defineStore } from "pinia"

export const useReadStore = defineStore('readStore', {
    state: () => {
        return {
            haveRecentRead: true,

            readSpread: true,
            writeSpread: false,
            isBarSpread: true,
            isCatalogSpread: true,
            isStatusSidebar: true,
            isOptionSidebar: false,

            currentChapterId: 1,
            currentChapterName: '',
            startReadTime: null,
            skipChapterId: 0,

            fontSize: 14,
            letterSpacing: 1,
            lineHeight: 1.5,
            defaultFontSize: 14,
            defaultLineHeight: 1.5,
            defaultFletterSpacing: 1,

            fontFamily: 'Arial',
            fontColor: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            readBackground: 'src/assets/img/textReadBac.jpg',
        }
    },
    actions: {

    }
});
