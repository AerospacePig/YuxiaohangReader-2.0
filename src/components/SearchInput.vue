<script setup>
  import { ref, watch } from 'vue';
  import { useOtherStore } from '../store/otherStore';
  import { noticeOpen } from "../utils/dialog";

  const searchText = ref('');
  const searchIcoShow = ref(true);
  const cancelIcoShow = ref(false);
  const otherStore = useOtherStore();

  const pressEnter = () => {
    if (otherStore.searchShow) {
      otherStore.searchShow = false;
    }

    if (searchText.value) {
      windowApi.handleSearch(searchText.value)
      .then(matchResult => {
        if (matchResult.length > 0) {
          otherStore.searchResult = matchResult;
          otherStore.searchShow = true;
        } else {
          noticeOpen('搜索结果为空', 2);
        }
      })
    }
  }

  const cancel = () => {
    cancelIcoShow.value = false;
    searchIcoShow.value = true;
    searchText.value = ''
  }

  watch(searchText, () => {
    if (searchText.value) {
      cancelIcoShow.value = true;
      searchIcoShow.value = false;
    } else {
      searchIcoShow.value = true;
      cancelIcoShow.value = false;
    }
  })
</script>

<template>
  <div class="search">
    <input type="text" v-model="searchText" placeholder="Search..." @keyup.enter="pressEnter">
    <svg v-show="searchIcoShow" @click="pressEnter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
    <svg v-show="cancelIcoShow" @click="cancel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>
  </div>
</template>

<style lang="scss" scoped>
  .search {
    position: relative;
    width: 100%;
    input[type=text] {
      width: 100%;
      height: 30px;
      display: inline-block;
      font-size: 15px;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
      text-align: start;
      border-radius: 5px;
      padding: 0 35px 0 5px;
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(0, 0, 0, 0.6);
      box-sizing: border-box;
      outline: none;
      overflow: hidden;
      white-space: nowrap;
      transform: scale(1);
      cursor: text;
      &:hover, &:focus {
        outline: 1px solid rgba(0, 0, 0, 0.6);
        outline-offset: -1px;
        background-color: rgba(255, 255, 255, 0.7);
      }
    }
    svg {
      position: absolute;
      top: 50%;
      right: 10px;
      width: 18px;
      height: 18px;
      fill: rgba(0, 0, 0, 0.5);
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
</style>