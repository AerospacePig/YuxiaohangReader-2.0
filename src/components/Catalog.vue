<script setup>
  import { ref, watch, onBeforeMount } from 'vue';
  import { storeToRefs } from "pinia";
  import { useReadStore } from '../store/readStore';
  import { useDbStore } from '../store/dbStore';
  import { dialogOpen } from '../utils/dialog'

  const readStore = useReadStore()
  const dbStore = useDbStore()
  const { currentChapterId, skipChapterId, currentChapterName } = storeToRefs(readStore);
  const currentCatalog = ref(null)

  const catalogLink = (chapter, index) => {
    if (chapter) {
      dialogOpen.select('警告', '您确定要跳转到指定章节?这可能造成进度信息统计失真!', (flag) => {
        if (flag) {
          skipChapterId.value = Number(index.split('_')[1]);
          currentChapterId.value = skipChapterId.value;
        }
      })
    }
  }

  const updateChapterName = () => {
    currentChapterName.value = Object.values(currentCatalog.value)[currentChapterId.value - 1];
  }

  onBeforeMount(() => {
    windowApi.getCatalog(dbStore.fileKey)
    .then(result => {
      currentCatalog.value = result;
      updateChapterName();

      watch(currentChapterId, () => {
        updateChapterName();
      });
    })
  })
</script>

<template>
  <ul class="chapters">
    <li class="chapter" @click="catalogLink(chapter, index)" v-for="(chapter, index) in currentCatalog" :key="index">{{ chapter ? chapter : '章节获取失败...' }}</li>
  </ul>
</template>

<style lang="scss" scoped>
  .chapters {
    width: 100%;
    height: 100%;
    margin: 0;
    padding-left: 0.5vw;
    overflow: scroll;
    background: linear-gradient(to right,rgba(193, 199, 248, 1) 0, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 0) 100%);
    &::-webkit-scrollbar {
      display: none;
    }
    .chapter {
      width: 100%;
      height: 4vh;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: start;
      list-style-type: none;
      font-size: 1vw;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.7);
      cursor: pointer;
      &:hover {
        color: rgba(0, 0, 0, 1);
      }
      &:active {
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
</style>
