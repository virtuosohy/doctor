<script setup>
import {useStore} from "vuex"
import {computed} from "vue"
import {Close} from "@element-plus/icons-vue";
import {useRoute ,useRouter} from "vue-router";

const route = useRoute()
const store = useStore()
const router = useRouter()
const selectMenu = computed(()=>store.state.menu.selectMenu)

const closeTab = (item,index) => {
  store.commit('closeMenu',item)
  //删除的非当前页面
  if(route.path !== item.path){
    return
  }
 const selectMenuData =  selectMenu.value
  //如果删除最后一项
  if(index === selectMenuData.length ){
   //只有一个tag
    if(!selectMenuData.length){
      router.push('/')
    }else{
      //删除最后一项后，跳转到前一项
      router.push(selectMenuData[index - 1].path)
    }
  }else{
    //删除非最后一项，跳转到下一项
    router.push(selectMenuData[index + 1].path)
  }
}
</script>

<template>
<div class="header-container">
  <div class="header-left flex-box">
    <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
    <ul class="flex-box">
      <li v-for="(item,index) in selectMenu"
          :class="{selected :route.path === item.path}"
          :key="item.path"
           class="tab flex-box">
        <el-icon size="12" ><component :is="item.icon"/></el-icon>
        <router-link class="text flex-box" :to="{path: item.path}"> {{item.name}}</router-link>

        <el-icon size="12" class="close" @click="closeTab(item,index)"><Close /></el-icon>
      </li>
    </ul>
  </div>
  <div class="header-right">
    <el-dropdown>
     <div class="el-dropdown-link flex-box">
       <el-avatar
           src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
       />
       <p class="user-name">admin</p>
     </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Action 1</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
        <el-dropdown-item>Action 3</el-dropdown-item>
        <el-dropdown-item disabled>Action 4</el-dropdown-item>
        <el-dropdown-item divided>Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown></div>
</div>
</template>

<style lang="less" scoped>
.flex-box{
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container{
 display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left{
    height: 100%;
    .icon{
      width:45px;
      height:100%
    }
    .icon:hover{
      background-color: #f6f6f6;
      cursor: pointer;
    }
    .tab{
      padding: 0 10px;
      height: 100%;
      .text{
        margin: 0 5px
      }
      .close{
        visibility: hidden;
      }
      &.selected{
        a{
     color: #409eff;
          }
        i{
          color: #409eff;
        }

        background-color: #f5f5f5;
      }
    }
    .tab:hover{
      background-color: #f6f6f6;
      .close{
        visibility: visible;
        cursor: pointer;
        color: #000;
      }
    }
  }
  .header-right{
.user-name{
  margin-left: 10px;
}
  }
}
a{
  height: 100%;
  color:#333;
  font-size:15px
}
</style>
