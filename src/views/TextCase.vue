<script setup>
  import { ref, onBeforeMount } from 'vue';
  import { storeToRefs } from "pinia";
  import { useRouter, onBeforeRouteLeave } from 'vue-router';
  import { useDbStore } from '../store/dbStore';
  import { useOtherStore } from '../store/otherStore';
  import Sidebar from '../components/Sidebar.vue';
  import AddUploadInf from '../components/AddUploadInf.vue';
  import RightClickBox from '../components/RightClickBox.vue';
  import SearchShowBox from '../components/SearchShowBox.vue';

  const router = useRouter();
  const dbStore = useDbStore();
  const otherStore = useOtherStore();
  const {
    addTextName, addAuthor, addDescription, searchShow,
  } = storeToRefs(otherStore);
  const allFileBasicInf = ref('');
  const pitchIndex = ref(null);
  const isCollect = ref(true);
  const fileName = ref('');
  const contextMenuTop = ref(0);
  const contextMenuLeft = ref(0);
  const showRightClickBox = ref(false);

  const handelClick = (currentFileKey, collectStatus, textName, index) => {
    dbStore.fileKey = currentFileKey;
    pitchIndex.value = index;
    isCollect.value = collectStatus;
    fileName.value = textName;
  }

  const getBasicData = () => {
    windowApi.getAllFileBasicInf()
    .then(result => {
      allFileBasicInf.value = result;

      allFileBasicInf.value.forEach(jsonData => {
        Object.keys(jsonData).forEach(key => {
          if (jsonData[key] === null) {
            jsonData[key] = '---';
          }
        });
      })
    })
  }

  const getTextContent = (fileKey) => {
    dbStore.fileKey = fileKey;
    router.push('/textInformation/textRead');
  }

  const handleRightClick = (event, fileKey, collectState, textName, index) => {
    dbStore.fileKey = fileKey;
    pitchIndex.value = index;
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

  onBeforeMount(() => {
    getBasicData();
    windowApi.dbUpdateMonitor(getBasicData);
  })
  onBeforeRouteLeave(() => {
    windowApi.removeAllDbUpdateMonitor();
  });
</script>

<template>
  <div class="container">
    <div class="parting-line"></div>
    <div class="textCase">
      <div class="textCase-main">

        <div class="titel">
          <div class="titel-1">
            <span class="titel-name">Name</span>
            <span class="titel-author">Author</span>
          </div>
          <div class="titel-2">
            <span class="titel-recent">Upload</span>
            <span class="titel-state"></span>
          </div>
        </div>

        <li class="textColumn"
          @click="handelClick(data.fileKey, data.isCollect, data.fileName, index)"
          @dblclick="getTextContent(data.fileKey)"
          @contextmenu="($event) => handleRightClick($event, data.fileKey, data.isCollect, data.fileName, index)"
          v-for="(data, index) in allFileBasicInf" :key="index"
          :style="{ backgroundColor: pitchIndex === index ? 'rgba(255, 255, 255, 0.5)' : 'rgba(193, 199, 248, 0.5)' }"
        >
          <svg class="pitch-svg" v-show="pitchIndex === index" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>
          <div class="textColumn-1">
            <span class="fileName">{{ data.fileName }}</span>
            <span class="author">{{ data.author }}</span>
          </div>
          <div class="textColumn-2">
            <span class="uploadDate">{{ data.uploadDate }}</span>
            <svg class="collect-svg" v-show="data.isCollect" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
            <span class="collect-status"></span>
          </div>
        </li>

        <div class="footnote"></div>
      </div>

      <div class="textCase-sidebar">
        <Sidebar></Sidebar>
      </div>

      <transition name="search-show">
        <div class="search-show-box" v-if="searchShow">
          <SearchShowBox></SearchShowBox>
        </div>
      </transition>

      <div class="addUploadInf" v-show="addAuthor || addDescription || addTextName">
        <AddUploadInf :fileName="fileName"></AddUploadInf>
      </div>

      <div v-show="showRightClickBox"
        class="right-click-box"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :style="{ top: `${contextMenuTop-5}px`, left: `${contextMenuLeft-5}px` }"
      >
        <RightClickBox :fileName="fileName" :isCollect="isCollect"></RightClickBox>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 76vw;
    height: 100%;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.3);
  }
  .parting-line {
    width: 80%;
    height: 3px;
    border: none;
    position: relative;
    margin: 10px 0 10px 20%;
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
  .textCase {
    width: 76vw;
    height: 100%;
    margin: 0 auto;
    padding: 0 1vw;
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    &-main {
      width: 65%;
      overflow: scroll;
      padding-left: 5px;
      &::-webkit-scrollbar {
        display: none;
      }
      .titel, .textColumn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-weight: 700;
        padding-left: 2.5vw;
      }
      .titel {
        width: 100%;
        height: 7vh;
        font-size: 1.3vw;
        color: rgba(0, 0, 0, 1);
      }
      .textColumn {
        height: 10vh;
        font-size: 1vw;
        border: 3px solid rgba(0, 0, 0, 0.3);
        border-left: none;
        border-top: none;
        border-radius: 10px;
        margin: 5px 0;
        position: relative;
        color: rgba(0, 0, 0, 1);
        background-color: rgba(193, 199, 248, 0.5);
        cursor: pointer;
        &:hover::after {
          width: calc(100% - 16px);
        }
        &:active {
          background-color: rgba(0, 0, 0, 0.55);
        }
        &::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 9px;
          width: 0;
          height: 5px;
          border: 2px solid black;
          border-right: none;
          border-left: none;
          background-color: rgba(0, 0, 0, 0.5);
          transition: width 0.3s ease;
        }
        .pitch-svg {
          width: 2.5vw;
          height: 2.5vh;
          position: absolute;
          top: 36%;
          left: 0.2vw;
          z-index: 1;
          fill: rgb(91, 144, 236);
        }
        .textColumn-1 {
          &::before {
            content: '';
            width: 0.8vw;
            height: 0.8vw;
            border: 1px solid rgba(0, 0, 0, 0.75);
            border-radius: 50%;
            position: absolute;
            top: 40%;
            left: 1vw;
            background-color: transparent;
          }
        }
        .textColumn-2 {
          position: relative;
          .collect-svg {
            width: 1.1vw;
            position: absolute;
            top: 40%;
            right: 0.5vw;
            z-index: 1;
            fill: rgb(117, 158, 241);  
          }
        }
      }
      .footnote {
        width: 100%;
        height: 1px;
        border: none;
        margin: 15vh 0;
        background: rgba(0, 0, 0, 0.1);
      }
    }
    .titel-1, .titel-2,
    .textColumn-1, .textColumn-2 {
      display: flex;
      align-items: center;
    }
    .titel-1, .textColumn-1 {
      width: 40%;
      .titel-name, .fileName {
        width: 60%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .titel-author, .author {
        width: 40%;
      }
    }
    .titel-2, .textColumn-2 {
      width: 30%;
      .titel-recent, .uploadDate {
        width: 65%;
      }
      .titel-state, .collect-status {
        width: 35%;
      }
    }
    &-sidebar {
      width: 30%;
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .search-show-box {
      width: 400px;
      height: 300px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 1);
      animation: enter-leave 0.3s ease forwards;
      @keyframes enter-leave {
        0% {width: 0; height: 0; }
        50% {width: 400px; height: 0; }
        100% {width: 400px; height: 300px;}
      }
    }
    .addUploadInf {
      width: 300px;
      height: 150px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
    }
    .right-click-box {
      position: fixed;
      width: 100px;
      height: auto;
      z-index: 5;
    }
  }
  .search-show-enter-from {
    opacity: 0.5;
  }
  .search-show-enter-active {
    transition: all 0.5s ease;
  }
  .search-show-enter-to {
    opacity: 1;
  }
  .search-show-leave-from {
    opacity: 1;
  }
  .search-show-leave-active {
    transition: all 0.5s ease;
  }
  .search-show-leave-to {
    opacity: 0;
  }
  .fade-leave-from {
    transform: scale(1);
    opacity: 1;
  }
  .fade-leave-active {
    transition: all 0.5s ease;
  }
  .fade-leave-to {
    transform: scale(0);
    opacity: 0;
  }
</style>
