/**
 * 调度列表列
 */
export const goodsTabCol = [
  {
    title: '运单号',
    dataIndex: 'waybillCode',
    defaultShow: true,
    // fixed: 'left',
    width: 210,
    key: 'waybillCode',
    scopedSlots: { customRender: 'waybillCode' }
  },
  {
    title: '客户单号',
    dataIndex: 'clientCode',
    defaultShow: true,
    width: 150,
    key: 'clientCode'
  },
  {
    title: '项目',
    dataIndex: 'projectName',
    defaultShow: true,
    width: 120,
    key: 'projectName'
  },
  {
    title: '发货城市',
    dataIndex: 'sdCityRgcodeName',
    width: 150,
    key: 'sdCityRgcodeName'
  },
  {
    title: '发货方地址',
    dataIndex: 'departAddress',
    width: 150,
    key: 'departAddress'
  },
  {
    title: '发货方联系人',
    dataIndex: 'sdContact',
    width: 150,
    key: 'sdContact'
  },
  {
    title: '发货方手机号',
    dataIndex: 'sdMobile',
    width: 150,
    key: 'sdMobile'
  },
  {
    title: '当前城市',
    dataIndex: 'departCityRgcodeName',
    defaultShow: true,
    width: 120,
    key: 'departCityRgcodeName'
  },
  {
    title: '中转站',
    defaultShow: true,
    dataIndex: 'station',
    width: 100,
    key: 'station',
    scopedSlots: { customRender: 'station' }
  },
  {
    title: '收货方城市',
    defaultShow: true,
    dataIndex: 'rvCityRgcodeName',
    width: 150,
    key: 'rvCityRgcodeName'
  },
  {
    title: '收货方地址',
    dataIndex: 'rvAddress',
    width: 150,
    key: 'rvAddress'
  },
  {
    title: '收货方联系人',
    dataIndex: 'rvContact',
    width: 150,
    key: 'rvContact'
  },
  {
    title: '收货方手机号',
    dataIndex: 'rvMobile',
    width: 150,
    key: 'rvMobile'
  },
  {
    title: '剩余件数',
    defaultShow: true,
    dataIndex: 'amount',
    width: 100,
    key: 'amount',
    scopedSlots: { customRender: 'amount' }
  },
  {
    title: '剩余重量（kg）',
    defaultShow: true,
    dataIndex: 'weight',
    width: 120,
    key: 'weight',
    scopedSlots: { customRender: 'weight' }
  },
  {
    title: '剩余体积（m³）',
    defaultShow: true,
    dataIndex: 'volume',
    width: 120,
    key: 'volume',
    scopedSlots: { customRender: 'volume' }
  },
  {
    title: '要求提货时间',
    defaultShow: true,
    dataIndex: 'reqDeliveryDate',
    width: 150,
    key: 'reqDeliveryDate',
    scopedSlots: { customRender: 'reqDeliveryDate' }
  },
  {
    title: '要求送达时间',
    defaultShow: true,
    dataIndex: 'reqArrivalDate',
    width: 150,
    key: 'reqArrivalDate',
    scopedSlots: { customRender: 'reqArrivalDate' }
  },
  {
    title: '手工单号',
    dataIndex: 'manual_code',
    width: 100,
    key: 'manual_code'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    key: 'remark'
  },
  {
    title: '操作',
    width: 90,
    dataIndex: 'action',
    defaultShow: true,
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export const lineTabCol = [{
  title: '发货站点',
  dataIndex: 'siteName',
  key: 'siteName'
},
{
  title: '线路',
  dataIndex: 'lineRoad',
  key: 'lineRoad',
  scopedSlots: {
    customRender: 'lineRoad'
  }
},
{
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode'
},
{
  title: '件数',
  dataIndex: 'storedAmount',
  key: 'storedAmount',
  width: 115
},
{
  title: '重量（kg）',
  dataIndex: 'storedWeight',
  key: 'storedWeight',
  width: 115
},
{
  title: '体积（m³）',
  dataIndex: 'storedVolume',
  key: 'storedVolume',
  width: 115
},
{
  title: '要求送达时间',
  dataIndex: 'reqArrivalDate',
  key: 'reqArrivalDate'
}
]

export const deliveryTabCol = [{
  title: '发货站点',
  dataIndex: 'siteName',
  key: 'siteName'
},
{
  title: '收货地址',
  dataIndex: 'rvAddress',
  key: 'rvAddress'
},
{
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode'
},
{
  title: '件数',
  dataIndex: 'storedAmount',
  key: 'storedAmount',
  width: 115
},
{
  title: '重量（kg）',
  dataIndex: 'storedWeight',
  key: 'storedWeight',
  width: 115
},
{
  title: '体积（m³）',
  dataIndex: 'storedVolume',
  key: 'storedVolume',
  width: 115
},
{
  title: '要求送达时间',
  dataIndex: 'reqArrivalDate',
  key: 'reqArrivalDate'
}
]
/**
 * 预调度列表列
 */
const goodsColumns = [{
  title: '发货方地址',
  dataIndex: 'sdAddress',
  key: 'sdAddress'
},
{
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode'
},
{
  title: '计费方式',
  width: 180,
  scopedSlots: {
    customRender: 'charging'
  },
  dataIndex: 'charging',
  key: 'charging'
},
{
  title: '直送',
  width: 70,
  scopedSlots: {
    customRender: 'destination'
  },
  dataIndex: 'destination',
  key: 'destination'
},
{
  title: '收货站点',
  width: 220,
  scopedSlots: {
    customRender: 'rvSite'
  },
  dataIndex: 'rvSite',
  key: 'rvSite'
},
{
  title: '操作',
  key: 'operation',
  width: 70,
  scopedSlots: {
    customRender: 'operation'
  }
}
]

const lineColumns = [{
  title: '发货站点',
  dataIndex: 'siteName',
  key: 'siteName'
}, {
  title: '线路',
  dataIndex: 'lineRoad',
  key: 'lineRoad',
  scopedSlots: {
    customRender: 'lineRoad'
  }
}, {
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode',
  width: '80'
},
{
  title: '计费方式',
  width: 180,
  scopedSlots: {
    customRender: 'charging'
  },
  dataIndex: 'charging',
  key: 'charging'
},
{
  title: '末端配送',
  align: 'center',
  width: 90,
  scopedSlots: {
    customRender: 'destination'
  },
  dataIndex: 'destination',
  key: 'destination'
},
{
  title: '收货站点',
  width: 220,
  scopedSlots: {
    customRender: 'rvSite'
  },
  dataIndex: 'rvSite',
  key: 'rvSite'
},
{
  title: '操作',
  key: 'operation',
  width: 70,
  scopedSlots: {
    customRender: 'operation'
  }
}
]

const deliveryColumns = [{
  title: '发货站点',
  dataIndex: 'siteName',
  key: 'siteName'
},
{
  title: '收货地址',
  dataIndex: 'rvAddress',
  key: 'rvAddress'
},
{
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode'
},
{
  title: '计费方式',
  width: 180,
  scopedSlots: {
    customRender: 'charging'
  },
  dataIndex: 'charging',
  key: 'charging'
},
{
  title: '操作',
  key: 'operation',
  width: 70,
  scopedSlots: {
    customRender: 'operation'
  }
}
]

/**
 * 预调度最终列表列
 */
const finalOperation = [
  {
    title: '匹配合同',
    key: 'contractName',
    dataIndex: 'contractName',
    width: 120,
    scopedSlots: {
      customRender: 'contractName'
    }
  },
  {
    title: '运费(元)',
    key: 'yf',
    dataIndex: 'yf',
    isInput: true,
    width: 100,
    scopedSlots: {
      customRender: 'yf'
    }
  }, {
    title: '提货费(元)',
    key: 'thf',
    dataIndex: 'thf',
    isInput: true,
    width: 100,
    scopedSlots: {
      customRender: 'thf'
    }
  }, {
    title: '送货费(元)',
    key: 'shf',
    dataIndex: 'shf',
    isInput: true,
    width: 100,
    scopedSlots: {
      customRender: 'shf'
    }
  }, {
    title: '卸货费(元)',
    key: 'xhf',
    dataIndex: 'xhf',
    isInput: true,
    width: 100,
    scopedSlots: {
      customRender: 'xhf'
    }
  }, {
    title: '其他费用(元)',
    key: 'fjf',
    dataIndex: 'fjf',
    isInput: true,
    width: 120,
    scopedSlots: {
      customRender: 'fjf'
    }
  }, {
    title: '合计费用(元)',
    key: 'summaryCharge',
    dataIndex: 'summaryCharge',
    isInput: true,
    width: 120,
    scopedSlots: {
      customRender: 'summaryCharge'
    }
  }]

const goodsColumnsFinal = [{
  title: '发货方地址',
  dataIndex: 'sdAddress',
  key: 'sdAddress'
},
{
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode'
},
...finalOperation
]

const lineColumnsFinal = [{
  title: '发货站点',
  dataIndex: 'siteName',
  key: 'siteName'
},
{
  title: '线路',
  scopedSlots: {
    customRender: 'lineRoad'
  },
  dataIndex: 'lineRoad',
  key: 'lineRoad'

},
{
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode'
},
...finalOperation
]

const deliveryColumnsFinal = [{
  title: '发货站点',
  dataIndex: 'siteName',
  key: 'siteName'
},
{
  title: '收货地址',
  dataIndex: 'rvAddress',
  key: 'rvAddress'
},
{
  title: '运单号',
  dataIndex: 'waybillCode',
  key: 'waybillCode'
},
...finalOperation
]
/**
 * 预调度展开内表列
 */
const innerColumns = [{
  title: '货物名称',
  dataIndex: 'consignmentName',
  key: 'consignmentName'
},
{
  title: '货物类型',
  dataIndex: 'consignmentTypeName',
  key: 'consignmentTypeName'
},
{
  title: '货物包装',
  dataIndex: 'packageTypeName',
  key: 'packageTypeName'
},
{
  title: '重量（kg）',
  dataIndex: 'storedWeight',
  key: 'storedWeight',
  scopedSlots: {
    customRender: 'storedWeight'
  }
},
{
  title: '体积（m³）',
  dataIndex: 'storedVolume',
  key: 'storedVolume',
  scopedSlots: {
    customRender: 'storedVolume'
  }
},
{
  title: '件数',
  scopedSlots: {
    customRender: 'storedAmount'
  },
  dataIndex: 'storedAmount',
  key: 'storedAmount'
}
]

export {
  innerColumns
}

export function getColumns (type) {
  return {
    goods: goodsColumns,
    line: lineColumns,
    delivery: deliveryColumns,
    goodsfinal: goodsColumnsFinal,
    linefinal: lineColumnsFinal,
    deliveryfinal: deliveryColumnsFinal
  }[type]
}
