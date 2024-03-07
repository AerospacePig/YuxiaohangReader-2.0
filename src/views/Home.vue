<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router';
  import getHelpText from '../utils/getHelpText';

  const router = useRouter()
  const currentRoute = () => router.currentRoute.value.name

  const toSettings = () => router.push('/setting')
  const toHome = () => router.push('/')

  const isHomeRoute = () => {
    const homeRouteList = ['recentRead', 'textCase',]
    return homeRouteList.includes(currentRoute()) ? true : false
  }

  const isActive = ref(false)
  const onAfterEnter = () => isActive.value = true
  const onAfterLeave = () => isActive.value = false
</script>

<template>
  <div>
    <main>
      <div class="home-header">
        <Transition name="home-router" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
          <div v-if="isHomeRoute()" class="home-router-container">
            <div class="home-router-main">
              <router-link class="button-recentRead" :style="{color: currentRoute() == 'recentRead' ? 'black' : '#333333'}" to="/">最近阅读</router-link>
              <router-link class="button-textCase" :style="{color: currentRoute() == 'textCase' ? 'black' : '#333333'}" to="/textCase">我的文库</router-link>
              <div :class="{'router-tracker': true, 'router-tracker0': currentRoute() == 'recentRead', 'router-tracker1': currentRoute() == 'textCase', 'router-tracker2': currentRoute() == 'writeText'}"></div>
            </div>  

            <div class="home-router-ico">
              <svg class="button-setting" @click="toSettings()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path></svg>
              <svg class="button-help" @click="getHelpText()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M297.2 248.9C311.6 228.3 320 203.2 320 176c0-70.7-57.3-128-128-128S64 105.3 64 176c0 27.2 8.4 52.3 22.8 72.9c3.7 5.3 8.1 11.3 12.8 17.7l0 0c12.9 17.7 28.3 38.9 39.8 59.8c10.4 19 15.7 38.8 18.3 57.5H109c-2.2-12-5.9-23.7-11.8-34.5c-9.9-18-22.2-34.9-34.5-51.8l0 0 0 0c-5.2-7.1-10.4-14.2-15.4-21.4C27.6 247.9 16 213.3 16 176C16 78.8 94.8 0 192 0s176 78.8 176 176c0 37.3-11.6 71.9-31.4 100.3c-5 7.2-10.2 14.3-15.4 21.4l0 0 0 0c-12.3 16.8-24.6 33.7-34.5 51.8c-5.9 10.8-9.6 22.5-11.8 34.5H226.4c2.6-18.7 7.9-38.6 18.3-57.5c11.5-20.9 26.9-42.1 39.8-59.8l0 0 0 0 0 0c4.7-6.4 9-12.4 12.7-17.7zM192 128c-26.5 0-48 21.5-48 48c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-44.2 35.8-80 80-80c8.8 0 16 7.2 16 16s-7.2 16-16 16zm0 384c-44.2 0-80-35.8-80-80V416H272v16c0 44.2-35.8 80-80 80z"></path></svg>
            </div>
          </div>
        </Transition>

        <Transition name="other-router" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
          <div class="other-router-header" v-show="! isHomeRoute()">
            <svg class="backIco" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"></path></svg>
            <span @click="toHome()">返回</span>
            <svg class="textReadIco" v-show="currentRoute() == 'textRead'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152V512l-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427V224c0-17.7 14.3-32 32-32H62.3c63.6 0 125.6 19.6 177.7 56zm32 264V248c52.1-36.4 114.1-56 177.7-56H480c17.7 0 32 14.3 32 32V427c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"></path></svg>
            <svg class="settingIco" v-show="currentRoute() == 'setting'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path></svg>
            <svg class="textCreatIco" v-show="currentRoute() == 'writeText'"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 43 43 0 96 0H384h32c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32H384 96c-53 0-96-43-96-96V96zM64 416c0 17.7 14.3 32 32 32H352V384H96c-17.7 0-32 14.3-32 32zM208 112v48H160c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V224h48c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H272V112c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16z"></path></svg>
          </div>
        </Transition>
      </div>

      <div class="home-content">
        <router-view  v-slot="{ Component }">
          <component :is="Component"></component>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
  main {
    height: 100%;
  }
  .home-header {
    margin: 30px 0 20px 30px;
    .home-router-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      .home-router-main {
        display: flex;
        text-align: start;
        position: relative;
        margin-left: 11vw;
        a {
          font: 18px SourceHanSansCN-Bold;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
          outline: none;
        }
        .button-recentRead,
        .button-textCase,
        .button-writeText {
          margin-right: 40px;
        }
        .router-tracker {
          width: 25px;
          height: 2px;
          background-color: rgba(0, 0, 0, 1);
          position: absolute;
          top: 30px;
          transition: 0.1s;
          &::before {
            content: '';
            width: 4px;
            height: 4px;
            border-radius: 50%;
            position: absolute;
            bottom: -1px;
            left: -10px;
            background-color: rgba(0, 0, 0, 1);
          }
        }
        .router-tracker0 {
          transform: translateX(26px);
        }
        .router-tracker1 {
          transform: translateX(140px);
        }
        .router-tracker2 {
          transform: translateX(255px);
        }
      }
      .home-router-ico {
        position: relative;
        margin-left: 40px;
        transform: translateY(0.4vh);
        .button-help, .button-setting {
          width: 20px;
          height: 20px;
          margin-right: 15px;
          fill: #454545;
          transform: translateY(2px);
          &:hover {
            fill: black;
          }
        }
        .button-help {
          cursor: pointer;
        }
        &::before {
          content: '';
          position: absolute;
          width: 5px;
          height: 25px;
          top: 0;
          left: -40px;
          background-color: #454545;
        }
      }
    }
    .other-router-header {
      width: auto;
      display: flex;
      .backIco {
        width: 15px;
        height: 15px;
        fill: #454545;
        transform: translate(-5px, 6px);
      }
      span {
        font-size: 18px;
        font-weight: 700;
        position: relative;
        cursor: pointer;
        &:hover {
          color: rgba(0, 0, 0, 0.7);
        }
        &:active {
          color: rgba(0, 0, 0, 0.9);
        }
        &::before {
          content: '';
          position: absolute;
          margin: 0;
          border: none;
          border-bottom: 1px solid black;
          height: 1px;
          top: 12px;
          left: 40px;
          animation: header-line-animation-1 1s forwards;
        }
        &::after {
          content: '';
          position: absolute;
          top: 10px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: black;
          animation: header-bot-animation-2 2s forwards;
          cursor: auto;
        }
      }
      @keyframes header-line-animation-1 {
        0% {width: 0;}
        100% {width: 150px;}
      }
      @keyframes header-bot-animation-2 {
        0% {right: -10px}
        100% {right: -145px}
      }
      .settingIco {
        width: 25px;
        height: 25px;
        fill: #454545;
        animation: settingIco-animation 1s forwards;
      }
      @keyframes settingIco-animation {
        0% {transform: translateX(10px) rotate(0deg); transform-origin: center center;}
        100% {transform: translateX(160px) rotate(720deg); transform-origin: center center;}
      }
      .textReadIco,
      .textCreatIco {
        width: 25px;
        height: 25px;
        fill: #454545;
        animation: textReadIco-textCreatIco-animation 1s forwards;
      }
      @keyframes textReadIco-textCreatIco-animation {
        0% {transform: translateX(10px);}
        100% {transform: translateX(160px);}
      }
    }
  }
  .home-content {
    padding: 0 45px;
    height: calc(100% + 1px);
    overflow: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .home-router-enter-active {
    animation: home-router-in 0.4s forwards;
  }
  @keyframes home-router-in {
    0% {opacity: 0;}
    100% {opacity: 1;}
  }
</style>
