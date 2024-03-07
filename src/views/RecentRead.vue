<script setup>
  import { ref, onMounted } from 'vue';
  import { useDbStore } from '../store/dbStore';
  import { useRouter, onBeforeRouteLeave } from 'vue-router';
  import PersonalInf from '../components/PersonalInf.vue';
  import RightClickBox from '../components/RightClickBox.vue';

  const router = useRouter()
  const dbStore = useDbStore()
  const isCollect = ref(true);
  const fileName = ref('');
  const recentReadInf = ref('')
  const contextMenuTop = ref(0);
  const contextMenuLeft = ref(0);
  const recentReadBackground = ref('')
  const showRightClickBox = ref(false);

  recentReadBackground.value = 'src/assets/img/recentReadBackground.jpg'
  const getFileKey = (currentFileKey) =>  dbStore.fileKey = currentFileKey

  const getBasicData = () => {
    windowApi.getRecentRead()
    .then(result => {
      recentReadInf.value = result
    })
  }

  const handleRightClick = (event, fileKey, collectState, textName) => {
    dbStore.fileKey = fileKey;
    isCollect.value = collectState;
    fileName.value = textName;

    event.preventDefault();
    contextMenuLeft.value = event.clientX;
    contextMenuTop.value = event.clientY;
    showRightClickBox.value = true;
  }

  const handleMouseEnter = () => {
    showRightClickBox.value = true;
  }

  const handleMouseLeave = () => {
    showRightClickBox.value = false;
  }

  const getTextContent = () => {
    router.push('/textInformation/textRead');
  }

  onMounted(() => {
    getBasicData();
    windowApi.dbUpdateMonitor(getBasicData);
  })
  onBeforeRouteLeave(() => {
    getBasicData();
    windowApi.removeAllDbUpdateMonitor();
  });
</script>

<template>
  <div class="recent-read">
    <div class="parting-line"></div>
    <div class="recent-read-title">
      <div :key="recentReadBackground" class="recent-read-background" :style="{ backgroundImage: `url(${recentReadBackground})` }"></div>
      <div class="personal-inf">
        <PersonalInf></PersonalInf>
      </div>
      <!-- <div class="read-time-chart">
        <Chart></Chart>
      </div> -->
    </div>

    <div class="items">
      <div class="recent-read-items">
        <div
          class="recent-read-items-item"
          @click="getFileKey(data.fileKey)"
          @dblclick="getTextContent()"
          v-for="(data, index) in recentReadInf"
          :key="index"
          @contextmenu="($event) => handleRightClick($event, data.fileKey, data.isCollect, data.fileName)"
        >
          <svg class="collect-svg" v-show="data.isCollect" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
          <span class="fileName">{{ data.fileName }}</span>
          <span class="lastReadTime">{{ data.lastReadTime }}</span>
          <span class="border-left-top"></span>
          <span class="border-right-top"></span>
          <span class="border-left-bottom"></span>
          <span class="border-right-bottom"></span>
        </div>
        <svg class="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M352 0c53 0 96 43 96 96V416c0 53-43 96-96 96H64 32c-17.7 0-32-14.3-32-32s14.3-32 32-32V384c-17.7 0-32-14.3-32-32V32C0 14.3 14.3 0 32 0H64 352zm0 384H96v64H352c17.7 0 32-14.3 32-32s-14.3-32-32-32zM138.7 208l13.9 24H124.9l13.9-24zm-13.9-24L97.1 232c-6.2 10.7 1.5 24 13.9 24h55.4l27.7 48c6.2 10.7 21.6 10.7 27.7 0l27.7-48H305c12.3 0 20-13.3 13.9-24l-27.7-48 27.7-48c6.2-10.7-1.5-24-13.9-24H249.6L221.9 64c-6.2-10.7-21.6-10.7-27.7 0l-27.7 48H111c-12.3 0-20 13.3-13.9 24l27.7 48zm27.7 0l27.7-48h55.4l27.7 48-27.7 48H180.3l-27.7-48zm0-48l-13.9 24-13.9-24h27.7zm41.6-24L208 88l13.9 24H194.1zm69.3 24h27.7l-13.9 24-13.9-24zm13.9 72l13.9 24H263.4l13.9-24zm-55.4 48L208 280l-13.9-24h27.7z"></path></svg>
      </div>
    </div>

    <div v-show="showRightClickBox"
      class="right-click-box"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :style="{ top: `${contextMenuTop-5}px`, left: `${contextMenuLeft-5}px` }"
    >
      <RightClickBox :fileName="fileName" :isCollect="isCollect"></RightClickBox>
    </div>

    <hr class="footnote"/>
  </div>
</template>

<style lang="scss" scoped>
  .recent-read {
    width: 76vw;
    height: 100%;
    margin: 0 auto;
    position: relative;
    background-color: rgba(255, 255, 255, 0.4);
    .parting-line {
      width: 80%;
      height: 3px;
      border: none;
      margin: 10px 0 10px 20%;
      position: relative;
      background-color: rgba(0, 0, 0, 0.5);
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -25%;
        width: 20%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      &::after {
        content: '';
        position: absolute;
        top: -0.3vh;
        left: -3%;
        height: 1vh;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    &-title {
      width: 100%;
      height: 30%;
      position: relative;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      .recent-read-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0.8;
        border-radius: 20px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-origin: content-box;
      }
      .personal-inf {
        width: 25%;
        height: 30%;
        position: absolute;
        bottom: 5%;
        left: 0;
      }
      /*
      .read-time-chart {
        width: 60%;
        position: relative;
        height: 100%;
        z-index: 1;
        margin-left: auto;
      }
      */
    }
    .items {
      width: 100%;
      height: 61%;
      padding: 0 1vw;
      .recent-read-items {
        height: 100%;
        position: relative;
        margin-top: 20px;
        overflow: scroll;
        text-align: start;
        background-color: rgba(193, 199, 248, 0.3);
        &::-webkit-scrollbar {
          display: none;
        }
        &-item {
          width: 6.5vw;
          height: 15vh;
          margin: 2.9vw;
          padding: 0;
          z-index: 1;
          display: inline-flex;
          flex-direction: column;
          text-align: center;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          background-color: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(0, 0, 0, 1);
          box-shadow: 5px 5px 6px 1px rgba(0, 0, 0, 0.5);
          cursor: pointer;
          &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
          &:active {
            background-color: rgba(0, 0, 0, 0.1);
          }
          .fileName {
            line-height: 12vh;
            width: 100%;
            height: 80%;
            font-size: 0.9vw;
            color: rgba(0, 0, 0, 0.7);
          }
          .lastReadTime {
            width: 100%;
            height: 20%;
            font-size: 0.7vw;
            position: relative;
            color: rgba(0, 0, 0, 0.7);
            &::before {
              content: '';
              position: absolute;
              top: 20%;
              left: 0.3vw;
              width: 1vw;
              height: 0.3vh;
              background-color: rgba(0, 0, 0, 0.5);
            }
            &::after {
              content: '';
              position: absolute;
              top: 20%;
              right: 0.3vw;
              width: 1vw;
              height: 0.3vh;
              background-color: rgba(0, 0, 0, 0.4);
            }
          }
          .border-left-top,
          .border-right-top,
          .border-left-bottom,
          .border-right-bottom {
            position: absolute;
            width: 30%;
            height: 30%;
            border: 4px solid rgba(0, 0, 0, 0.5);
          }
          $positionX: -13%;
          $positionY: -13%;
          .border-left-top {
            top: $positionY; 
            left: $positionX;
            border-right: none;
            border-bottom: none;
          }
          .border-right-top {
            position: absolute;
            top: $positionY;
            right: $positionX;
            border-left: none;
            border-bottom: none;
          }
          .border-left-bottom {
            bottom: $positionY;
            left: $positionX;
            border-top: none;
            border-right: none;
          }
          .border-right-bottom {
            bottom: $positionY;
            right: $positionX;
            border-left: none;
            border-top: none;
          }
          .collect-svg {
            width: 1.1vw;
            position: absolute;
            top: 0.2vw;
            right: 0.2vw;
            z-index: 1;
            fill: rgba(117, 158, 241, 0.6);
          }
        }
        .background-svg {
          position: absolute;
          top: 25%;
          left: 25%;
          z-index: 0;
          width: 50%;
          height: 50%;
          fill: rgba(0, 0, 0, 0.07);
        }
      }
    }
    .right-click-box {
      position: fixed;
      width: 100px;
      height: auto;
      z-index: 5;
    }
    .footnote {
      width: 100%;
      border: 3px solid rgba(193, 199, 248, 0.8);
    }
  }
</style>
