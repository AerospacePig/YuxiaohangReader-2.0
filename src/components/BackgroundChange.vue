<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';

  const images = [
    'src/assets/img/image1.jpg',
    'src/assets/img/image2.jpg',
    'src/assets/img/image3.jpg',
    'src/assets/img/image4.jpg',
    'src/assets/img/image5.jpg',
    'src/assets/img/image6.jpg',
  ];
  const currentBg = ref(images[0])
  const currentBgIndex = ref(0);

  const changeBgImage = setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % images.length;
    currentBg.value = images[currentBgIndex.value];
  }, 7000)

  onMounted(() => {
    changeBgImage
  });
  onBeforeUnmount(() => {
    clearInterval(changeBgImage);
  });
</script>

<template>
  <div class="image-transition">
    <transition name="fade" appear>
      <div :key="currentBg" class="background-image" :style="{ backgroundImage: `url(${currentBg})` }"></div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
  .image-transition {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
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
    opacity: 0.8;
  }
  .fade-enter-from {
    transform: scale(1);
    opacity: 0;
  }
  .fade-enter-active {
    transition: all 7s ease;
  }
  .fade-enter-to {
    transform: scale(1.2);
    opacity: 0.8;
  }
  .fade-leave-from {
    transform: scale(1.2);
    opacity: 0.8;
  }
  .fade-leave-active {
    transition: all 2s ease-in;
  }
  .fade-leave-to {
    transform: scale(1.2);
    opacity: 0;
  }
</style>
