export default {
    orderType:{
        unpay: '待付款',
        undeliver: '待发货',
        unreceipt: '待收货',
        unevaluate: '待评价',
        complete: '已完成',
        refund: '退款/售后',
        closure: '交易关闭'
    },
    status:{
        unpay: '待付款',
        undeliver: '待发货',
        unreceipt: '待收货',
        unevaluate: '待评价',
        complete: '已完成',
        refund: '退款/售后',
        closure: '交易关闭'
    },
    selectList:{
        reasonData:[
            {name: '0', value: '拍错了，重新拍'},
            {name: '1', value: '不想要了'},
            {name: '2', value: '商家一直不发货'},
            {name: '3', value: '其它'},
        ],
        reasonData2:[
            {name: '0', value: '实物与商品描述不符'},
            {name: '1', value: '做工问题'},
            {name: '2', value: '错发/漏发'},
            {name: '3', value: '包装/商品破损'},
            {name: '4', value: '假冒品牌'},
            {name: '5', value: '其它'},
        ],
        cancelData:[
            {name: '0', value: '我不想买了'},
            {name: '1', value: '信息填写错误，重新拍'},
            {name: '2', value: '见面交易'},
            {name: '3', value: '其它原因'},
        ],
        serveData:[
            {name: '0', value: '仅退款'},
            {name: '1', value: '退货退款'},
        ],
    },
}