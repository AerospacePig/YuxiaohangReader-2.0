<script setup>
  import { ref, onMounted } from 'vue';
  import { useOtherStore } from '../store/otherStore';

  const otherStore = useOtherStore();
  const showResult = ref(null);

  const showSearchResult = () => {
    showResult.value = [];

    otherStore.searchResult.forEach(fileKey => {
      windowApi.usePreciseMatcher(fileKey)
      .then(result => {
        result.readProgress = result.readProgress * 100;

        Object.keys(result).forEach(key => {
          if (result[key] === null) {
            result[key] = '---';
          }
        });
        showResult.value.push(result);
      })
    })
  }

  const exit = () => {
    otherStore.searchShow = false;
  }

  onMounted(() => {
    showSearchResult();
  })
</script>

<template>
  <div class="search-show">
    <div class="show" v-for="(data, index) in showResult" :key="index">
      <strong>{{ `搜索结果: ${index + 1}` }}</strong>
      <div class="text-cover-container">
        <div class="text-cover">
          <span></span>
          <span>暂无封面</span>
          <svg class="no-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path></svg>
        </div>
      </div>
      <ul class="read-inf">
        <li>{{ data.fileName }}</li>
        <li>{{ data.author }}</li>
        <li>{{ data.fileSize }}MB</li>
        <li>{{ data.chapterCount }}章</li>
        <li>{{ data.totalWordCount }}字</li>
        <li>{{ data.readProgress.toFixed(2) }}%</li>
        <li>{{ data.isCollect ? '已收藏' : '未收藏' }}</li>
        <li>{{ data.lastReadTime }}</li>
        <li>{{ data.recentUpdateTime }}</li>
        <li>{{ data.uploadDate }}</li>
        <li>{{ data.totalReadTime }}分钟</li>
        <li>{{ data.description }}</li>
      </ul>
    </div>

    <svg class="exit-ico" @click="exit" t="1668091127480" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1341" width="200" height="200"><path d="M956.171172 875.411847l-80.757279 80.757279L511.997953 592.757279 148.586107 956.170149 67.828828 875.411847l363.411847-363.411847L67.828828 148.58713l80.757279-80.757279 363.411847 363.411847L875.413893 67.829851l80.757279 80.757279L592.756255 512 956.171172 875.411847z" p-id="1342"></path></svg>
  </div>
</template>

<style lang="scss" scoped>
  .search-show {
    width: 100%;
    height: 100%;
    overflow: hidden scroll;
    border: 5px solid rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border-left: none;
    border-right: none;
    background: linear-gradient(rgba(176, 188, 247, 0.6) 10%, rgba(179, 234, 241, 0.4) 70%, rgba(163, 169, 225, 0.7) 100%);
    .show {
      position: relative;
      width: 100%;
      height: auto;
      strong {
        position: absolute;
        top: 2%;
        left: 5%;
        color: rgba(0, 0, 0, 0.5);
      }
      .text-cover-container {
        width: 100%;
        height: 55%;
        padding: 2% 0;
        .text-cover {
          width: 30%;
          height: 100%;
          margin: 0 auto;
          padding: 2%;
          display: flex;
          position: relative;
          flex-direction: column;
          justify-content: space-between;
          border: 2px solid rgba(0, 0, 0, 0.1);
          .no-cover {
            width: 40px;
            height: auto;
            position: absolute;
            top: 20%;
            left: 34%;
            fill: rgba(0, 0, 0, 0.5);
          }
          span:nth-child(1) {
            display: block;
            width: 100%;
            height: 110px;
            background-color: rgba(0, 0, 0, 0.1);
          }
          span:nth-child(2) {
            display: block;
            width: 100%;
            height: 20%;
            font-size: 14px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.5);
            background-color: rgba(0, 0, 0, 0.1);
          }
        }
      }
      .read-inf {
        width: 100%;
        height: auto;
        border-top: 1px solid rgba(0, 0, 0, 0.3);
        li {
          position: relative;
          text-align: center;
          margin: 4vh 0;
          font-size: 14px;
          font-weight: 700;
          padding-bottom: 5px;
          border-bottom: 1px dashed rgba(0, 0, 0, 0.5);
          color: rgba(0, 0, 0, 0.5);
        }
        li:nth-child(12) {
          padding-left: 70px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        li:nth-child(1)::before,
        li:nth-child(2)::before,
        li:nth-child(3)::before,
        li:nth-child(4)::before,
        li:nth-child(5)::before,
        li:nth-child(6)::before,
        li:nth-child(7)::before,
        li:nth-child(8)::before,
        li:nth-child(9)::before,
        li:nth-child(10)::before,
        li:nth-child(11)::before,
        li:nth-child(12)::before {
          width: auto;
          position: absolute;
          left: 0;
          top: 0;
        }
        li:nth-child(1)::before {
          content: '书名:';
        }
        li:nth-child(2)::before {
          content: '作者:';
        }
        li:nth-child(3)::before {
          content: '大小:';
        }
        li:nth-child(4)::before {
          content: '章节:';
        }
        li:nth-child(5)::before {
          content: '字数:';
        }
        li:nth-child(6)::before {
          content: '进度:';
        }
        li:nth-child(7)::before {
          content: '收藏状态:';
        }
        li:nth-child(8)::before {
          content: '最近阅读:';
        }
        li:nth-child(9)::before {
          content: '最近修改:';
        }
        li:nth-child(10)::before {
          content: '上传日期:';
        }
        li:nth-child(11)::before {
          content: '阅读时长:';
        }
        li:nth-child(12)::before {
          content: '相关描述:';
        }
      }
    }
    &::-webkit-scrollbar {
      width : 0.7vw;
      height: 0.1vw;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background : rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-track {
      background : rgba(255, 255, 255, 0.2);
    }
    .exit-ico {
      position: absolute;
      top: 5%;
      right: 5%;
      width: 15px;
      height: auto;
      fill: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      &:hover {
        fill: rgba(0, 0, 0, 1);
      }
    }
  }
</style>