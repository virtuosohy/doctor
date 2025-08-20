<script setup>
import { ref,reactive ,onMounted ,nextTick} from 'vue'
import { userGetMenu ,userSetMenu ,menuList} from "../../../api/index"
import {Plus} from "@element-plus/icons-vue";
import {useRoute} from 'vue-router'

const route = useRoute()
const visible = ref(false)
const treeRef = ref()
const formRef = ref()
//关闭弹窗
const beforeClose = () => {
  visible.value = false
  //重置表单
  formRef.value.resetFields()
  //tree重置
  treeRef.value.setCheckedKeys([4,5])

}

//打开编辑弹窗
const open = (rowData = {}) =>{
    visible.value = true
  //弹窗打开form是异步操作
  nextTick(()=>{
    if(rowData){
   Object.assign(form,{id:rowData.id,name:rowData.name})
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}

//定义列表
const tableData = reactive({
  list:[],
  total:0
})

onMounted(()=>{
  userGetMenu().then(({data}) =>{
    permissionData.value = data.data
  })
  getListData()
})

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})
//点击页码
const handleSizeChange = (val) =>{
  paginationData.pageSize = val
  getListData()
}

//点击当前页
const handleCurrentChange = (val) =>{
  paginationData.pageNum = val
  getListData()
}

//请求列表数据
const getListData =() =>{
    menuList(paginationData).then(({data}) =>{
      const{list, total } = data.data
      tableData.list = list
      tableData.total = total
    })
}
//表单数据
const form = reactive({
   name:"",
   permissions:"",
   id:""
})

//树形结构数据
const permissionData = ref([])

//表单校验逻辑
const rules = reactive({
  name:[{
    required: true,
    trigger: 'blur',
    message: '请输入权限名称'
  }]
})

//表单提交
const confirm = async (formEl)=>{
  if(!formEl) return
  await formEl.validate((valid,fields) =>{
     if(valid){
       const  permissions =  JSON.stringify(treeRef.value.getCheckedKeys())
       userSetMenu({ name:form.name, permissions ,id:form.id }).then(({data}) =>{
         console.log(data)
         //重新获取列表数据
         beforeClose()
         getListData()
       })
     }else{
       console.log('error submit!', fields)
     }
  })
}


</script>

<template>
  <panel-head :route="route" />
  <div class="btn">
    <el-button :icon="Plus" type="primary" size="small" @click="open(null)">新增</el-button>
    </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="昵称"/>
    <el-table-column prop="permissionName" label="菜单权限" width="500px"/>
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
     <el-form-item v-show="false" prop="id">
      <el-input v-model="form.id" />
     </el-form-item>
     <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" placeholder="请填写权限名称" />
     </el-form-item>
     <el-form-item label="权限" prop="permissions">
       <el-tree
           ref="treeRef"
           style="width: 600px"
          :data="permissionData"
           node-key="id"
           show-checkbox
           :default-checked-keys="[4,5]"
           :default-expanded-keys="[4,5]"
       />
     </el-form-item>
   </el-form>
    <template #footer>
      <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.btn{
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
