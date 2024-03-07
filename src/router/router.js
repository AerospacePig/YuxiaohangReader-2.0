import { createRouter, createWebHashHistory } from 'vue-router'
import RecentRead from '../views/RecentRead.vue'
import TextCase from '../views/TextCase.vue'
import WriteText from '../views/WriteText.vue'
import TextRead from '../views/TextRead.vue'
import Setting from '../views/Setting.vue'
import { useReadStore } from '../store/readStore'
import { dialogOpen } from "../utils/dialog";

const readStore = useReadStore()

const routes = [
    {
        path: '/',
        name: 'recentRead',
        component: RecentRead,
        beforeEnter: (to, from, next) => {
            if (readStore.haveRecentRead) {
                next();
            } else {
                dialogOpen.alert('通告', "当前暂无任何最近阅读记录, 页面已返回'我的书库'")
                next({name: 'textCase'})
            }
        },
    },
    {
        path: '/textCase',
        name: 'textCase',
        component: TextCase,
    },
    {
        path: '/writeText',
        name: 'writeText',
        component: WriteText,
    },
    {
        path: '/textInformation/textRead',
        name: 'textRead',
        component: TextRead,
        beforeEnter: (to, from, next) => {
            readStore.startReadTime = new Date;
            next();
        },
    },
    {
        path: '/setting',
        name: 'setting',
        component: Setting,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
