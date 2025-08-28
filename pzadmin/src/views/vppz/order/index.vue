<script setup>
import {adminOrder,updateOrder} from '../../../api/index.js'
import { InfoFilled,Delete} from "@element-plus/icons-vue";
import {useRoute} from 'vue-router'
import {onMounted, reactive,ref} from 'vue'
import dayjs from "dayjs";

const route = useRoute()
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

  onMounted(()=>{
    getListData()
  })

const statusSet = (key) => {
  const obj = {
    '已取消': 'info',
    '待支付': 'warning',
    '已完成': 'success'
  }
  return obj[key]
}

const getListData = (params = {}) => {
  adminOrder({...paginationData,...params}).then(({data}) =>{
    const {list,total} = data.data
    tableData.list = list
    tableData.total = total
  })
}

const handleSizeChange = (val) =>{
  paginationData.pageSize = val
  getListData()
}

//点击当前页
const handleCurrentChange = (val) =>{
  paginationData.pageNum = val
  getListData()
}

const confirmEvent = (id) => {
  updateOrder({id}).then(({data}) =>{
    if(data.code === 10000){
      getListData()
    }
  })
}

const searchForm = reactive({
  out_trade_no:''
})

const onSubmit = () => {
  console.log(searchForm)
  getListData(searchForm)
}
</script>

<template>
  <panel-head :route="route" />
  <div class="form">
    <el-form :inline="true" :model="searchForm">
      <el-form-item prop="out_trade_no">
        <el-input v-model="searchForm.out_trade_no" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData.list">
    <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
    <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
    <el-table-column prop="service_name" label="就诊服务"></el-table-column>
    <el-table-column  label="陪护师头像">
      <template #default="scope">
        <el-image
        style="width:40px ;height:40px"
        :src="scope.row.companion.avatar"/>
      </template>
    </el-table-column>
    <el-table-column label="陪护师手机号" width="120">
      <template #default="scope">
        {{ scope.row.companion.mobile }}
      </template>
    </el-table-column>
    <el-table-column label="总价" prop="price" />
    <el-table-column label="已付" prop="paidPrice" />
    <el-table-column label="下单时间" prop="order_start_time" width="120" >
      <template #default="scope">
        {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-tag :type="statusSet(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="接单状态" prop="service_state" />
    <el-table-column label="联系人手机号" prop="tel" width="120"/>
    <el-table-column label="接单状态" prop="service_state" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-popconfirm
              v-if="scope.row.trade_state === '待服务'"
              width="220"
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="是否确定完成?"
              @confirm="confirmEvent(scope.row.out_trade_no)"
          >
            <template #reference>
              <el-button  type="primary" link>服务完成</el-button>
            </template>
          </el-popconfirm>
          <el-button v-else type="primary" link disabled>暂无服务</el-button>
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
</template>

<style scoped>
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
