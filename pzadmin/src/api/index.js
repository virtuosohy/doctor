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
