<script setup>
import { ref ,reactive, onMounted,nextTick} from 'vue'
import {Plus, Check, Clock, InfoFilled,Delete} from "@element-plus/icons-vue";
import {photoList ,companion,companionList ,deleteCompanion} from "../../../api/index"
import {ElMessage} from "element-plus";
import {useRoute} from 'vue-router'
import dayjs from "dayjs";
import PanelHead from "../../../components/panelHead.vue";
const visible = ref(false)
const route = useRoute()
//头像
const ImgVisible = ref(false)
const fileList = ref([])
const selectIndex =  ref(0)

onMounted(()=>{
  photoList().then(({data}) =>{
       fileList.value = data.data
  })
  getListData()
})

//分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})
//定义列表
const tableData = reactive({
  list:[],
  total:0
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

//调用列表方法
const getListData = () => {
  companionList(paginationData).then(({data}) =>{
    const {list,total} = data.data
    list.forEach(item =>{
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    tableData.list = list
    tableData.total = total
  })
}


//关闭弹窗
const beforeClose = () => {
  visible.value = false
  formRef.value.resetFields()
}

const confirm = async (formEl)=>{
  if(!formEl) return
  await formEl.validate((valid,fields) =>{
    if(valid){
      companion(form).then(({data}) => {
        if(data.code === 10000){
          ElMessage.success("成功")
          beforeClose()
          getListData()
        }else{
          ElMessage.error(data.message)
        }
      })
    }else{
      console.log('error submit!', fields)
    }
  })
}

//确认图片
const confirmImage =  ()=>{
 form.avatar =  fileList.value[selectIndex.value].url
  ImgVisible.value = false
}

//删除人员
const confirmEvent = () =>{
if (!selectTableData.value.length){
      return ElMessage.warning('请选择要删除的数据')
   }
  deleteCompanion({id:selectTableData.value}).then(({data}) =>{
    if(data.code === 10000){
        ElMessage.success("成功")
        getListData()
      }else{
        ElMessage.error(data.message)
      }
  })
}

//多选函数
const handleSelectionChange = (val) =>{
  selectTableData.value = val

}
const selectTableData = ref([])
const open = (rowData={}) =>{
  visible.value = true
  nextTick(() =>{
    //如果是编辑
    if(rowData){
      Object.assign(form,rowData)
    }
  })
}
const formRef = ref()
const form = reactive({
  id: '',
  mobile: '',
  active:1,
  age:18,
  avatar:'',
  name:'',
  sex:'',
})

const rules = reactive({
  name:[{ required: true, message: '请输入昵称', trigger: 'blur' }],
  avatar:[{ required: true, message: '请选择头像'}],
  sex:[{ required: true, message: '请选择性别',trigger: 'change' }],
  mobile:[{ required: true, message: '请输入手机号', trigger: 'blur' }]
})
</script>

<template>
  <panel-head :route="route"/>
  <div class="btn">
    <el-button :icon="Plus" type="primary" size="small" @click="open(null)">新增</el-button>
    <el-popconfirm
        width="220"
        confirm-button-text="是"
        cancel-button-text="否"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="是否确定删除?"
        @confirm="confirmEvent"
    >
      <template #reference>
        <el-button :icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-table :data="tableData.list" style="width: 100%"  @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="昵称"/>
    <el-table-column  label="头像">
      <template #default="scope">
       <el-image
       style="width:50px ;height:50px"
       :src="scope.row.avatar"
       />
      </template>
    </el-table-column>

    <el-table-column prop="sex" label="性别">
      <template #default="scope">
      {{ scope.row.sex === '1' ? "男" : "女" }}
      </template>
    </el-table-column>

    <el-table-column prop="mobile" label="手机号"/>

    <el-table-column prop="active" label="状态">
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
      tile="添加陪护师"
      width="500px"
  >
   <el-form
       ref="formRef"
       label-width="120px"
       label.position="left"
       :model="form"
       :rules="rules"
   >
     <el-form-item  v-show="false"  prop="id">
       <el-input v-model="form.id" />
     </el-form-item>

     <el-form-item  label="昵称" prop="name">
       <el-input v-model="form.name" placeholder="输入昵称" />
     </el-form-item>

     <el-form-item  label="头像" prop="avatar">
       <el-button v-if="!form.avatar" type="primary" @click="ImgVisible = true">点击上传</el-button>
       <el-image
        v-else
        :src="form.avatar"
        style="width: 100px; height: 100px"
       />
     </el-form-item>

     <el-form-item  label="性别" prop="sex">
       <el-select v-model="form.sex"  placeholder="请选择性别">
           <el-option label="男" value="1" />
            <el-option label="女" value="2" />
       </el-select>
     </el-form-item>

     <el-form-item  label="年龄" prop="age">
       <el-input-number v-model="form.age" :min="18" :max="65"  />
     </el-form-item>

     <el-form-item  label="手机号" prop="mobile">
       <el-input v-model="form.mobile" placeholder="请输入手机号" />
     </el-form-item>

     <el-form-item  label="是否生效" prop="active">
       <el-radio-group v-model="form.active" >
         <el-radio :value="0" >失效</el-radio>
         <el-radio :value="1" >生效</el-radio>
       </el-radio-group>
     </el-form-item>
   </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
      v-model="ImgVisible"
      :before-close="beforeClose"
      tile="选择图片"
      width="680px"
  >
  <div class="image-list">
     <div v-for="(item,index) in fileList" :key="item.name" class="img-box" @click="selectIndex = index">
       <div v-if="selectIndex === index" class="select">
         <el-icon color="#fff"><Check /></el-icon>
       </div>
     <el-image
     style="width:150px;height:150px;"
     :src="item.url"
     />
     </div>
  </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button  @click="ImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.btn {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.flex-box{
  display: flex;
  align-items: center;
}
</style>
