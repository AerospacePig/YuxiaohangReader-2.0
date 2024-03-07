<script setup>
  import { onBeforeMount } from 'vue';
  import { storeToRefs } from "pinia";
  import { useRouter } from 'vue-router';
  import { noticeOpen } from '../utils/dialog';
  import { useReadStore } from '../store/readStore';

  const router = useRouter()
  const isTextRead = () => {
    return router.currentRoute.value.name === 'textRead' ? true : false;
  }
  const readStore = useReadStore()
  const {
    isCatalogSpread, isStatusSidebar, isOptionSidebar,
    fontSize, lineHeight, letterSpacing, defaultFontSize, defaultLineHeight, defaultFletterSpacing
  } = storeToRefs(readStore)

  const fontSizeUp = () => {
    if (fontSize.value >= 25) {
      noticeOpen('字号已设置为最大')
    } else {
      fontSize.value += 1;
    }
  }

  const fontSizeDown = () => {
    if (fontSize.value <= 10) {
      noticeOpen('字号已设置为最小')
    } else {
      fontSize.value -= 1;
    }
  }

  const letterSpacingUp = () => {
    if (letterSpacing.value >= 5) {
      noticeOpen('字间距已设置为最大')
    } else {
      letterSpacing.value += 1;
    }
  }

  const letterSpacingDown = () => {
    if (letterSpacing.value <= 0) {
      noticeOpen('字间距已设置为最小')
    } else {
      letterSpacing.value -= 1;
    }
  }

  const lineHeightUp = () => {
    if (lineHeight.value >= 3) {
      noticeOpen('行高已设置为最大')
    } else {
      lineHeight.value += 0.1;
    }
  }

  const lineHeightDown = () => {
    if (lineHeight.value <= 1.2) {
      noticeOpen('行高已设置为最小')
    } else {
      lineHeight.value -= 0.1;
    }
  }

  const sidebarSpread = () => {
    isCatalogSpread.value = !isCatalogSpread.value;
    isOptionSidebar.value = !isOptionSidebar.value;
  }

  const statusSidebar = () => {
    isStatusSidebar.value = !isStatusSidebar.value;
  }

  onBeforeMount(() => {
    fontSize.value = defaultFontSize.value;
    lineHeight.value = defaultLineHeight.value;
    letterSpacing.value = defaultFletterSpacing.value;
  })
</script>

<template>
  <div class="settings-bar">
    <button @click="sidebarSpread" class="sidebar-button">{{ isTextRead() ? '目录' : '选项' }}</button>
    <div>
      <button @click="fontSizeUp">字号+</button>
      <span class="current-font-size">{{ fontSize }}</span>
      <button @click="fontSizeDown">字号-</button>
      <button @click="letterSpacingUp">字距+</button>
      <span class="current-letter-spacin">{{ letterSpacing }}</span>
      <button @click="letterSpacingDown">字距-</button>
      <button @click="lineHeightUp">行高+</button>
      <span class="current-line-height">{{ lineHeight.toFixed(1) }}</span>
      <button @click="lineHeightDown">行高-</button>
    </div>
    <button @click="statusSidebar" class="onther-config">Other Config</button>
  </div>
</template>

<style scoped lang="scss">
  .settings-bar {
    width: 100%;
    height: 6vh;
    margin: 0 auto;
    align-items: center;
    border: 3px solid rgba(176, 185, 248, 1);
    border-left: none;
    border-right: none;
    border-radius: 10px;
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    button {
      width: 4vw;
      height: 3.5vh;
      font-size: 1vw;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 5px;
      outline: none;
      margin: 0 2.5vw 0 1vw;
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
    span {
      position: absolute;
      top: 1.8vh;
      font-size: 1.1vw;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.5);
    }
    .current-font-size {
      left: 21vw;
    }
    .current-letter-spacin {
      left: 36.5vw;
    }
    .current-line-height {
      left: 51vw;
    }
    .sidebar-button {
      margin-right: 8vw;
    }
    .onther-config {
      width: 8vw;
      margin-right: 5vw;
      padding: 0.3vw 0.2vw 0.1vw 0.2vw;
      font-size: 1vw;
    }
  }
</style>