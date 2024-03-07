<script setup>
  import { ref, onBeforeMount } from 'vue';
  import { useOtherStore } from '../store/otherStore';
  
  const otherStore =  useOtherStore()
  const currentBg = ref('');
  const headPortrait = ref('');
  const scrollCover = ref(null);
  const imagePath = [
    'src/assets/img/cover.png',
    'src/assets/img/headPortrait.png',
  ];

  const handleScroll = () => {
    otherStore.coverDisplay = false;
  }

  onBeforeMount(() => {
    currentBg.value = imagePath[0];
    headPortrait.value = imagePath[1]
  });
</script>

<template>
  <div class="cover-container" ref="scrollCover" @wheel="handleScroll">
    <div class="container">
      <div class="titel">
        <div class="head-portrait" :style="{ backgroundImage: `url(${headPortrait})` }"></div>
        <div class="titel-name">Yuxiaohang</div>
      </div>

      <div class="describe">沧浪之水清兮，可以濯我缨。沧浪之水浊兮，可以濯我足。<br/>——&nbsp;先秦 · 佚名</div>

      <div class="contact">
        <p class="contact-qq">QQ:3165571820</p>
        <p><a href="https://github.com/Yxiaohang">GitHub</a></p>
      </div>

      <div class="background-image" :style="{ backgroundImage: `url(${currentBg})` }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .cover-container {
    width: 100%;
    height: 100%;
    .container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .titel {
        z-index: 1;
        height: 7vw;
        display: flex;
        justify-content: center;
        animation: titel-enter 0.5s ease forwards;
        @keyframes titel-enter {
          from { opacity: 0.5; transform: translateY(-10vh); }
          to { opacity: 1; transform: translateY(0); }
        }
        .head-portrait {
          height: 4vw;
          align-self: center;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 1);
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          background-origin: content-box;
        }
        .titel-name {
          padding-top: 12%;
          padding-left: 1vw;
          font-family: 'Geometos';
          font-size: 2.5vw;
          font-weight: 700;
          display: inline;
          color: rgba(255, 255, 255, 1);
        }
      }
      .describe {
        z-index: 1;
        width: 50vw;
        height: 15vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2vw;
        font-weight: 100;
        line-height: 2;
        color: rgba(255, 255, 255, 1);
        border-top: 2px solid rgba(255, 255, 255, 1);
        border-bottom: 3px solid rgba(255, 255, 255, 1);
        animation: describe-enter 0.5s ease forwards;
        @keyframes describe-enter {
          from { opacity: 0.5; transform: translateY(5vh); }
          to { opacity: 1; transform: translateY(0); }
        }
      }
      .contact {
        z-index: 1;
        font-size: 1vw;
        display: flex;
        column-gap: 1vw;
        justify-content: center;
        align-items: center;
        color: rgba(255, 255, 255, 1);
        animation: contact-enter 1s ease forwards;
        @keyframes contact-enter {
          from { opacity: 0.5; transform: translateY(10vh); }
          to { opacity: 1; transform: translateY(0); }
        }
        &-qq {
          transition: opacity 0.5s;
          text-decoration: underline dotted;
          text-underline-offset: 0.7vh;
          text-decoration-color: rgba(255, 255, 255, 1);
          &:hover {
            opacity: 0.7;
          }
        }
        a {
          padding-bottom: 0.2vh;
          transition: color 0.4s;
          text-decoration: underline dotted;
          text-underline-offset: 0.7vh;
          text-decoration-color: rgba(255, 255, 255, 1);
          &:link, &:visited, &:active {
            color: rgba(255, 255, 255, 1);
          }
          &:hover {
            color: rgb(89, 185, 253);
            opacity: 0.7;
          }
        }
      }
      .background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-origin: content-box;
        filter: brightness(0.5) contrast(0.8);
      }
    }
  }
</style>