<script setup>
  import { ref, watch, onBeforeMount, onMounted } from 'vue';
  import { storeToRefs } from "pinia";
  import { onBeforeRouteLeave } from 'vue-router';
  import { useReadStore } from '../store/readStore';
  import Catalog from '../components/Catalog.vue';
  import { useDbStore } from '../store/dbStore';
  import { noticeOpen } from '../utils/dialog';
  import formatDate from '../utils/formatDate.js';
  import ReadSidebar from '../components/ReadSidebar.vue';
  import ReadSettingsBar from '../components/ReadSettingsBar.vue';

  const dbStore = useDbStore()
  const readStore = useReadStore()
  const progress = ref(0);
  const textarea = ref(null);
  const currentContent = ref('');
  const currentPageIndex = ref(0);
  const currentScrollBottom = ref(666)
  const {
    readSpread, isBarSpread, isCatalogSpread, isStatusSidebar, currentChapterId, skipChapterId,
    fontSize, letterSpacing, lineHeight, fontColor, backgroundColor, fontFamily, readBackground,
  } = storeToRefs(readStore)
  let chaptersCount = 0;
  let pagesWordArray = [];
  let eachChapterWordCount = [];
  let pagesContentArray = [];

  const getChapter = (chapterId) => {
    return windowApi.getChapterContent(chapterId, dbStore.fileKey)
  }

  const makePagesWordArray = () => {
    pagesContentArray.forEach(pageContent => {
      pagesWordArray.push(pageContent.length)
    })
    return pagesWordArray;
  }

  const previousPage = () => {
    if (currentPageIndex.value > 0) {
      currentContent.value = pagesContentArray[currentPageIndex.value -= 1]
    } else if (currentChapterId.value > 1) {
      getChapter(currentChapterId.value -= 1)
      .then(result => {
        pagesContentArray = result
        makePagesWordArray();
        currentPageIndex.value = pagesContentArray.length - 1;
        currentContent.value = pagesContentArray[currentPageIndex.value]
      })
    } else {
      noticeOpen('已经是第一页')
    }
  }

  const nextPage = () => {
    if (currentPageIndex.value < pagesContentArray.length - 1) {
      currentContent.value = pagesContentArray[currentPageIndex.value += 1]
    } else if (currentChapterId.value < chaptersCount) {
      getChapter(currentChapterId.value += 1)
      .then(result => {
        pagesContentArray = result
        makePagesWordArray();
        currentPageIndex.value = 0;
        currentContent.value = pagesContentArray[currentPageIndex.value]
      })
    } else {
      noticeOpen('已经是最后一页')
    }
  }

  const catalogLink = () => {
    getChapter(skipChapterId.value)
    .then(result => {
      pagesContentArray = result;
      makePagesWordArray();
      currentPageIndex.value = 0;
      currentContent.value = pagesContentArray[currentPageIndex.value]
    })
  }

  const progressUpdate = () => {
    let readWord = 0; // 已读字数
    let totalWordCount = 0;
    eachChapterWordCount.forEach(wordCound => {
      totalWordCount += wordCound;
    })

    for (let i = 0; i < (currentChapterId.value-1); i++) {
      readWord += eachChapterWordCount[i];
    }
    for (let i = 0; i <= currentPageIndex.value; i++) {
      readWord += pagesWordArray[i];
    }

    progress.value = parseFloat((readWord / totalWordCount).toFixed(4));
  }

  const settingsBarSpread = () => {
    isBarSpread.value = !isBarSpread.value;
    isCatalogSpread.value = isBarSpread.value;
    isStatusSidebar.value = isBarSpread.value;
  }

  watch(currentContent, () => {
    progressUpdate();

    if (textarea.value) {
      textarea.value.scrollTop = 0;
    }
  });

  watch(skipChapterId, () => {
    catalogLink();
  })

  const handleScroll = () => { // 总高度, 距顶部距离, 可见高度
    currentScrollBottom.value = textarea.value.scrollHeight - textarea.value.scrollTop - textarea.value.clientHeight;
  }

  onBeforeMount(() => {
    windowApi.getReadMemory(dbStore.fileKey)
    .then(result => {
      currentPageIndex.value = result.lastReadPage - 1
      currentChapterId.value = result.lastReadChapter
      eachChapterWordCount = result.eachChapterWordCount
      chaptersCount = eachChapterWordCount.length

      getChapter(currentChapterId.value)
      .then(result => {
        pagesContentArray = result
        makePagesWordArray();
        currentContent.value = pagesContentArray[currentPageIndex.value]
      })
    })

    if (readSpread.value) {
      isBarSpread.value = true;
      isCatalogSpread.value = true;
      isStatusSidebar.value = true;
    } else {
      isBarSpread.value = false;
      isCatalogSpread.value = false;
      isStatusSidebar.value = false;
    }
  })

  onMounted(() => {
    handleScroll();
  })

  onBeforeRouteLeave(() => {
    const endReadTime = new Date;
    const thisReadTime = (endReadTime.getTime() - readStore.startReadTime.getTime()) / (1000 * 60); // 分钟
  
    windowApi.getTextTotalReadTime(dbStore.fileKey)
    .then(totalReadTime => {
      totalReadTime = parseFloat((totalReadTime + thisReadTime).toFixed(2));
      const lastReadTime = formatDate(endReadTime);

      const targetKeyArray = ['lastReadPage', 'lastReadChapter', 'lastReadTime', 'totalReadTime', 'readProgress',]
      const newValueArray = [(currentPageIndex.value+1), currentChapterId.value, lastReadTime, totalReadTime, progress.value,]

      windowApi.useUpdater(dbStore.fileKey, targetKeyArray, newValueArray)
      .then(isSucceed => {
        if (! isSucceed) noticeOpen('最新阅读数据上传失败!');
      })
    })
  })
</script>

<template>
  <div class="text-read">
    <transition name="fade" appear>
      <div v-show="isBarSpread" class="read-settings-bar">
        <ReadSettingsBar></ReadSettingsBar>
      </div>
    </transition>

    <svg @click="settingsBarSpread" :class="{ 'ico-rotate-180': !isBarSpread }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
    
    <transition name="catalog" appear>
      <div v-show="isCatalogSpread" class="catalog">
        <Catalog></Catalog>
      </div>
    </transition>

    <hr v-show="! isBarSpread"/>

    <main :style="{ bottom: !isBarSpread ? '-1vh' : '-6vh' }">
      <textarea
        v-model="currentContent"
        ref="textarea"
        @scroll="handleScroll"
        :style="{ height: isBarSpread ? '78vh' : '83vh', fontSize: `${fontSize}px`, letterSpacing: `${letterSpacing}px`, lineHeight: `${lineHeight}`, color: `${fontColor}`, backgroundColor: `${backgroundColor}`, fontFamily: `${fontFamily}` }"
        class="text-content"
        readonly
      ></textarea>
      <div class="footContainer"><!--随页面同步滚动-->
        <div :style="{ transform: `translateY(${currentScrollBottom}px)` }">
          <button @click="previousPage">上一页</button>
          <button @click="nextPage">下一页</button>
        </div>
      </div>
    </main>

    <transition name="sidebar" appear>
      <div v-show="isStatusSidebar" class="right-sidebar">
        <ReadSidebar :progress="progress" :pagesCount="pagesContentArray.length" :currentPageIndex="currentPageIndex"></ReadSidebar>
      </div>
    </transition>

    <div v-show="readBackground" :key="readBackground" class="read-background" :style="{ backgroundImage: `url(${readBackground})` }"></div>
  </div>
</template>
<style lang="scss" scoped>
  .text-read {
    width: 76vw;
    height: 100%;
    margin: 0 auto;
    border: none;
    overflow: hidden;
    position: relative;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    border-bottom: 4px solid rgba(0, 0, 0, 0.3);
    .read-settings-bar {
      width: 100%;
      height: 6vh;
    }
    svg {
      width: 3vw;
      height: 3vh;
      position: absolute;
      top: 1.5vh;
      right: 0;
      fill: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      &:hover {
        fill: rgba(0, 0, 0, 0.6);
      }
      &:active {
        fill: rgba(0, 0, 0, 0.8);
      }
    }
    .ico-rotate-180 {
      transform: rotate(180deg);
      transform-origin: center center;
    }
    .catalog {
      width: 13vw;
      height: 90%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    hr {
      position: absolute;
      top: 0;
      right: 0;
      height: 1vh;
      border: none;
      margin: 0;
      background-color: rgba(0, 0, 0, 0.2);
      animation: extend 0.3s 0.5s forwards;
      @keyframes extend {
        from {width: 0;}
        to {width: 100%;}
      }
    }
    main {
      width: 50vw;
      height: 100%;
      position: absolute;
      bottom: 0;
      left: 13vw;
      transition: bottom 0.5s;
      .text-content {
        width: 100%;
        height: 78vh;
        resize: none;
        margin: 0 auto;
        outline: none;
        padding: 2vw;
        background-color: rgba(255, 255, 255, 0.6); 
        border-color: rgba(0, 0, 0, 0.2);
        transition: height 0.5s;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .footContainer {
        width: 100%;
        height: 4.8vh;
        background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 20%, rgba(255, 255, 255, 0) 50%, rgba(193, 199, 248, 1) 80%, rgba(255, 255, 255, 0) 100%);
        button {
          width: 4vw;
          height: 3.5vh;
          font-size: 1vw;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 5px;
          outline: none;
          margin: 0.5vh 2vw;
          white-space: nowrap;
          background-color: rgba(176, 188, 247, 1);
          box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.6), -1px -1px 4px 1px rgba(255, 255, 255, 1);
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
          &:active {
            background-color: rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
    .right-sidebar {
      width: 13vw;
      height: 90%;
      position: absolute;
      bottom: 0;
      right: 0;
      margin-bottom: 1vh;
    }
    .read-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.8;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      background-origin: content-box;
    }
  }
  .fade-enter-from {
    opacity: 0;
    transform: translateY(-100%);
  }
  .fade-enter-active {
    transition: all 0.5s ease;
  }
  .fade-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-leave-active {
    transition: all 0.5s ease;
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
  .catalog-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }
  .catalog-enter-active {
    transition: all 0.5s ease;
  }
  .catalog-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .catalog-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .catalog-leave-active {
    transition: all 0.5s ease;
  }
  .catalog-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
  .sidebar-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  .sidebar-enter-active {
    transition: all 0.5s ease;
  }
  .sidebar-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .sidebar-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .sidebar-leave-active {
    transition: all 0.5s ease;
  }
  .sidebar-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
