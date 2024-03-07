<script setup>
  import { ref, onBeforeMount } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useDbStore } from '../store/dbStore';

  const dbStore = useDbStore()
  const recentUpload = ref('')

  const getFileKey = (currentFileKey) =>  dbStore.fileKey = currentFileKey

  const getBasicData = () => {
    windowApi.getRecentUpload()
    .then(result => {
        recentUpload.value = result
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
  <div class="recent-upload">
    <span class="border-top-right"></span>
    <div class="recent-upload-items">
      <div class="recent-upload-items-item" @click="getFileKey(item.fileKey) " v-for="(item, index) in recentUpload" :key="index">
        <span class="uploadDate">{{ item.uploadDate }}</span>
        <span class="fileName">{{ item.fileName }}</span>
      </div>
    </div>
    <span class="border-bottom-left">最近上传&nbsp;&nbsp;(7天)</span>
    <span class="border-bottom-right"></span>
  </div>
</template>

<style lang="scss" scoped>
  .recent-upload {
    width: 100%;
    height: 100%;
    padding-top: 5%;
    padding-bottom: 7%;
    position: relative;
    overflow: hidden;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
    .border-top-right-title {
      position: absolute;
      top: 0;
      right: 0;
      width: 25%;
      height: 6%;
      border-radius: 10px;
      padding-left: 0.5vw;
      text-align: start;
      font-size: 0.7vw;
      color: rgba(255, 255, 255, 1);
      background-color: rgba(0, 0, 0, 1);
    }
    .border-top-right {
      position: absolute;
      top: 1vh;
      right: 1.2vw;
      width: 0.55vw;
      height: 0.55vw;
      border: 1px solid rgba(0, 0, 0, 1);
      border-radius: 50%;
      text-align: start;
      font-size: 0.7vw;
      color: rgba(255, 255, 255, 1);
      background-color: rgba(0, 0, 0, 1);
      &::before {
        content: '';
        width: 10vw;
        height: 0.1vw;
        border: none;
        position: absolute;
        top: 0.3vh;
        right: -2vw;
        background-color: rgba(0, 0, 0, 1);
      }
      &::after {
        content: '';
        width: 0.2vh;
        height: 10vh;
        border: none;
        position: absolute;
        top: -1vh;
        right: 0.13vw;
        background-color: rgba(0, 0, 0, 1);
      }
    }
    &-items {
      height: 100%;
      padding-left: 2%;
      overflow: scroll;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        display: none;
      }
      &-item {
        width: 100%;
        height: 15%;
        display: flex;
        justify-content: start;
        align-items: center;
        span {
          width: 50%;
          font-size: 0.8vw;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .border-bottom-left {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 25%;
      height: 1.8vh;
      border-radius: 10px 10px 0 10px;
      padding-left: 0.5vw;
      text-align: start;
      font-size: 0.7vw;
      color: rgba(255, 255, 255, 1);
      background-color: rgba(0, 0, 0, 1);
      &::after {
        content: '';
        width: 3vw;
        height: 0.2vh;
        border: none;
        position: absolute;
        bottom: 0;
        left: 4.5vw;
        background-color: rgba(0, 0, 0, 1);
      }
    }
    .border-bottom-right {
      position: absolute;
      bottom: 0;
      right: 0.8vw;
      width: 10vw;
      height: 22vh;
      border-right: 2px solid rgba(0, 0, 0, 1);
      border-bottom: 2px solid rgba(0, 0, 0, 1);
      background-color: transparent;
      &::before {
        content: '';
        width: 2.5vw;
        height: 0.2vh;
        border: none;
        position: absolute;
        bottom: -0.2vh;
        left: -3.6vw;
        background-color: rgba(0, 0, 0, 1);
      }
      &::after {
        content: '';
        width: 0.2vh;
        height: 8vh;
        border: none;
        position: absolute;
        bottom: 3vh;
        right: 0.6vw;
        background-color: rgba(0, 0, 0, 1);
      }
    }
  }
</style>