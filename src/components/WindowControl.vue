<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia'
import { useOtherStore } from '../store/otherStore';

const otherStore = useOtherStore()
const { windowMaximized } = storeToRefs(otherStore)

let eventAddCount = 0;
const callback = () => {
  windowApi.windowResize()
  eventAddCount ++;
  windowApi.windowMaximized(eventAddCount, (event, value) => {
    windowMaximized.value = value
  })
  if (eventAddCount > 1) eventAddCount = 1
}

onMounted(() => {
  window.addEventListener('resize', callback)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', callback)
})

function windowControl(option) {
  if (option == 1) {
    windowApi.windowMin()
  } else if (option == 2) {
    windowApi.windowMax()
  } else {
    windowApi.windowClose()
  }
}
</script>

<template>
  <div class="window-control">
    <div @click="windowControl(1)" class="minimize">
      <svg :style="{ fill: otherStore.coverDisplay ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)' }" t="1668091020963" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1210" width="200" height="200"><path d="M65.23884 456.152041 958.760137 456.152041l0 111.695918L65.23884 567.847959 65.23884 456.152041z" p-id="1211"></path></svg>
    </div>
    <div @click="windowControl(2)" class="maximize">
      <svg :style="{ fill: otherStore.coverDisplay ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)' }" v-if="! otherStore.windowMaximized" t="1668091098382" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1187" width="200" height="200"><path d="M128.576377 895.420553 128.576377 128.578424l766.846222 0 0 766.842129L128.576377 895.420553zM799.567461 224.434585 224.432539 224.434585l0 575.134923 575.134923 0L799.567461 224.434585z" p-id="1188"></path></svg>
      <svg :style="{ fill: otherStore.coverDisplay ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)' }" v-else viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" p-id="1189" width="200" height="200"><path d="M64 464H288c8.8 0 16-7.2 16-16V384h48v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM224 304H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16V288c0 8.8 7.2 16 16 16zm-64-16V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"></path></svg>
    </div>
    <div @click="windowControl(0)" class="close-window">
      <svg :style="{ fill: otherStore.coverDisplay ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)' }" t="1668091127480" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1341" width="200" height="200"><path d="M956.171172 875.411847l-80.757279 80.757279L511.997953 592.757279 148.586107 956.170149 67.828828 875.411847l363.411847-363.411847L67.828828 148.58713l80.757279-80.757279 363.411847 363.411847L875.413893 67.829851l80.757279 80.757279L592.756255 512 956.171172 875.411847z" p-id="1342"></path></svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .window-control {
    width: 130Px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    -webkit-app-region: drag;

    div {
      display: flex;
      opacity: 1;
      transition: 0.3s;
      padding: 10Px;
      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
      svg {
        width: 18Px;
        height: 18Px;
      }
    }
  }
</style>