<script setup>
  import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useDbStore } from '../store/dbStore';

  const dbStore = useDbStore()
  const allCollect = ref('')

  const getFileKey = (currentFileKey) =>  dbStore.fileKey = currentFileKey

  const getBasicData = () => {
    windowApi.getAllCollect()
    .then(result => {
      allCollect.value = result;

      allCollect.value.forEach(jsonData => {
        Object.keys(jsonData).forEach(key => {
          if (jsonData[key] === null) {
            jsonData[key] = '---';
          }
        });
      })
    })
  }

  onBeforeMount(() => {
    getBasicData();
    windowApi.dbUpdateMonitor(getBasicData);
  })
  onBeforeRouteLeave(() => {
    windowApi.removeAllDbUpdateMonitor();
  });
</script>

<template>
  <div class="collect">
    <div class="collect-items">
      <div class="collect-items-item" @click="getFileKey(item.fileKey) " v-for="(item, index) in allCollect" :key="index">
        <div class="fileName" :style="{ backgroundColor: index % 2 == 0 ? 'rgba(0, 0, 0, 0.07)' : 'transparent' }">
          <div>{{ item.fileName }}</div>
        </div>
        <div class="author" :style="{ border: index % 2 != 0 ? '2px solid rgba(0, 0, 0, 0.1)' : 'none' }">
          <div>{{ item.author }}</div>
        </div>
      </div>
    </div>
    <span class="border-bottom-right"></span>
  </div>
</template>

<style lang="scss">
.collect {
  width: 100%;
  height: 100%;
  padding: 2% 2% 7% 0;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
  &-items {
    height: 100%;
    padding-left: 2%;
    overflow: hidden scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    &-item {
      width: 100%;
      height: 15%;
      display: flex;
      .fileName {
        width: 50%;
        height: 100%;
        margin: 0 auto;
        font-size: 0.9vw;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 10px;
      }
      .author {
        width: 50%;
        height: 100%;
        margin: 0 auto;
        font-size: 0.9vw;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
      }
    }
  }
  .border-bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10vw;
    height: 10vh;
    background-color: transparent;
    border: 2px solid rgba(0, 0, 0, 1);
    border-left: none;
    border-top: none;
    &::before {
      content: '收藏展示';
      width: 5vw;
      height: 1.5vh;
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 0.7vw;
      border-radius: 10px 0 0 0;
      background-color: rgba(0, 0, 0, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
  &::before {
    content: '';
    width: 10vw;
    height: 1.5px;
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background-color: rgba(0, 0, 0, 1);
  }
}
.list-enter-from {
  transform: translateX(-100%);
}
.list-enter-active {
  transition: all 2s;
}
.list-enter-to {
  transform: translateX(0);
}
.list-leave-from {
  transform: translateX(0);
}
.list-leave-active {
  transition: all 2s;
}
.list-leave-to {
  transform: translateX(100%);
}
</style>