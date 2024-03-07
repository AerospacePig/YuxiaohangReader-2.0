<script setup>
  import { useOtherStore } from '../store/otherStore';
  const otherStore = useOtherStore()
 
</script>

<template>
  <div class="global-notice">
    <p class="notice-container" :class="{'notice-container-out': otherStore.niticeOutAnimation}">
      {{ otherStore.noticeText }}
    </p>
  </div>
</template>

<style scoped lang="scss">
  .global-notice {
    bottom: 120px;
    .notice-container {
      width: 300px;
      height: 30px;
      padding: 3px 0;
      border: none;
      position: relative;
      overflow: hidden;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, rgba(193, 199, 248, 1) 40%, rgba(199, 242, 249, 1) 50%, rgba(216, 222, 254, 1) 60%, rgba(255, 255, 255, 0) 100%);
      animation: notice-in 0.18s cubic-bezier(0.3, 0.79, 0.55, 0.99) forwards;
      @keyframes notice-in {
        0% {transform: scale(0.5); opacity: 0;}
        100% {transform: scale(1); opacity: 1;}
      } 
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200px;
        height: 2px;
        transform: translateX(30px);
        border-top: 1px solid black;
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        height: 2px;
        transform: translateX(-30px);
        border-bottom: 1px solid black;
      }
    }
    .notice-container-out {
      width: 300px;
      padding: 3px 30px;
      animation: notice-out 0.5s forwards;
      @keyframes notice-out {
        0% {opacity: 1;}
        100% {opacity: 0;}
      }
    }
  }
</style>
