<script setup>
  import { ref, watch, onBeforeMount } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { storeToRefs } from "pinia";
  import { useDbStore } from '../store/dbStore';

  const dbStore = useDbStore()
  const { fileKey } = storeToRefs(dbStore)
  const detailInf = ref('')

  const getDetailInf = () => {
    windowApi.usePreciseMatcher(fileKey.value)
    .then(result => {
      detailInf.value = result

      detailInf.value.readProgress = detailInf.value.readProgress * 100

      Object.keys(detailInf.value).forEach(key => {
        if (detailInf.value[key] === null) {
          detailInf.value[key] = '---';
        }
      });
    })
  }

  watch(fileKey, () => getDetailInf())

  let monitorCount = 0;
  onBeforeMount(() => {
    monitorCount += 1;
    if (monitorCount <= 1) {
      windowApi.dbUpdateMonitor(getDetailInf);
    }
  })
  onBeforeRouteLeave(() => {
    windowApi.removeAllDbUpdateMonitor();
  });
</script>

<template>
  <div class="information-container">
    <div class="null-information" v-if="! detailInf">
      <img src="../assets/img/nullInformation.png" />
      <p>暂无文本信息</p>
    </div>

    <div class="have-information" v-else>
      <transition name="fade" appear>
        <div class="information" :key="detailInf">
          <div class="fileName-or-author">
            <p class="fileName">{{ detailInf.fileName }}</p>
            <p class="author">作者:{{ detailInf.author }}</p>
          </div>
          <div class="readProgress-or-size">
            <p>Progress&nbsp;&nbsp;{{ detailInf.readProgress.toFixed(2) }}%</p>
            <p>FileSize&nbsp;&nbsp;{{ detailInf.fileSize }}MB</p>
          </div>
          <div class="chapterCount-or-totalWordCount">
            <p>Chapter&nbsp;&nbsp;{{ detailInf.chapterCount }}章节</p>
            <p>Word&nbsp;&nbsp;{{ detailInf.totalWordCount }}</p>
          </div>
          <div class="about-date">
            <div class="lastReadTime">
              <p>RecentReadTime</p>
              <p>{{ detailInf.lastReadTime }}</p>
            </div>
            <div class="recentUpdateTime">
              <p>RecentUpdate</p>
              <p>{{ detailInf.recentUpdateTime }}</p>
            </div>
            <div class="totalReadTime">
              <p>TotalReadTime</p>
              <p>{{ detailInf.totalReadTime }}min</p>
            </div>
            <div class="uploadDate">
              <p>UploadDate</p>
              <p>{{ detailInf.uploadDate }}</p>
            </div>
          </div>
          <div class="description">
            <p>{{ detailInf.description }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  p, hr {
    margin: 0;
    display: inline-block;
  }
  .information-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
    .null-information {
      width: 100%;
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &::before {
        content: '';
        position: absolute;
        top: -15%;
        right: 5%;
        width: 50%;
        height: 50%;
        border: 2px solid rgba(0, 0, 0, 0.6);
        border-bottom: none;
        border-left: none;
      }
      &::after {
        content: '';
        position: absolute;
        bottom: -15%;
        left: 5%;
        width: 50%;
        height: 50%;
        border: 2px solid rgba(0, 0, 0, 0.6);
        border-top: none;
        border-right: none;
      }
      img {
        width: 60%;
        height: auto;
        margin: 5% auto;
        background-repeat: no-repeat;
        background-position: center center;
      }
      p {
        font-size: 1.3vw;
        font-weight: 700;
        color: black;
        margin: 0 auto;
      }
    }
    .have-information {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      border-radius: 0 20px 15px 0;
      .information {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        .fileName-or-author {
          width: 100%;
          height: 20%;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px 10px 0 0;
          color: rgba(0, 0, 0, 0.4);
          .fileName {
            font-size: 1.5vw;
            white-space: nowrap;
            padding: 3% 10% 0 10%;
            border-top: 2px solid rgba(0, 0, 0, 1);
            border-left: 2px solid rgba(0, 0, 0, 1);
            border-radius: 20px 0 20px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .author {
            font-size: 1vw;
            padding: 3% 10% 0 10%;
            white-space: nowrap;
            margin: 0 auto;
          }
        }

        $fontSize-1: 1.05vw;
        $fontWeight: 500;
        $color-1: rgba(0, 0, 0, 0.6);
        .readProgress-or-size {
          width: 100%;
          height: 10%;
          border-radius: 20px;
          font-size: $fontSize-1;
          color: $color-1;
          display: flex;
          font-weight: $fontWeight;
          position: relative;
          align-items: center;
          white-space: nowrap;
          background-color: rgba(255, 255, 255, 0.5);
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            width: 4px;
            height: 100%;
            border: none;
            background-color: rgba(0, 0, 0, 1);
          }
          p {
            width: 50%;
          }
        }

        $color-2: rgba(0, 0, 0, 0.6);
        .chapterCount-or-totalWordCount {
          width: 100%;
          height: 10%;
          display: flex;
          align-items: center;
          white-space: nowrap;
          position: relative;
          font-weight: 700;
          color: $color-2;
          font-size: 1vw;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            width: 4px;
            height: 100%;
            border: none;
            background-color: rgba(255, 255, 255, 1);
          }
          p {
            width: 50%;
          }
        }
        .about-date {
          width: 100%;
          height: 40%;
          .lastReadTime,
          .recentUpdateTime,
          .totalReadTime,
          .uploadDate {
            width: 100%;
            height: 25%;
            display: flex;
            align-items: center;
            font-weight: 700;

            white-space: nowrap;
            color: $color-2;
            font-size: 1vw;
          }
          .lastReadTime,
          .totalReadTime {
            color: $color-1;
            border-radius: 20px;
            font-weight: $fontWeight;
            font-size: $fontSize-1;
            background-color: rgba(255, 255, 255, 0.5);
          }
          p {
            width: 50%;
          }
        }
        .description {
          width: 100%;
          height: 19%;
          display: flex;
          padding: 0 1vw;
          font-weight: 700;
          font-size: 0.9vw;
          color: rgba(0, 0, 0, 0.8);
          border-right: 2px solid rgba(0, 0, 0, 1);
          border-bottom: 2px solid rgba(0, 0, 0, 1);
          border-radius: 18px 0 10px 0;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.5);
          &::after {
            content: '文本详情';
            width: 5vw;
            height: 1.5vh;
            position: absolute;
            bottom: 0.5vh;
            right: 0;
            font-size: 0.7vw;
            border-radius: 10px 0 0 0;
            background-color: rgba(0, 0, 0, 1);
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      .fade-enter-from {
        transform: translateX(-100%);
      }
      .fade-enter-active {
        transition: all 0.3s ease-out;
      }
      .fade-enter-to {
        transform: translateX(0);
      }
      .fade-leave-from {
        transform: translateX(0);
      }
      .fade-leave-active {
        transition: all 0.3s ease-out;
      }
      .fade-leave-to {
        transform: translateX(100%);
      }
    }
  }
</style>