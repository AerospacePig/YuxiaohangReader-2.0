import pinia from "../store/pinia";
import { storeToRefs } from "pinia";
import { useOtherStore } from "../store/otherStore";

const otherStore = useOtherStore(pinia);
const {
    dialogShow,
    dialogHeader,
    dialogText,
    dialogCallback,
    cancelButton,
    noticeShow,
    noticeText,
    niticeOutAnimation,
} = storeToRefs(otherStore);

let callbackLogic = null;

export const dialogOpen = {
    alert: (header, text, callback=null) => {
        dialogSetter(header, text, callback)
        cancelButton.value = false;
    },
    select: (header, text, callback) => {
        dialogSetter(header, text, callback)
        cancelButton.value = true;
    }
}

export function continuousDialog(header, textarray, i=0) { // 这玩意不知道当时是什么精神状态下写出来的~
    dialogOpen.alert(header, textarray[i], () => { // 连续对话这套逻辑只支持alert框, 且要求对话标题一致
        i++;
        if (i < textarray.length) {
            continuousDialog(i)
        }
    })
}

export function dialogSetter(header, text, callback) {
    otherStore.reDialogShow();
    dialogHeader.value = header;
    dialogText.value = text;
    dialogCallback.value = callback // 不直接传给callbackLogic是为了解决electron不把赋为回调函数的callbackLogic变量识别为函数的bug
}                                   // 于是我只想到用store做中间值保存一下, 免得浏览器隔一会就把callbackLogic变量重置为null了
                                    // 当然大概率是我学的知识实在有限...

export function dialogCancel() {
    callbackLogic = dialogCallback.value
    dialogShow.value = false;
    dialogHeader.value = null;
    dialogText.value = null;
    if (callbackLogic) callbackLogic(false);
}

export function dialogConfirm() {
    callbackLogic = dialogCallback.value
    dialogShow.value = false;
    dialogHeader.value = null;
    dialogText.value = null;
    if (callbackLogic) callbackLogic(true);
}

let noticeTimer1 = null
let noticeTimer2 = null
export function noticeOpen(text, duration=2) {
    noticeShow.value = false
    niticeOutAnimation.value = false
    clearTimeout(noticeTimer1)
    clearTimeout(noticeTimer2)

    noticeShow.value = true
    noticeText.value = text

    noticeTimer1 = setTimeout(() => {
        niticeOutAnimation.value = true
        clearTimeout(noticeTimer1)
        noticeTimer2 = setTimeout(() => {
            noticeShow.value = false
            niticeOutAnimation.value = false
            clearTimeout(noticeTimer2)
        }, 300);
    }, duration * 1000);
}
