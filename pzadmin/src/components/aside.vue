<script setup>
import treeMenu from "./treeMenu.vue";
const handleOpen = (key, keyPath) => {}
const handleClose = (key, keyPath) => {}
</script>

<template>
  <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
  >
    <p class="logo-lg">XX陪诊</p>
  <treeMenu />
  </el-menu>
</template>

<style lang="less" scoped>
.el-menu-vertical-demo{
  height: 100%;
  .logo-lg{
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
