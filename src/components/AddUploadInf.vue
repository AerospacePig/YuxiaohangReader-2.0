<script setup>
  import { ref, defineProps, defineEmits  } from 'vue';
  import { storeToRefs } from "pinia";
  import { useDbStore } from '../store/dbStore';
  import { useOtherStore } from '../store/otherStore'
  import { noticeOpen } from '../utils/dialog';
  
  const textName = ref('');
  const author = ref('');
  const description = ref('');
  const dbStore = useDbStore();
  const otherStore = useOtherStore();
  const { addTextName, addAuthor, addDescription } = storeToRefs(otherStore);
  const props = defineProps({
    fileName: String,
  });
  const emit = defineEmits(['child-click'])
  const transmitTextName = (textName) => {
    emit('child-click', textName)
  }

  const cancel = () => {
    addTextName.value = false;
    addAuthor.value = false;
    addDescription.value = false;
    if (dbStore.isBuildNewFile || dbStore.isSaveAs) {
      transmitTextName('');
    } else {
      noticeOpen('已取消!', 1);
    }
  }

  const confirm = () => {
    if (dbStore.isBuildNewFile || dbStore.isSaveAs) {
      transmitTextName(textName.value);
      addTextName.value = false;
      textName.value = ''

    } else if (addAuthor.value) {
      addInf('author', author.value);
      addAuthor.value = false;
      author.value = ''

    } else if (addDescription.value) {
      addInf('description', description.value);
      addDescription.value = false;
      description.value = ''

    } else if (addTextName.value) {
      addInf('fileName', textName.value);
      addTextName.value = false;
      textName.value = ''
      if (dbStore.isBuildNewFile) noticeOpen('已保存', 1);
    }
  }

  const addInf = (key, value) => {
    const targetKeyArray = [key]
    const newValueArray = [value];

    windowApi.useUpdater(dbStore.fileKey, targetKeyArray, newValueArray)
    .then(isSucceed => {
      if (isSucceed && !dbStore.isBuildNewFile) {
        noticeOpen(`编辑成功!`);
      }
    });
  }
</script>

<template>
  <div class="add-upload-inf">
    <div class="inf">
      <div class="inf-header">
        <span>{{ `<<${props.fileName}>>相关编辑` }}</span>
      </div>
      <div class="inf-content">
        <input type="textName" v-show="addTextName" v-model="textName" placeholder="重命名:"/>
        <input type="author" v-show="addAuthor" v-model="author" placeholder="作者:"/>
        <textarea v-show="addDescription" v-model="description" placeholder="描述:"></textarea>
      </div>
      <div class="option">
        <button @click="cancel">取消</button>
        <button @click="confirm">确认</button>
      </div>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .add-upload-inf {
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
    .inf {
      width: 100%;
      height: 100%;
      display: flex;
      z-index: 1;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      position: relative;
      &-header {
        width: 100%;
        span {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.8);
        }
      }
      &-content {
        width: 200px;
        height: 80px;
        input[type=textName] {
          outline: none;
          border: none;
          margin-top: 30px;
          background: transparent;
          border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        }
        input[type=author] {
          outline: none;
          border: none;
          margin-top: 30px;
          background: transparent;
          border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        }
        textarea {
          width: 100%;
          height: 100%;
          outline: none;
          resize: none;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.5);
          border-radius: 5px;
        }
      }
      .option {
        display: flex;
        flex-direction: row;
        align-items: center;
        button {
          width: 50px;
          height: 25px;
          border: 1px solid black;
          color: rgba(0, 0, 0, 0.8);
          border-radius: 5px;
          font: 14px SourceHanSansCN-Bold;
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
    .inf > span {
      width: 60px;
      height: 30px;
      border: 2px solid black;
      border-radius: 10px;
      position: absolute;
      border-top-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .option + span {
      top: 0px;
      right: 0px;
      border-left: none;
      border-bottom: none;
    }
    .inf > span:last-child {
      bottom: 0px;
      left: 0px;
      border-top: none;
      border-right: none;
    }
  }
  .inf-container-out {
    animation: inf-container-out 1s forwards;
  }
  @keyframes inf-container-out {
    0% {width: 300px; height: 150px;}
    50% {width: 300px; height: 0;}
    100% {width: 0; height: 0;}
  }
</style>