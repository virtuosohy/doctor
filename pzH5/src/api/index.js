import request from "../utils/request"

export default {
    login(data){
        return request.post('/login',data)
    },
     //首页数据
    index(){
        return request.get('/Index/index')
     },
     //订单详情
     h5Companion(){
        return request.get('/h5/companion')
     },
    createOrder(data){
        return request.post('/createOrder',data)
    },
    orderList(params){
        return request.get('/order/list',{ params })
    },
    //订单详情
    orderDetail(params){
        return request.get('/order/detail',{ params })
    },
}
