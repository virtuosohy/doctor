import request from "../utils/request.js";

//发送验证码
export const getCode = (data) =>{
   return request.post('/get/code',data)
}

export const userAuthentication = (data) =>{
   return request.post('/user/authentication',data)
}

export const login = (data) =>{
   return request.post('/login',data)
}

export const authAdmin = (params) =>{
   return request.get('/auth/admin',{params})
}

export const userGetMenu = () =>{
   return request.get('/user/getmenu')
}

export const userSetMenu = (data) =>{
   return request.post('/user/setmenu',data)
}

export const menuList = (params) =>{
   return request.get('/menu/list' ,{params})
}

//权限列表下拉
export const menuSelectSist = () =>{
   return request.get('/menu/selectlist' )
}

//修改用户信息
export const updateUser = (data) =>{
   return request.post('/update/user',data)
}

//用户菜单权限
export const menuPermissions = () =>{
   return request.get('/menu/permissions' )
}

//陪护师头像
export const photoList = () =>{
   return request.get('/photo/list' )
}

//陪护师创建
export const companion = (data) =>{
   return request.post('/companion',data)
}

//陪护师列表
export const companionList = (params) =>{
   return request.get('/companion/list' ,{params})
}

//删除陪护师
export const deleteCompanion = (data) =>{
   return request.post('/delete/companion',data)
}

//订单列表
export const adminOrder = (params) =>{
   return request.get('/admin/order' ,{params})
}

//修改订单状态
export const updateOrder = (data) =>{
   return request.post('/update/order',data)
}

// 控制台接口
export const getControlData = (params={}) => {
   return request.get('/report', { params })
}
