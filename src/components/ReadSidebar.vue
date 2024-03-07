<script setup>
  import { ref, toRefs, onBeforeMount, onBeforeUnmount, defineProps } from 'vue';
  import { storeToRefs } from "pinia";
  import { useRouter } from 'vue-router';
  import { noticeOpen, dialogOpen } from '../utils/dialog';
  import { useReadStore } from '../store/readStore';
  import formatDate from '../utils/formatDate.js';
  import { useOtherStore } from '../store/otherStore'

  const currentTime = ref(null);
  const isBackgroundSpread = ref(true);
  const isFontSpread = ref(true);
  const isColorSpread = ref(true);
  const isNight = ref(true);
  const otherStore = useOtherStore()
  const readStore = useReadStore();
  const props = defineProps({
    progress: Number,
    pagesCount: Number,
    currentPageIndex: Number,
    wordCount: Number,
  });
  const {
    currentChapterName, fontColor, fontFamily, backgroundColor,
  } = storeToRefs(readStore);
  const { progress, pagesCount, currentPageIndex } = toRefs(props);
  const router = useRouter()
  const isTextRead = () => {
    return router.currentRoute.value.name === 'textRead' ? true : false;
  }
  const isWriteText = () => {
    return router.currentRoute.value.name === 'writeText' ? true : false;
  }

  const fontFamilies = ['font1', 'font2', 'font3', 'font4', 'font5', 'font6', 'font7', ];
  const colorNames = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10', 'color11', 'color12', 'color13', 'color14',];
  const colors = ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 1)',];

  const backgroundSpread = () => {
    isBackgroundSpread.value = !isBackgroundSpread.value
  }

  const fontSpread = () => {
    isFontSpread.value = !isFontSpread.value
  }

  const colorSpread = () => {
    isColorSpread.value = !isColorSpread.value
  }

  const backCover = () => {
    otherStore.coverDisplay = true;
  }

  const setFontFamily = () => {
    dialogOpen.alert('通告', '不想去找字体资源了, 就这么着吧...呼~ 躺了躺了~');
  }

  const setFontColor = (index) => {
    const i = colors.indexOf(backgroundColor.value)
    if ((index <= 6 && i >= 7) || (i <= 6 && index >= 7)) {
      fontColor.value = colors[index];
      noticeOpen(`已应用${colorNames[index]}`, 1);
    } else {
      dialogOpen.alert('警告', '当前所选字体颜色与背景颜色冲突, 禁止选择! 建议重新选择与背景颜色相对的字体颜色.');
    }
  }

  const setBackgroundColor = (index) => {
    const i = colors.indexOf(fontColor.value)
    if ((index <= 6 && i >= 7) || (i <= 6 && index >= 7)) {
      backgroundColor.value = colors[index];
      noticeOpen(`已应用${colorNames[index]}`, 1);
    } else {
      dialogOpen.alert('警告', '当前所选背景颜色与字体颜色冲突, 禁止选择! 建议重新选择与字体颜色相对的背景颜色.');
    }
  }

  const checkConflict = (index, compare) => {
    const i = colors.indexOf(compare);
    return (index <= 6 && i >= 7) || (i <= 6 && index >= 7) ? false : true;
  }

  const fontColorExplain = () => {
    dialogOpen.alert('说明', "秉承实用性原则, 对于字体颜色, 目前只提供'黑白灰'系列色.");
  }

  const backgroundColorExplain = () => {
    dialogOpen.alert('说明', "秉承实用性原则, 对于背景颜色, 目前只提供'黑白灰'系列色; 另外, 如果想要关闭或者替换背景图片, 可前往设置主页面选择关闭或替换.");
  }

  const dayNightExchange = () => {
    isNight.value = !isNight.value;
    [fontColor.value, backgroundColor.value] = [backgroundColor.value, fontColor.value]
  }

  const timingTime = setInterval(() => {
    currentTime.value = formatDate(new Date).split('/')[1];
  }, 1000);

  onBeforeMount(() => {
    timingTime;
  });

  onBeforeUnmount(() => {
    clearInterval(timingTime);
  });
</script>

<template>
  <div class="read-sidebar">
    <div class="page-header" v-if="isTextRead()">
      <p class="page-count">{{ currentPageIndex + 1 }}{{ ` / ${pagesCount}` }}</p>
      <p class="chapter-name">{{ currentChapterName }}</p>
    </div>
    <div class="spyproof" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z"></path></svg>
      <button @click="backCover">防窥隐匿</button>
    </div>

    <div class="font-family-setting">
      <div class="titel">字体选择</div>
      <svg class="spread" @click="fontSpread" :class="{ 'ico-rotate-180': !isFontSpread }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"></path></svg>
      <div class="select">
        <transition name="select" appear>
          <section v-show="isFontSpread" class="font-select">
            <div @click="setFontFamily" v-for="(data, index) in fontFamilies" :key="index">
              <option>{{ data }}</option>
              <svg class="conflict" v-show="checkConflict(index, fontColor)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></svg>
            </div>
          </section>
        </transition>
      </div>
    </div>

    <div class="background-setting" :style="{ top: isFontSpread ? '28vh' : '11vh' }">
      <div class="titel" @click="backgroundColorExplain">背景颜色</div>
      <svg class="spread" @click="backgroundSpread" :class="{ 'ico-rotate-180': !isBackgroundSpread }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"></path></svg>
      <div class="select">
        <transition name="select" appear>
          <section v-show="isBackgroundSpread" class="background-select">
            <div class="item" @click="setBackgroundColor(index)" v-for="(data, index) in colorNames" :key="index">
              <option class="color-option" :style="{ background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0) 50%, ${colors[index]} 75%, rgba(255, 255, 255, 0) 100%)` }">{{ data }}</option>
              <svg class="conflict" v-show="checkConflict(index, fontColor)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></svg>
            </div>
          </section>
        </transition>
      </div>
    </div>

    <div class="font-color-setting" :style="{ top: isFontSpread && isBackgroundSpread ? '51vh' : isBackgroundSpread || isFontSpread ? '34vh' : '17vh' }">
      <div class="titel" @click="fontColorExplain">字体颜色</div>
      <svg class="spread" @click="colorSpread" :class="{ 'ico-rotate-180': !isColorSpread }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z"></path></svg>
      <div class="select">
        <transition name="select" appear>
          <section v-show="isColorSpread" class="color-select">
            <div class="item" @click="setFontColor(index)" v-for="(data, index) in colorNames" :key="index">
              <option class="color-option" :style="{ background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0) 50%, ${colors[index]} 75%, rgba(255, 255, 255, 0) 100%)` }">{{ data }}</option>
              <svg class="conflict" v-show="checkConflict(index, backgroundColor)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"></path></svg>
            </div>
          </section>
        </transition>
      </div>
    </div>
    
    <div @click="dayNightExchange" class="day-night-exchange">
      <svg class="day" v-if="isNight" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"></path></svg>
      <svg class="night" v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 114.6 114.6 0 256 0c33 0 64.6 6.3 93.6 17.7c7.4 2.9 11.5 10.7 9.8 18.4s-8.8 13-16.7 12.4c-4.8-.3-9.7-.5-14.6-.5c-114.9 0-208 93.1-208 208s93.1 208 208 208c4.9 0 9.8-.2 14.6-.5c7.9-.5 15 4.7 16.7 12.4s-2.4 15.5-9.8 18.4C320.6 505.7 289 512 256 512C114.6 512 0 397.4 0 256zM375.4 137.4c3.5-7.1 13.7-7.1 17.2 0l31.5 63.8c1.4 2.8 4.1 4.8 7.2 5.3l70.4 10.2c7.9 1.1 11 10.8 5.3 16.4l-50.9 49.6c-2.3 2.2-3.3 5.4-2.8 8.5l12 70.1c1.3 7.8-6.9 13.8-13.9 10.1l-63-33.1c-2.8-1.5-6.1-1.5-8.9 0l-63 33.1c-7 3.7-15.3-2.3-13.9-10.1l12-70.1c.5-3.1-.5-6.3-2.8-8.5L261 233.1c-5.7-5.6-2.6-15.2 5.3-16.4l70.4-10.2c3.1-.5 5.8-2.4 7.2-5.3l31.5-63.8z"></path></svg>
    </div>

    <div class="page-footer">
      <p v-show="isTextRead()">{{ (progress * 100).toFixed(2) }}%</p>
      <p v-show="isWriteText()">{{ `WordCount: ${props.wordCount}` }}</p>
      <p>{{ currentTime }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  p {
    font-size: 1vw;
    color: rgba(0, 0, 0, 0.7);
    margin: 0;
  }
  .titel {
    width: 13vw;
    height: 15%;
    font-size: 1vw;
    font-weight: 700;
    text-align: start;
    padding: 0.3vh 0 0 0.5vw;
    border: none;
    outline: none;
    color: rgba(0, 0, 0, 0.5);
    background-color: rgba(205, 213, 249, 1);
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 1;
    }
  }
  .select {
    height: 85%;
    overflow: hidden;
    section {
      height: 100%;
      overflow: hidden scroll;
      .item {
        position: relative;
        option {
          font-size: 1vw;
          border-bottom: 1px solid rgba(0, 0, 0, 0.3);
          background-color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          &:hover {
            background-color: rgba(0, 0, 0, 0.2);
          }
          &:active {
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
        .conflict {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 2vw;
          height: 2vh;
          fill: rgba(89, 119, 253, 1);
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .spread {
    position: absolute;
    top: 0.5vh;
    right: 0;
    width: 2vw;
    height: 2vh;
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

  .read-sidebar {
    width: 100%;
    height: 100%;
    position: relative;
    .page-header {
      width: 13vw;
      display: flex;
      justify-content: space-around;
      align-items: end;
      position: absolute;
      top: 0;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
      .chapter-name {
        width: 7vw;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .spyproof {
      position: relative;
      button {
        width: 7vw;
        height: 3.5vh;
        font-size: 0.9vw;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.6);
        border: none;
        border-radius: 5px;
        outline: none;
        padding-right: 2.5vw;
        white-space: nowrap;
        background-color: rgba(255, 255, 255, 0.5);
        &:hover {
          background-color: rgba(0, 0, 0, 0.1)
        }
        &:active {
          background-color: rgba(0, 0, 0, 0.15)
        }
      }
      svg {
        position: absolute;
        top: 0.5vh;
        right: 3.5vw;
        width: 1.5vw;
        height: 1.5vw;
        fill: rgba(0, 0, 0, 0.4);
      }
    }
    .background-setting {
      width: 13vw;
      height: 20vh;
      position: absolute;
      top: 28vh;
      transition: top 0.2s ease;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
      .color-option {
        padding-right: 7vw;
        margin: 0.5vw 0;
      }
    }
    .font-family-setting {
      width: 13vw;
      height: 20vh;
      position: absolute;
      top: 5vh;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
    }
    .font-color-setting {
      width: 13vw;
      height: 20vh;
      position: absolute;
      top: 51vh;
      transition: top 0.2s ease;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
      .color-option {
        padding-right: 7vw;
        margin: 0.5vw 0;
      }
    }
    .day-night-exchange {
      position: absolute;
      bottom: 4.5vh;
      right: -1.5vw;
      width: 2vw;
      height: 3.5vh;
      margin-right: 5vw;
      padding-bottom: 0.3vh;
      border: none;
      border-radius: 5px;
      outline: none;
      margin: 0 2.5vw 0 1vw;
      white-space: nowrap;
      background-color: rgba(176, 188, 247, 1);
      box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.6), -1px -1px 4px 1px rgba(255, 255, 255, 1);
      .day, .night {
        position: absolute;
        top: 0.5vh;
        right: -0.25vw;
        width: 2.5vw;
        height: 2.5vh;
        fill: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        &:hover {
          fill: rgba(0, 0, 0, 0.6);
        }
        &:active {
          fill: rgba(0, 0, 0, 0.8);
        }
      }
    }
    .page-footer {
      width: 13vw;
      display: flex;
      justify-content: space-around;
      position: absolute;
      bottom: 0;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
    }
  }
  .select-enter-from {
    transform: translateY(-100%);
  }
  .select-enter-active {
    transition: all 0.2s ease;
  }
  .select-enter-to {
    transform: translateY(0);
  }
  .select-leave-from {
    transform: translateY(0);
  }
  .select-leave-active {
    transition: all 0.2s ease;
  }
  .select-leave-to {
    transform: translateY(-100%);
  }
</style>