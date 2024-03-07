<script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['save', 'save-as',]);
  const saveEvent = () => {
    emit('save');
  }
  const saveAsEvent = () => {
    emit('save-as');
  }
</script>

<template>
  <div class="sidebar">
    <button @click="saveEvent">保存</button>
    <button @click="saveAsEvent">另存为</button>
  </div>
</template>

<style scoped lang="scss">
  .sidebar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 4vh;
    button {
      width: 7vw;
      height: 3.5vh;
      font-size: 1vw;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 5px;
      outline: none;
      margin: 0 auto;
      white-space: nowrap;
      background-color: rgba(176, 188, 247, 0.8);
      box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.6), -1px -1px 4px 1px rgba(255, 255, 255, 1);
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
      &:active {
        box-shadow: none;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>