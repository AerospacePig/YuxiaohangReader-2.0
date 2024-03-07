<script setup>
  import { ref, onBeforeMount } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  
  const totalUploadCount = ref('');
  const totalCreateCount = ref('');
  const allCollectCount = ref('');
  const allTextTotalReadTime = ref('');

  const getStatisticsData = () => {
    windowApi.getTotalUploadCount()
    .then(result => {
      totalUploadCount.value = result;
    })

    windowApi.getTotalCreateCount()
    .then(result => {
      totalCreateCount.value = result;
    })

    windowApi.getAllCollect()
    .then(result => {
      allCollectCount.value = Object.values(result).length
    })

    windowApi.getAllTextTotalReadTime()
    .then(result => {
      allTextTotalReadTime.value = result;
    })
  }

  onBeforeMount(() => {
    getStatisticsData();
    windowApi.dbUpdateMonitor(getStatisticsData);
  })
  onBeforeRouteLeave(() => {
    windowApi.removeAllDbUpdateMonitor();
  });
</script>

<template>
  <div class="statistic">
    <div class="statistic-container">
      <div class="statistic-1">
        <li class="total-upload-count">总上传数:{{ totalUploadCount }}</li>
        <li class="total-creat-count">总创作数:{{ totalCreateCount }}</li>
      </div>
      <div class="statistic-2">
        <li class="total-collect-count">总收藏数:{{ allCollectCount }}</li>
        <li class="total-read-time">总时长:{{ allTextTotalReadTime }}分</li>
      </div>
    </div>
    <span></span>
  </div>
</template>

<style lang="scss" scoped>
  .statistic {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-left: 2.5vw;
    flex-direction: column;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
    &-container {
      width: 100%;
      .statistic-1, .statistic-2 {
        margin: 3vh 0;
        text-align: start;
        display: flex;
        align-items: center;
        li {
          font-size: 1vw;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.5);
          width: 50%;
        }
      }
    }
    span {
      width: 11vw;
      height: 5vh;
      position: absolute;
      bottom: 0;
      left: 1vw;
      border: 2px solid rgba(0, 0, 0, 1);
      border-top: none;
      border-right: none;
      &::before {
        content: '统计栏';
        width: 4vw;
        height: 1.5vh;
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 0.7vw;
        border-radius: 0 10px 0 0;
        background-color: rgba(0, 0, 0, 1);
        color: rgba(255, 255, 255, 1);
      }
      &::after {
        content: '';
        width: 6vw;
        height: 0.2vh;
        position: absolute;
        bottom: -0.2vh;
        right: -8vw;
        background-color: rgba(0, 0, 0, 1);
      }
    }
  }
</style>