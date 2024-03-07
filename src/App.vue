<script setup>
  import Home from './views/Home.vue';
  import Cover from './components/Cover.vue';
  import WindowControl from './components/WindowControl.vue';
  import Dialog from './components/Dialog.vue';
  import Notice from './components/Notice.vue';
  import BackgroundChange from './components/BackgroundChange.vue';
  import { useOtherStore } from './store/otherStore';

  const otherStore =  useOtherStore()
</script>

<template>
  <Transition name="cover" appear>
    <div class="cover" v-if="otherStore.coverDisplay">
      <Cover></Cover>
    </div>
  </Transition>

  <div class="mainWindow" :class="{'mainWindow-defaultBackground': !otherStore.isDispalyBackgroundImage}">
    <Transition name="home">
      <Home class="home"></Home>
    </Transition>
  </div>

  <div class="dragBar">
    <WindowControl class="window-control"></WindowControl>
  </div>

  <div class="Notice" v-show="otherStore.noticeShow">
    <Notice></Notice>
  </div>

  <div class="Dialog" v-show="otherStore.dialogShow">
    <Dialog></Dialog>
  </div>

  <div class="backgroundImage" v-if="otherStore.isDispalyBackgroundImage">
    <BackgroundChange></BackgroundChange>
  </div>
</template>

<style lang="scss">
  #app {
    margin: 0;
    padding: 0;
    max-width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    .cover {
      width: 100%;
      height: 100%;
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
    }
    .mainWindow {
      width: 100%;
      height: 100%;
      opacity: 0.5;
      z-index: 1;
      animation: mainWindows-starting 0.8s cubic-bezier(.14, .91, .58, 1) forwards;
      @keyframes mainWindows-starting {
        0% { opacity: 0; transform: scale(1.3); }
        100% { opacity: 1; transform: scale(1); }
      }
      .home {
        height: calc(100% - 78Px);
        .home-enter-active,
        .home-leave-active {
          transition: 0.4s cubic-bezier(.14,.91,.58,1);
        }
        .home-enter-from,
        .home-leave-to {
          transform: scale(0.9);
          opacity: 0;
        }
      }
    }
    .mainWindow-defaultBackground {
      background: linear-gradient(rgba(176, 188, 247, 1) 10%, rgba(179, 234, 241, 0.4) 70%, rgba(163, 169, 225, 0.7) 100%);
    }
    .dragBar {
      width: 100%;
      height: 35Px;
      background: transparent;
      position: fixed;
      top: 0;
      z-index: 5;
      -webkit-app-region: drag;
      .window-control {
        position: fixed;
        top: 5Px;
        right: 15Px;
        -webkit-app-region: no-drag;
        z-index: 5;
      }
    }
    .Notice {
      width: auto;
      height: auto;
      position: fixed;
      top: 120px;
      z-index: 4;
    }
    .Dialog {
      width: 300px;
      height: 150px;
      position: fixed;
      top: 250px;
      z-index: 4;
    }
    .backgroundImage {
      width: 100%;
      height: 100%;
      z-index: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }.cover-enter-from {
    opacity: 1;
    transform: scale(1.3);
  }
  .cover-enter-active {
    transition: all 0.5s ease;
  }
  .cover-enter-to {
    opacity: 1;
    transform: scale(1);
  }
  .cover-leave-from {
    opacity: 1;
    transform: scale(1);
  }
  .cover-leave-active {
    transition: all 0.5s ease;
  }
  .cover-leave-to {
    opacity: 0;
    transform: scale(0.4);
  }
</style>
