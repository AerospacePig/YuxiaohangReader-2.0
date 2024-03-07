<script setup>
  import { dialogCancel, dialogConfirm } from '../utils/dialog'
  import { useOtherStore } from '../store/otherStore';
  import { storeToRefs } from 'pinia';

  const otherStore =  useOtherStore()
  const { dialogHeader, dialogText, cancelButton } = storeToRefs(otherStore)
</script>

<template>
  <div class="dialog-container">
    <div class="dialog">
      <div class="dialog-header">
        <span>{{ dialogHeader }}</span>
      </div>
      <div class="dialog-content">
        <span>{{ dialogText }}</span>
      </div>
      <div class="dialog-option">
        <button @click="dialogCancel()" v-show="cancelButton">取消</button>
        <button @click="dialogConfirm()" :style="{ marginLeft: cancelButton ? '0' : '200px'}">确认</button>
      </div>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .dialog-container {
    width: 100%;
    height: 100%;
    padding: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(0, 0, 0, 1);
    border-radius: 10px;
    background: linear-gradient(rgb(193, 199, 248) 0, rgb(199, 242, 249) 70%, rgb(216, 222, 254) 100%);
    transform: translate(-50%, -50%);
    animation: dialog-container-in 0.3s forwards;
    @keyframes dialog-container-in {
      0% {width: 0; height: 0; opacity: 0;}
      50% {width: 300px; height: 0; opacity: 1;}
      100% {width: 300px; height: 150px;}
    }
    &-active {
      width: 300Px;
      height: 150Px;
      padding: 15Px 20px;
    }
    .dialog {
      width: 100%;
      height: 100%;
      display: flex;
      z-index: 1;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      position: relative;
      .dialog-header {
        span {
          font-weight: 700;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.8);
        }
      }
      .dialog-content {
        span {
          font-weight: 700;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
      .dialog-option {
        display: flex;
        flex-direction: row;
        align-items: center;
        button {
          width: 60px;
          height: 30px;
          border: 1px solid black;
          color: rgba(0, 0, 0, 0.8);
          border-radius: 5px;
          margin-bottom: 10px;
          font: 14Px SourceHanSansCN-Bold;
          background-color: transparent;
          outline: 0;
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
          &:active {
            background-color: rgba(0, 0, 0, 0.2);
          }
        }
        button:first-child {
          margin-right: 40px;
        }
      }
    }
    .dialog > span {
      width: 60px;
      height: 30px;
      border: 2px solid black;
      border-radius: 10px;
      position: absolute;
      border-top-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .dialog-option + span {
      top: 0px;
      right: 0px;
      border-left: none;
      border-bottom: none;
    }
    .dialog > span:last-child {
      bottom: 0px;
      left: 0px;
      border-top: none;
      border-right: none;
    }
  }
  .dialog-container-out {
    animation: dialog-container-out 1s forwards;
  }
  @keyframes dialog-container-out {
    0% {width: 300px; height: 150px;}
    50% {width: 300px; height: 0;}
    100% {width: 0; height: 0;}
  }
</style>
