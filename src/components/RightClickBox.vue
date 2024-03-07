<script setup>
  import { ref, defineProps, watch, onBeforeMount } from 'vue';
  import { storeToRefs } from "pinia";
  import { useRouter } from 'vue-router';
  import { noticeOpen, dialogOpen } from '../utils/dialog';
  import { useDbStore } from '../store/dbStore';
  import { useOtherStore } from '../store/otherStore'

  const router = useRouter()
  const toWriteText = () => router.push('/writeText');
  const collectStatus = ref('关于收藏');
  const dbStore = useDbStore();
  const otherStore = useOtherStore();
  const { addTextName, addAuthor, addDescription } = storeToRefs(otherStore);
  const props = defineProps({
    fileName: String,
    isCollect: Boolean,
  });

  const addCollect = () => {
    windowApi.useUpdater(dbStore.fileKey, ['isCollect',], [true,])
    .then(result => {
      if (result) {
        noticeOpen('收藏成功', 1);
      } else {
        noticeOpen('收藏失败', 1);
      }
    })
  }

  const cancelCollect = () => {
    windowApi.useUpdater(dbStore.fileKey, ['isCollect',], [false,])
    .then(result => {
      if (result) {
        noticeOpen('已取消收藏', 1);
      } else {
        noticeOpen('取消收藏失败', 1);
      }
    })
  }

  const collectSetings = () => {
    if (props.isCollect) {
      cancelCollect();
    } else {
      addCollect();
    }
  }

  const addTextNameSettings = () => {
    addAuthor.value = false;
    addDescription.value = false;
    addTextName.value = true;
  }

  const addAuthorSettings = () => {
    addTextName.value = false;
    addDescription.value = false;
    addAuthor.value = true;
  }

  const addDescriptionSettings = () => {
    addTextName.value = false;
    addAuthor.value = false;
    addDescription.value = true;
  }

  const updateText = () => {
    dbStore.isBuildNewFile = false;
    toWriteText();
  }

  const deleter = (flag) => {
    if (flag) {
      windowApi.useDeleter(dbStore.fileKey)
      .then(result => {
        if (result.length === 0) {
          noticeOpen(`${props.fileName}已删除!`, 2);
        }
      })
    }
  }

  const deleteText = () => {
    dialogOpen.select('警告', `你正在进行删除操作, 确认删除文件"${props.fileName}"?`, deleter);
  }

  onBeforeMount(() => {
    watch(() => props.isCollect, () => {
      if (props.isCollect) {
        collectStatus.value = '取消收藏'
      } else {
        collectStatus.value = '添加收藏'
      }
    })
  })
</script>

<template>
  <div class="right-click-contextmenu">
    <section >
      <option @click="collectSetings">{{ collectStatus }}</option>
      <option @click="addAuthorSettings">编辑作者</option>
      <option @click="addDescriptionSettings">编辑描述</option>
      <option @click="addTextNameSettings">重命名</option>
      <option @click="updateText">修改内容</option>
      <option @click="deleteText">删除文本</option>
    </section>
  </div>
</template>

<style scoped lang="scss">
  .right-click-contextmenu {
    width: 100%;
    height: 100%;
    padding: 5px 0;
    border: none;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 1);
    section {
      width: 100%;
      height: auto;
      option {
        height: 4vh;
        font-size: 14px;
        padding: 5px 0 5px 5px;
        overflow: hidden;
        text-align: start;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 1);
        background-color: rgba(255, 255, 255, 1);
        border-bottom: 1px solid rgba(0, 0, 0, 1);
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        &:active {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
</style>