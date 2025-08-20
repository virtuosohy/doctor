<script setup>
import {useRouter} from "vue-router";
import treeMenu from "./treeMenu.vue";
import {reactive ,computed} from "vue"
import { useStore } from 'vuex'
const store = useStore();
const router = useRouter();
// const menuDate =  reactive(router.options.routes[0].children);
const menuData = computed(() => store.state.menu.routerList);
const isCollapse = computed(() => store.state.menu.isCollapsed);
const handleOpen = (key, keyPath) => {}
const handleClose = (key, keyPath) => {}

</script>

<template>
  <el-menu
      :style="{width: !isCollapse ?'230px' :'64px' }"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
  >
    <p class="logo-lg">{{isCollapse ? 'xx' : "xx陪诊"}}</p>
  <treeMenu :index="1" :menuDate="menuData"/>
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
