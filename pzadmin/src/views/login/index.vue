<script setup>
import { ref,reactive,computed,toRaw} from 'vue'
import{useStore} from  "vuex"
import {getCode} from "../../api/index"
import {userAuthentication ,login, menuPermissions} from "../../api/index"
import {useRouter} from "vue-router"
import {UserFilled ,Lock} from "@element-plus/icons-vue";
const router = useRouter()
const store = useStore()
const imgUrl = new URL("../../../public/login-head.png",import.meta.url).href
const routerList = computed(() =>store.state.menu.routerList)
//切换表单（0表示登录，1表示注册）
const formType = ref(0)
const handleChange = () =>{
  formType.value = formType.value ? 0 : 1
}

//表单初识值
const loginForm = reactive({
  userName: "",
  passWord:"",
  validCode:""
})

//发送短信倒计时
const countdown = reactive({
  validText: "获取验证码",
  time: 60,
})

//账号校验
const validateUser = (rule,value,callback)=> {
   //账号不为空
   if(value === ''){
     return callback(new Error('请输入账号'))
   }else{
     const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
     phoneReg.test(value) ? callback() : callback(new Error('请输入正确的手机号'))
   }
}

//密码校验
const validatepass = (rule,value,callback)=> {
  //密码不为空
  if(value === ''){
    return callback(new Error('请输入密码'))
  }else{
    const passReg = /^[a-zA-Z0-9]{6,16}$/
    passReg.test(value) ? callback() : callback(new Error('请输入6-16位数字或字母'))
  }
}

//表单验证
const rules = reactive({
  userName: [{
    validator:validateUser,
    trigger: 'blur'
  }],
  passWord:[{
    validator:validatepass,
    trigger: 'blur'
  }]
})
let  disabled = false
const countdownChange = () =>{
  if(disabled) return
  //判断手机号是否真确
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if(!loginForm.userName ||!phoneReg.test(loginForm.userName) ){
    return ElMessage({
      message: "请输入正确的手机号",
      type: "warning",
    })
  }
  const time = setInterval(() =>{
    if(countdown.time <= 0){
      countdown.validText = "获取验证码"
      countdown.time = 60
      disabled = false
      clearInterval(time)
    }else{
      countdown.time--
      countdown.validText = "剩余" + countdown.time + "s"
    }
  },1000)
  disabled = true
  getCode({tel:loginForm.userName}).then(({data}) => {
     if(data.code === 10000){
       ElMessage.success("发送成功")
     }
  })
}
const loginFormRef = ref()
//提交表单
const submit = async (formEl) => {
  if (!formEl) return
  //手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!',loginForm)
      //注册页面
      if(formType.value){
        userAuthentication(loginForm).then(({data}) =>{
          if(data.code === 10000){
           ElMessage.success("注册成功")
            formType.value = 0
          }
        })
      }else{
        //登录
        login(loginForm).then(({data}) =>{
          if(data.code === 10000){
            ElMessage.success("登录成功")
            //将token和用户信息缓存浏览器
            localStorage.setItem('pz_token',data.data.token)
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo) )
            menuPermissions().then(({data}) =>{
               store.commit('dynamicMenu',data.data)
              toRaw(routerList.value).forEach(item =>{
                router.addRoute('main',item)
              })
              router.push('/')
            })

          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" >
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange" >{{formType ? '注册账号' :'登录'}}</el-link>
      </div>
      <el-form
          ref="loginFormRef"
          :model="loginForm"
          style="max-width: 600px"
          class="demo-ruleForm"
          :rules="rules">
        <el-form-item prop="userName" >
          <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
        </el-form-item>
        <el-form-item prop="passWord" >
          <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock" ></el-input>
        </el-form-item>
        <el-form-item prop="validCode" v-if="formType">
          <el-input v-model="loginForm.validCode"  placeholder="验证码" :prefix-icon="Lock" >
            <template #append>
              <span @click="countdownChange">{{ countdown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submit(loginFormRef)">{{formType ? '注册' : '登录'}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0
}
.login-container {
  height: 100%;
  .card-header{
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
