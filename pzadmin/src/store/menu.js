
const localData =  localStorage.getItem('pz_v3pz')

const state = localData ? localData.menu : {
  isCollapsed: false, // 菜单是否收起
    selectMenu: [],
    routerList:[]
}

const mutations = {
   collapseMenu (state){
state.isCollapsed = !state.isCollapsed
   },
    addMenu(state,payload){
   if(state.selectMenu.findIndex(item=> item.path === payload.path) === -1){
       state.selectMenu.push(payload)
   }
   },
    closeMenu (state, payload) {
        // 找到点击数据的索引
         const index = state.selectMenu.findIndex(val => val.name === payload.name)
        // 通过索引删除数组指定元素
        state.selectMenu.splice(index, 1)
    },
    dynamicMenu(state,payload){

        //通过glob导入文件
       const modules =  import.meta.glob('../views/**/**/*.vue')
        console.log(modules)
        function routerSet(router){
            router.forEach(route =>{
                //判断没有子菜单，拼接路由数据
                if(!route.children){
                   const url = `../views${route.meta.path}/index.vue`
                    route.component = modules[url]
                }else{
                    //如果有子菜单，递归调用
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)
        //拿到完整的路由数据
        state.routerList = payload
    }
}

export default {
    state,
    mutations,
}
