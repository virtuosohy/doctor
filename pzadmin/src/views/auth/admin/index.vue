<script setup>
import { authAdmin ,menuSelectSist ,updateUser } from "../../../api/index"
import { reactive , onMounted ,ref} from 'vue'
import dayjs from 'dayjs'
import {useRoute} from 'vue-router'
import {Clock} from "@element-plus/icons-vue";
import PanelHead from "../../../components/panelHead.vue";
const route = useRoute()
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})
//定义列表
const tableData = reactive({
  list:[],
  total:0
})

//请求列表
const getListData = () =>{
  authAdmin(paginationData).then(({data}) =>{
    console.log(data)
    const {list,total} = data.data
    list.forEach(item =>{
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    tableData.list = list
    tableData.total = total
  })
}
//弹窗可见
const visible = ref(false)

//关闭弹窗方法
const beforeClose = () => {
  visible.value = false
}

//编辑表单
const form = reactive({
  name: '',
  permissions_id: ''
})

//提交规则
const rules = reactive({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  permissions_id: [
    { required: true, message: '请选择权限组别', trigger: 'blur' }
  ]
})
const formRef = ref()
onMounted(() => {
  getListData()
  menuSelectSist().then(({data})=>{
  options.value = data.data
  })
})
const handleSizeChange = (val) =>{
  paginationData.pageSize = val
  getListData()
}

//点击当前页
const handleCurrentChange = (val) =>{
  paginationData.pageNum = val
  getListData()
}
const options = ref([])

//根据id来匹配数据
const permissionName = (id) => {
  const data = options.value.find(el => el.id === id)
  return data ? data.name : '超级管理员'
}

//打开编辑弹窗
const open = (rowData) => {
  visible.value = true
  Object.assign(form,{mobile:rowData.mobile, name: rowData.name, permissions_id: rowData.permissions_id})
}

//提交方法
const confirm = async (formEl) => {
  if(!formEl) return
  await formEl.validate((valid,fields) => {
    if(valid){
  const {name,permissions_id} = form
      updateUser({name,permissions_id}).then(({data})=>{
         if(data.code === 10000){
           visible.value = false
           getListData()
        }
      })
    }else{
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <panel-head :route="route"/>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="昵称"/>

    <el-table-column prop="permissions_id" label="所属组别" >
      <template #default="scope">
            {{permissionName(scope.row.permissions_id)}}
      </template>
    </el-table-column>

    <el-table-column prop="mobile" label="手机号"/>

    <el-table-column prop="active" label="状态" >
      <template #default="scope">
      <el-tag  :type="scope.row.active ? 'success' :'danger'">{{scope.row.active ? '正常' :'失效'}}</el-tag>
      </template>
    </el-table-column>

    <el-table-column  label="创建时间" >
      <template #default="scope">
         <div class="flex-box">
           <el-icon><Clock /></el-icon>
           <span style="margin-left: 10px">{{scope.row.create_time}}</span>
         </div>
      </template>
    </el-table-column>

    <el-table-column  label="操作方式">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        size="small"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
      v-model="visible"
      :before-close="beforeClose"
      tile="添加权限"
      width="500px"
  >
  <el-form
      ref="formRef"
      label-width="120px"
      label.position="left"
      :model="form"
      :rules="rules"
  >
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile" disabled />
    </el-form-item>
    <el-form-item label="昵称" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="菜单权限" prop="permissions_id">
      <el-select
          v-model="form.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 240px"
      >
        <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.flex-box{
  display: flex;
  align-items: center;
}
</style>
