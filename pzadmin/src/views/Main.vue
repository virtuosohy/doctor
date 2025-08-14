<script setup>
import Aside from "../components/aside.vue"
</script>

<template>
  <div class="common-layout">
    <el-container>
<!--      <el-aside width="200px">Aside</el-aside>-->
      <Aside />
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>




<style lang="less" scoped>
.common-layout{
  height: 100%;
  .el-container{
    height: 100%;
  }
}

</style>
