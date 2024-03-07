<script setup>
  import { useRouter } from 'vue-router';
  import SearchInput from './SearchInput.vue';
  import RecentUpload from './RecentUpload.vue';
  import TextInformation from './TextInformation.vue';
  import CollectShow from './CollectShow.vue';
  import Statistics from './Statistics.vue';
  import { useDbStore } from '../store/dbStore';
  import { noticeOpen, continuousDialog, dialogOpen } from '../utils/dialog';
  
  const router = useRouter()
  const dbStore = useDbStore();

  const toWriteText = () => router.push('/writeText');

  const upload = () => {
    dialogOpen.select('通告', '确定上传新文件?', (flag) => {
      if (flag) {
        windowApi.uploadFile()
        .then(uploadLogs => {
          if (uploadLogs.length !== 0) {
            continuousDialog('错误信息:', uploadLogs)
          } else {
            noticeOpen('上传成功!', 2)
          }
        })
      }
    })
  }

  const makeText = () => {
    dialogOpen.select('注意', '你确定要建立一个全新文本吗?', (flag) => {
      if (flag) {
        toWriteText();
        dbStore.isBuildNewFile = true;
      } else {
        noticeOpen('已取消', 1);
      }
    })
  }
</script>

<template>
  <div class="searchInput">
    <SearchInput></SearchInput>
  </div>
  <div class="textUpload-or-delete">
    <button @click="upload">
      <svg class="textUpload" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64V416zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24V312h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V200c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H168c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z"></path></svg>
    </button>
    <button @click="makeText">
      <svg class="make-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 43 43 0 96 0H384h32c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32H384 96c-53 0-96-43-96-96V96zM64 416c0 17.7 14.3 32 32 32H352V384H96c-17.7 0-32 14.3-32 32zM208 112v48H160c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V224h48c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H272V112c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16z"></path></svg>
    </button>
  </div>
  <div class="textInformation">
    <TextInformation></TextInformation>
  </div>
  <div class="recentUpload">
    <RecentUpload></RecentUpload>
  </div>
  <div class="collectShow">
    <CollectShow></CollectShow>
  </div>
  <div class="statistics">
    <Statistics></Statistics>
  </div>
  <div class="footnote"></div>
</template>

<style lang="scss" scoped>
  .searchInput {
    width: 100%;
    height: 5%;
    margin: 5% 0;
    border: none;
    border-radius: 10px;
  }
  .textUpload-or-delete {
    width: 100%;
    height: 5%;
    margin: 10% 0;
    border: none;
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    border-radius: 10px;
    cursor: pointer;
    button {
      width: 45%;
      height: 100%;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      border: none;
      border-radius: 10px;
      position: relative;
      outline: none;
      background-color: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.8);
      transition: background-color 0.5s;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.4);
      }
      &:active {
        background-color: rgba(0, 0, 0, 0.7);
      }
      .textUpload {
        width: 18%;
        position: absolute;
        top: 14%;
        left: 42%;
        fill: white;
      }
      .make-text {
        width: 16%;
        position: absolute;
        top: 15%;
        right: 40%;
        fill: white;
      }
    }
  }
  .textInformation {
    width: 100%;
    height: 50vh;
    margin: 10% 0 10% 0;
  }
  .recentUpload {
    width: 100%;
    height: 40vh;
    margin: 10% 0;
    border: none;
  }
  .collectShow {
    width: 100%;
    height: 30vh;
    margin: 10% 0;
    border: none;
  }
  .statistics {
    width: 100%;
    height: 15vh;
    margin: 10% 0;
    border-radius: 10px;
  }
  .footnote {
    width: 100%;
    height: 0.1vh;
    border: none;
    margin: 5vh 0;
    background: rgba(0, 0, 0, 0.1);
  }
</style>
