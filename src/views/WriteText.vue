<script setup>
  import { ref, onMounted, onBeforeMount } from 'vue';
  import { storeToRefs } from "pinia";
  import { onBeforeRouteLeave } from 'vue-router';
  import { useDbStore } from '../store/dbStore';
  import { useReadStore } from '../store/readStore';
  import { useOtherStore } from '../store/otherStore'
  import ReadSidebar from '../components/ReadSidebar.vue';
  import EditSidebar from '../components/EditSidebar.vue';
  import ReadSettingsBar from '../components/ReadSettingsBar.vue';
  import AddUploadInf from '../components/AddUploadInf.vue';
  import { noticeOpen, dialogOpen } from '../utils/dialog';

  const currentContent = ref('');
  const originalContent = ref('');
  const notLeaveSave = ref(true);
  const dbStore = useDbStore();
  const readStore = useReadStore();
  const otherStore = useOtherStore();
  const {
    writeSpread, isBarSpread, isStatusSidebar, isOptionSidebar,
    fontSize, letterSpacing, lineHeight, fontColor, backgroundColor, fontFamily,
  } = storeToRefs(readStore)
  const { addTextName, addAuthor, addDescription } = storeToRefs(otherStore);

  const settingsBarSpread = () => {
    isBarSpread.value = !isBarSpread.value;
    isOptionSidebar.value = isBarSpread.value;
    isStatusSidebar.value = isBarSpread.value;
  }

  onMounted(() => {
    if (! dbStore.isBuildNewFile) {
      windowApi.getCompleteContent(dbStore.fileKey)
      .then(result => {
        currentContent.value = result;
        originalContent.value = result;
      })
    }
  })

  const addTextNameSettings = () => {
    addAuthor.value = false;
    addDescription.value = false;
    addTextName.value = true;
  }

  const getFileName = (value) => {
    if (value === '') {
      dialogOpen.select('警告', '若放弃重命名, 则将默认命名为"untitled"', (flag) => {
        flag ? creatNewFile('untitled') : addTextName.value = false;
      });
    } else {
      creatNewFile(value);
    }
  }

  let leaveRoute = null; // 中间值, 这样写有点蠢, 暂时没有想到更好的办法
  const creatNewFile = (textName='untitled') => {
    windowApi.creatNewFile(currentContent.value, textName)
    .then(result => {
      const creatFileLogs = result.creatFileLogs;
      if (creatFileLogs.length > 0) {
        if (notLeaveSave.value) {
          noticeOpen(`${creatFileLogs}, 保存失败`);
        } else {
          leaveRoute(false);
          dialogOpen.alert('警告', '新内容保存失败, 为防止内容丢失, 已阻止离开当前页面!');
        }
      } else {
        dbStore.fileKey = result.fileKey;
        if (notLeaveSave.value) {
          noticeOpen('已保存');
          if (! dbStore.isSaveAs) {
            originalContent.value = currentContent.value;
          }
        } else {
          leaveRoute();
          noticeOpen('新内容已上传');
        }
        dbStore.isSaveAs ? dbStore.isSaveAs = false : dbStore.isBuildNewFile = false;
      }
    });
  }

  const renameFile = (next) => {
    addTextNameSettings();
    leaveRoute = next;
  }

  const updateFile = (next=null) => {
    windowApi.updateFile(currentContent.value, dbStore.fileKey, dbStore.isBuildNewFile)
    .then(result => {
      const updateLogs = result;
      if (updateLogs.length > 0) {
        if (notLeaveSave.value) {
          noticeOpen('保存失败');
        } else {
          next(false);
          dialogOpen.alert('警告', `${updateLogs}, 内容保存失败, 为防止内容丢失, 已阻止离开当前页面!`);
        }
      } else {
        if (notLeaveSave.value) {
          noticeOpen('已保存');
          originalContent.value = currentContent.value;
        } else {
          next();
          noticeOpen('已保存');
        }
      }
    });
  }

  const handleEmptyFile = (flag, next) => {
    if (flag) {
      updateFile(next);
    } else {
      windowApi.useDeleter(dbStore.fileKey)
      .then(result => {
        result.length === 0 ? noticeOpen('空文件已删除!', 2) : dialogOpen.alert('警告', '文件删除失败, 文件仍保留编辑前状态!');
        next();
      })
    }
  }

  const handleSaveEvent = () => {
    notLeaveSave.value = true;
    if (dbStore.isBuildNewFile && currentContent.value !== '') {
      addTextNameSettings();
    } else if (dbStore.isBuildNewFile && currentContent.value === '') {
      dialogOpen.select('警告', '当前内容为空, 确认保存空文件?', (flag) => {
        flag ? addTextNameSettings() : noticeOpen('已取消', 1);
      })
    } else if (currentContent.value !== '' && currentContent.value !== originalContent.value) {
      updateFile();
    } else if (currentContent.value !== '' && currentContent.value === originalContent.value) {
      noticeOpen('内容无变化', 1);
    } else {
        dialogOpen.select('警告', '当前内容为空, 确认保存空文件?', (flag) => {
        flag ? updateFile() : noticeOpen('已取消', 1);
      })
    }
  }

  const handleSaveAsEvent = () => {
    notLeaveSave.value = true;
    if (currentContent.value === '') {
      dialogOpen.alert('警告', '当前文本内容为空, 不建议为其创建副本!');
    } else {
      dialogOpen.select('通告', '确认为当前文件创建副本?', (flag) => {
        if (flag) {
          addTextNameSettings();
          dbStore.isSaveAs = true;
        } else {
          noticeOpen('已取消', 1);
        }
      })
    }
  }

  onBeforeMount(() => {
    if (writeSpread.value) {
      isBarSpread.value = true;
      isOptionSidebar.value = true;
      isStatusSidebar.value = true;
    } else {
      isBarSpread.value = false;
      isOptionSidebar.value = false;
      isStatusSidebar.value = false;
    }
  })

  onBeforeRouteLeave((to, from, next) => {
    notLeaveSave.value = false;
    if (dbStore.isBuildNewFile && currentContent.value !== '') {
      dialogOpen.select('通告', '文件尚未保存, 是否保存为新文件?', (flag) => {
        if (flag) {
          renameFile(next);
        } else {
          next();
          noticeOpen('已取消', 1);
        }
      });
    } else if (dbStore.isBuildNewFile && currentContent.value === '') {
      next();
      noticeOpen('空白文件', 1);
    } else if (currentContent.value !== originalContent.value && currentContent.value !== '') {
      dialogOpen.select('通告', '当前文本修改尚未保存, 是否保存最新修改?', (flag) => {
        if (flag) {
          updateFile(next);
        } else {
          next();
          noticeOpen('已取消', 1);
        }
      });
    } else if (currentContent.value !== originalContent.value && currentContent.value === '') {
      dialogOpen.select('警告', '当前文本内容为空, 确认要"保存"此空文件? 若选择取消则"删除"此空文件', (flag) => {
        handleEmptyFile(flag, next);
      })
    } else if (currentContent.value === originalContent.value) {
      next();
    }
  });
</script>

<template>
  <div class="write-text">
    <hr v-show="! isBarSpread"/>
    <div class="header-toolbar">
      <transition name="fade" appear>
        <div v-show="isBarSpread" class="read-settings-bar">
          <ReadSettingsBar></ReadSettingsBar>
        </div>
      </transition>
    </div>

    <svg @click="settingsBarSpread" :class="{ 'ico-rotate-180': !isBarSpread }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>

    <div class="edit-area" :style="{ bottom: !isBarSpread ? '-1vh' : '-6vh' }">
      <span class="top-left-corner"></span>
      <span class="top-right-corner"></span>
      <textarea
        v-model="currentContent"
        ref="textarea"
        placeholder="于此处键入内容..."
        :style="{ height: isBarSpread ? '84vh' : '89vh', fontSize: `${fontSize}px`, letterSpacing: `${letterSpacing}px`, lineHeight: `${lineHeight}`, color: `${fontColor}`, backgroundColor: `${backgroundColor}`, fontFamily: `${fontFamily}` }"
      ></textarea>
    </div>

    <transition name="left-sidebar" appear>
      <div v-if="isOptionSidebar" class="left-sidebar">
        <EditSidebar @save="handleSaveEvent" @save-as="handleSaveAsEvent"></EditSidebar>
      </div>
    </transition>

    <transition name="right-sidebar" appear>
      <div v-if="isStatusSidebar" class="right-sidebar">
        <ReadSidebar :wordCount="currentContent.length"></ReadSidebar>
      </div>
    </transition>

    <div class="addUploadInf" v-show="addAuthor || addDescription || addTextName">
      <AddUploadInf fileName='未定义' @child-click="getFileName"></AddUploadInf>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .write-text {
    width: 76vw;
    height: 100%;
    margin: 0 auto;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-top: none;
    border-bottom: none;
    overflow: hidden;
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
    .header-toolbar {
      width: 100%;
      height: 6vh;
      display: flex;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 50%, rgba(255, 255, 255, 0) 100%);
      button {
        flex-grow: 1;
        border: none;
        border-right: 1px solid rgba(0, 0, 0, 0.5);
        outline: none;
        margin: 0;
        font-size: 0.9vw;
        color: rgba(0, 0, 0, 0.8);
        background-color: transparent;
        &:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
        &:active {
          background-color: rgba(0, 0, 0, 0.3);
        }
      }
      & button:last-child {
        border-right: none;
      }
      .read-settings-bar {
        width: 100%;
        height: 6vh;
      }
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
    .edit-area {
      width: 50vw;
      height: 100%;
      position: absolute;
      bottom: 0;
      left: 12.9vw;
      box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1), -1px 1px 2px 1px rgba(0, 0, 0, 0.1);

      $skew-x: 3vw;
      $skew-y: 4vh;
      $corner: 1.8vw;
      transition: bottom 0.5s;
      .top-left-corner {
        width: $corner;
        height: $corner;
        position: absolute;
        left: $skew-x;
        top: $skew-y;
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-top: none;
        border-left: none;
      }
      .top-right-corner {
        width: $corner;
        height: $corner;
        position: absolute;
        right: $skew-x;
        top: $skew-y;
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-top: none;
        border-right: none;
      }
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
        outline: none;
        background-color: rgba(255, 255, 255, 0.7);
        padding: calc($skew-y + $corner) calc($skew-x + $corner) 0 calc($skew-x + $corner);
        border: 1px solid rgba(0, 0, 0, 0.3);
        transition: height 0.5s;
        &::-webkit-scrollbar {
          width : 0.7vw;
          height: 0.1vw;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background : rgba(156, 167, 240, 1);
        }
        &::-webkit-scrollbar-track {
          background : rgba(255, 255, 255, 0.2);
        }
      }
    }
    .left-sidebar {
      width: 13vw;
      height: 90%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .right-sidebar {
      width: 13vw;
      height: 90%;
      position: absolute;
      bottom: 0;
      right: 0;
      margin-bottom: 1vh;
    }
    .addUploadInf {
      width: 300px;
      height: 150px;
      position: fixed;
      top: 36vh;
      left: 40vw;
      z-index: 3;
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
  .left-sidebar-enter-from {
    opacity: 0;
    transform: translateX(-100%);
  }
  .left-sidebar-enter-active {
    transition: all 0.5s ease;
  }
  .left-sidebar-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .left-sidebar-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .left-sidebar-leave-active {
    transition: all 0.5s ease;
  }
  .left-sidebar-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
  .right-sidebar-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  .right-sidebar-enter-active {
    transition: all 0.5s ease;
  }
  .right-sidebar-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .right-sidebar-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .right-sidebar-leave-active {
    transition: all 0.5s ease;
  }
  .right-sidebar-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
