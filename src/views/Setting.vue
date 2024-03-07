<script setup>
  import { onBeforeMount, ref } from 'vue';
  import { storeToRefs } from "pinia";
  import { onBeforeRouteLeave } from 'vue-router';
  import { initSettings } from '../utils/initApp';
  import { useOtherStore } from '../store/otherStore';
  import { useReadStore } from '../store/readStore';
  import { noticeOpen, dialogOpen } from "../utils/dialog";

  const otherStore = useOtherStore();
  const readStore = useReadStore();
  const {
    writeSpread, readSpread,
    fontSize, letterSpacing, lineHeight, fontColor, backgroundColor, fontFamily, readBackground,
  } = storeToRefs(readStore)
  const {
    isDispalyBackgroundImage
  } = storeToRefs(otherStore)
  const allSettings = ref({});

  const fontSizeUp = () => {
    if (fontSize.value >= 25) {
      noticeOpen('字号最大限制25')
    } else {
      fontSize.value += 1;
    }
  }

  const fontSizeDown = () => {
    if (fontSize.value <= 10) {
      noticeOpen('字号最小限制10')
    } else {
      fontSize.value -= 1;
    }
  }

  const letterSpacingUp = () => {
    if (letterSpacing.value >= 5) {
      noticeOpen('字距最大限制5')
    } else {
      letterSpacing.value += 1;
    }
  }

  const letterSpacingDown = () => {
    if (letterSpacing.value <= 0) {
      noticeOpen('字距最小限制0')
    } else {
      letterSpacing.value -= 1;
    }
  }

  const lineHeightUp = () => {
    if (lineHeight.value >= 3) {
      noticeOpen('行高最大限制3')
    } else {
      lineHeight.value += 0.1;
    }
  }

  const lineHeightDown = () => {
    if (lineHeight.value <= 1.2) {
      noticeOpen('行高最小限制1.2')
    } else {
      lineHeight.value -= 0.1;
    }
  }

  const readSpreadSetting = () => {
    if (readSpread.value) {
      readSpread.value = false;
      noticeOpen('已关闭', 1);
    } else {
      readSpread.value = true;
      noticeOpen('已启用', 1);
    }
  }

  const writeSpreadSetting = () => {
    if (writeSpread.value) {
      writeSpread.value = false;
      noticeOpen('已关闭', 1);
    } else {
      writeSpread.value = true;
      noticeOpen('已启用', 1);
    }
  }

  const useReadBackground = () => {
    if (readBackground.value) {
      readBackground.value = false;
      noticeOpen('已关闭', 1);
    } else {
      readBackground.value = 'src/assets/img/textReadBac.jpg';
      noticeOpen('已启用', 1);
    }
  }

  const backgroundSetting = () => {
    if (! isDispalyBackgroundImage.value)
      dialogOpen.select('背景设置', '确认启用自动切换的系列背景壁纸吗?', openBackgroundImage)
    else
      dialogOpen.select('背景设置', '确认关闭自动切换的系列背景壁纸吗?', closeBackgroundImage)
  }

  const openBackgroundImage = (flag) => {
    if (flag)
      isDispalyBackgroundImage.value = true
  }

  const closeBackgroundImage = (flag) => {
    if (flag)
      isDispalyBackgroundImage.value = false
  }

  const setAppSettings = () => {
    allSettings.value.textRead.fontSize = fontSize.value;
    allSettings.value.textRead.lineHeight = lineHeight.value;
    allSettings.value.textRead.letterSpacing = letterSpacing.value;
    allSettings.value.textRead.readBackground = readBackground.value;
    allSettings.value.other.readSpread = readSpread.value;
    allSettings.value.other.writeSpread = writeSpread.value;
    allSettings.value.other.isDispalyBackgroundImage = isDispalyBackgroundImage.value;
    windowApi.setSettings(JSON.stringify({
      ...allSettings.value,
    }))
  }

  const restoreDefaultSettings = () => {
    dialogOpen.select('警告', '确认恢复默认出厂设置吗?', (flag) => {
      if (flag) {
        windowApi.getSettings()
        .then(settings => {
          fontSize.value = settings.textRead.defaultFontSize;
          letterSpacing.value = settings.textRead.defaultletterSpacing;
          lineHeight.value = settings.textRead.defaultLineHeight;
          fontColor.value = settings.textRead.defaultFontColor;
          fontFamily.value = settings.textRead.defaultFontFamily;
          readSpread.value = settings.other.defaultReadBarSpread;
          writeSpread.value = settings.other.defaultWriteBarSpread;
          readBackground.value = settings.textRead.defaultReadBackground;
          backgroundColor.value = settings.textRead.defaultBackgroundColor;
          isDispalyBackgroundImage.value = settings.other.defaultDispalyBackgroundImage;
          noticeOpen('已恢复默认设置', 2);
        })
      }
    })
  }

  onBeforeMount(() => {
    windowApi.getSettings()
    .then(settings => {
      allSettings.value = settings;
      fontSize.value = settings.textRead.fontSize;
      lineHeight.value = settings.textRead.lineHeight;
      letterSpacing.value = settings.textRead.letterSpacing;
      readSpread.value = settings.other.readSpread;
      writeSpread.value = settings.other.writeSpread;
      readBackground.value = settings.textRead.readBackground;
      isDispalyBackgroundImage.value = settings.other.isDispalyBackgroundImage;
    })
  })

  onBeforeRouteLeave((to, from, next) => {
    setAppSettings();
    initSettings();
    next();
  })
</script>

<template>
  <div class="setting">
    <div class="setting-item">
      <div class="setting-item-title">背景</div>
      <div class="setting-item-content" @click="backgroundSetting">
        <p>启用自动切换的系列壁纸</p>
        <div class="setting-item-content-switch" :class="{'open-switch': isDispalyBackgroundImage}"></div>
      </div>
      <div class="setting-item-content" @click="useReadBackground">
        <p>是否启用阅读背景</p>
        <div class="setting-item-content-switch" :class="{'open-switch': readBackground}"></div>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-item-title">阅读</div>
      <div class="setting-item-content">
        <p>每次重启应用时, 阅读与写作页面默认"字号"</p>
        <div class="up-and-down"><!-- 这名字起的莫名想笑 -->
          <span @click="fontSizeUp" class="increase">+</span>
          <span class="value">{{ fontSize }}</span>
          <span @click="fontSizeDown" class="reduce">-</span>
        </div>
      </div>
      <div class="setting-item-content">
        <p>每次重启应用时, 阅读与写作页面默认"行高"</p>
        <div class="up-and-down">
          <span @click="lineHeightUp" class="increase">+</span>
          <span class="value">{{ lineHeight.toFixed(1) }}</span>
          <span @click="lineHeightDown" class="reduce">-</span>
        </div>
      </div>
      <div class="setting-item-content">
        <p>每次重启应用时, 阅读与写作页面默认"字间距"</p>
        <div class="up-and-down">
          <span @click="letterSpacingUp" class="increase">+</span>
          <span class="value">{{ letterSpacing }}</span>
          <span @click="letterSpacingDown" class="reduce">-</span>
        </div>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-item-title">其它</div>
      <div class="setting-item-content" @click="readSpreadSetting">
        <p>进入阅读页面时, "状态栏", "侧边栏"默认展开</p>
        <div class="setting-item-content-switch" :class="{'open-switch': readSpread}"></div>
      </div>
      <div class="setting-item-content" @click="writeSpreadSetting">
        <p>进入写作页面时, "状态栏", "侧边栏"默认展开</p>
        <div class="setting-item-content-switch" :class="{'open-switch': writeSpread}"></div>
      </div>
      <div class="setting-item-content" @click="restoreDefaultSettings">
        <p>恢复默认设置</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .setting {
    width: 100%;
    height: 100%;
    overflow: hidden scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    &-item {
      margin: 30px auto;
      max-width: 60%;
      &-title {
        font-size: 14px;
        font-weight: 700;
        text-align: start;
        margin-left: 20px;
      }
      &-content {
        border: 2px solid rgba(0, 0, 0, 1);
        border-radius: 10px;
        margin: 8px;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        box-shadow: 4px 4px 8px -1px rgba(0, 0, 0, 0.5);
        p {
          text-align: start;
          width: 90%;
          color: rgba(0, 0, 0, 1);
          margin: auto 0;
          font-size: 14px;
          font-weight: 700;
        }
        .up-and-down {
          width: 70px;
          display: flex;
          justify-content: space-between;
          .increase, .reduce {
            flex-grow: 1;
            font-size: 20px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.5);
          }
          .value {
            padding-top: 3px;
            font-size: 15px;
            font-weight: 700;
          }
        }
        &-switch {
          appearance: none;
          width: 45px;
          height: 20px;
          position: relative;
          border-radius: 16px;
          cursor: pointer;
          background-color: #777;
          &:before {
            content: "";
            position: absolute;
            width: 18px;
            height: 18px;
            background: white;
            left: 1px;
            top: 1px;
            border-radius: 50%;
            transition: left cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
          }
        }
        &:hover {
          cursor: pointer;
          background-color: rgba(193, 199, 248, 0.7);
        }
        &:active {
          cursor: pointer;
          background-color: rgba(193, 199, 248, 1);
        }
      }
    }
  }
  .open-switch {
    background-color: rgba(90, 209, 211, 1);
    &:before {
      left: 26px;
    }
  }
</style>
