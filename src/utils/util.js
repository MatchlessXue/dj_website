// import { notEqual } from 'assert'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9
    ? '早上好'
    : hour <= 11
      ? '上午好'
      : hour <= 13
        ? '中午好'
        : hour < 20
          ? '下午好'
          : '晚上好'
}

export function welcome () {
  const arr = [
    '休息一会儿吧',
    '准备吃什么呢?',
    '要不要打一把 DOTA',
    '我猜你可能累了'
  ]
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

/**
 * 线性数据转化为树
 * @param {Object} data 源数据
 * @param {Object} idkey 节点id标识
 */
export function arrayToTree (data, idkey) {
  var tree = []
  let roots = []
  let nodes = []
  // 判断是否有多个根节点
  for (let item of data) {
    if (item.parentId === '' || !item.parentId) {
      roots.push(item)
    } else {
      nodes.push(item)
    }
  }

  function toTree (list, parentId) {
    let itemTrees = []
    for (let item of list) {
      if (item.parentId === parentId) {
        var temp = toTree(list, item[idkey])
        if (temp.length > 0) {
          item.children = temp
        }
        itemTrees.push(item)
      }
    }
    return itemTrees
  }
  // // 遍历根节点 生成该节点的树结构放到数组中
  for (let root of roots) {
    root.children = toTree(nodes, root.departmentId)
    tree.push(root)
  }
  return tree
}

/**
 * 线性数据转化为树 部门数据生成simpletreeData
 * @param {Object} data 源数据
 * @param {Object} idkey 节点id标识
 */
export function arrayToTreeNode (data) {
  // { id: 2, pId: 1, value: '2', title: 'test2' },
  var treeArr = []
  for (let item of data) {
    let itemTmp = {}
    itemTmp.id = item.departmentId
    itemTmp.value = item.departmentId
    itemTmp.pId = item.parentId
    itemTmp.label = item.departmentName
    treeArr.push(itemTmp)
  }
  return treeArr
}

// menulist 转化成树状节点
/**
 * 线性数据转化为树
 * @param {Object} data 源数据
 * @param {Object} idkey 节点id标识
 */
export function menuToTreeNode (data, idkey) {
  var tree = []
  let roots = []
  let nodes = []
  // 判断是否有多个根节点
  for (let item of data) {
    let itemTmp = {}
    itemTmp.key = item[idkey]
    itemTmp.title = item.menuName
    itemTmp.parentId = item.parentId
    itemTmp.icon = item.icon
    // 如果是菜单管理tree  则首页的复选框禁止取消勾选
    if (itemTmp.title === '首页' && idkey === 'menuId') {
      itemTmp.disableCheckbox = true
      itemTmp.selectable = false
    }

    if (itemTmp.parentId === '' || !itemTmp.parentId || itemTmp.parentId === '0') {
      roots.push(itemTmp)
    } else {
      nodes.push(itemTmp)
    }
  }
  function toTree (list, parentId) {
    let itemTrees = []
    for (let item of list) {
      if (item.parentId === parentId) {
        var temp = toTree(list, item.key)
        if (temp.length > 0) {
          item.children = temp
        }
        itemTrees.push(item)
      }
    }
    return itemTrees
  }

  // 查看roots
  console.log('查看roots', roots)

  // // 遍历根节点 生成该节点的树结构放到数组中
  for (let root of roots) {
    root.children = toTree(nodes, root.key)
    tree.push(root)
  }
  return tree
}

// 字符串（逗号隔开）转成数组，并把数据转成int
export function strToArrayInt (str) {
  let arr = str.trim().split(',')
  arr = arr.map(val => {
    return parseInt(val, 10)
  })
  return arr
}

// 获取列的宽度总和
export function countCollumnsWidth (columns) {
  let colW = 0
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i]
    colW += col.width || 80
  }
  return colW
}

// 省市区的数组转成对象
export function getRegionInfo (adcode = []) {
  if (!adcode) return {}
  const region = {}
  for (let i = 0; i < adcode.length; i++) {
    const el = adcode[i]
    if (el) {
      i === 0 && (region.provinceRgcode = el) // 省
      i === 1 && (region.cityRgcode = el) // 市
      i === 2 && (region.districtRgcode = el) // 区
      i === 3 && (region.streetRgcode = el) // 街道
    }
  }
  return region
}
// 省市区变为数组
export function getRegionInfoArr (region = []) {
  if (!region) return []
  const arr = []
  if (region.provinceRgcode) {
    // 省
    arr.push(region.provinceRgcode)
    if (region.cityRgcode) {
      // 市
      arr.push(region.cityRgcode)
      if (region.districtRgcode) {
        // 区
        arr.push(region.districtRgcode)
        if (region.streetRgcode) {
          // 街道
          arr.push(region.streetRgcode)
        }
      }
    }
  }
  return arr
}
// 深度复制对象
export function deepClone (data) {
  var obj
  if (data instanceof Array) {
    obj = []
  } else if (data instanceof Object) {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (data instanceof Array) {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (data instanceof Object) {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
// 将form 表值填入的时候。如果值为空。设置为underfined

export function formatValue (data) {
  var obj
  if (data instanceof Array) {
    obj = []
  } else if (data instanceof Object) {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (data instanceof Array) {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(formatValue(data[i]))
    }
  } else if (data instanceof Object) {
    for (var key in data) {
      if (data[key] === '' || data[key] === 'null' || data[key] === null) {
        obj[key] = undefined
      } else {
        obj[key] = formatValue(data[key])
      }
    }
  }
  return obj
}

/* *
用途：js中字符串超长作固定长度加省略号（...）处理
参数说明：
   str:需要进行处理的字符串，可含汉字
   len:需要显示多少个汉字，两个英文字母相当于一个汉字。
*/
export function beautySub (str, len) {
  var reg = /[\u4e00-\u9fa5]/g
  // 专业匹配中文

  var slice = str.substring(0, len)

  var chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length))

  var realen = slice.length * 2 - chineseCharNum
  return str.substr(0, realen) + (realen < str.length ? '...' : '')
}
