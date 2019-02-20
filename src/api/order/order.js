import ajax from '../ajax'
import url from '../url'

export default {
    historyList(param){
        return ajax.post({
            data:param,
            url:url.order.historyList
        })
    },
    pre(param){
        return ajax.post({
            data:param,
            url:url.order.pre
        })
    },
    historyRemove(param){
        return ajax.post({
            data:param,
            url:url.order.historyRemove
        })
    },
    list(param){
        return ajax.post({
            data:param,
            url:url.order.list
        })
    },
    logisticsInfo(param){
        return ajax.post({
            data:param,
            url:url.order.logisticsInfo
        })
    },
    orderDetail(param){
        return ajax.post({
            data:param,
            url:url.order.orderDetail
        })
    },
    deleted(param){
        return ajax.post({
            data:param,
            url:url.order.deleted
        })
    },
    receipt(param){
        return ajax.post({
            data:param,
            url:url.order.receipt
        })
    },
    cance(param){
        return ajax.post({
            data:param,
            url:url.order.cance
        })
    },
    refunds(param){
        return ajax.post({
            data:param,
            url:url.order.refunds
        })
    },
    refundsList(param){
        return ajax.post({
            data:param,
            url:url.order.refundsList
        })
    },
    refundsDetail(param){
        return ajax.post({
            data:param,
            url:url.order.refundsDetail
        })
    },
    refundsMoney(param){
        return ajax.post({
            data:param,
            url:url.order.refundsMoney
        })
    }
}
