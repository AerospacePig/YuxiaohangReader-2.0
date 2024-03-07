<script setup>
  import { ref } from 'vue'
  import { dialogOpen } from "../utils/dialog";

  const explain = () => {
    dialogOpen.alert('通告', '暂时没有制作登录系统的打算, 目前这个项目只是自己用, 这里姑且做个占位头像, 等哪天突然想做了再说吧...')
  }

  const headPortrait = ref('')
  headPortrait.value = 'src/assets/img/headPortrait.png'
</script>

<template>
  <div class="personal-inf-ico">
    <div class="head-portrait" :style="{ backgroundImage: `url(${headPortrait})` }"></div>
    <span @click="explain">Yuxiaohang</span>
  </div>
</template>

<style scoped lang="scss">
  .personal-inf-ico {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: end;
    .head-portrait {
      height: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      margin: 0 5%;
      border: 2px solid rgba(136, 145, 226, 1);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      background-origin: content-box;
    }
    span {
      width: 60%;
      height: 60%;
      font-size: 2vw;
      font-weight: 700;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
      &:active {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
</style>