import pinyin from "../js-pinyin";

export default {
  // 数据处理
  sortArr(List) {
    let letterList = [] // 右边字母列表
    let map = {}
    let regs = /^[A-Z-a-z]$/
    let listName = [] // 除了#的列表
    let liststr = [] // #列表
    List.forEach(item => {
      item.str = pinyin.getFullChars(item.brandName).toUpperCase() // 转换拼音
      item.strA = pinyin.getCamelChars(item.brandName).slice(0, 1).toUpperCase() // 转换拼音首字母
      let strZimu = item.str.slice(0, 1)
      let str = regs.test(strZimu)
      if (str) {
        const key = item.strA
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(item)
        letterList.push(strZimu)
      } else {
        liststr.push(item)
      }// 添加字母
    })
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        listName.push(val)
      }
    }
    listName.sort((a, b) => {
      // return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      return a.title.localeCompare(b.title) // 两种方法
    })
    liststr = liststr.sort((a, b) => {
      return a.strA - b.strA
    }) // #类排序
    letterList = Array.from(new Set(letterList.sort())) // 去重
    // 是否需要#
    if (liststr.length > 0) {
      let obj = {
        title: '#',
        items: liststr
      }
      letterList.push('#')
      listName.push(obj)
    }
    let obj = {
      letterList: letterList,
      brandList: listName
    }
    return obj
  }
}
