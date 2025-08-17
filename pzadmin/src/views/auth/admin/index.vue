<script setup>
import { authAdmin } from "../../../api/index"
import { reactive , onMounted} from 'vue'
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})

onMounted(() => {
  authAdmin(paginationData).then(({data}) =>{
    console.log(data)
  })
})
</script>

<template>
<div>admin</div>
</template>

<style scoped>

</style>
