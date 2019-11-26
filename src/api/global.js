/**
 * 静态变量
 */
const globalMap = {
  statusEnable: 100, // 启用状态
  componyCode: 101, // 公司编码 101:公司 102：个人 103：其他
  personCode: 102, // 个人 101:公司 102：个人 103：其他
  transportType_zc: 2, // 运输类型-整车

  settlementStyle_yj: 1, // 结算方式-月结
  settlementStyle_xf: 2, // 结算方式-现付
  settlementStyle_df: 3 // 结算方式-到付
}

export { globalMap }

// 获取对象的使用状态 （启用，停用），前端维护
export function getAllStatus () {
  return [
    { code: 100, name: '启用' },
    { code: 101, name: '停用' }
  ]
}

/**
 * 用于tablefilter
 */
export function getAllStatusFilter () {
  return [
    // { text: '全部', value: '0' },
    { text: '启用', value: '100' },
    { text: '停用', value: '101' }
  ]
}
