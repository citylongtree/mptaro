import type from "./type";

export default {
    getOrderType(key){
        return type.orderType[key]
    },
    getDetailstatus(key){
        return type.status[key]
    },
    getselectList(key){
        switch(key){
            case 'reasonData':
            return type.selectList.reasonData
            break
            case 'reasonData2':
            return type.selectList.reasonData2
            break
            case 'cancelData':
            return type.selectList.cancelData
            break
            case 'serveData':
            return type.selectList.serveData
            break
        }  
    }
}