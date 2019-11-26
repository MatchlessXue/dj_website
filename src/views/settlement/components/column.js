// 运单列表表头
const willbillColumns = [

  {
    title: '运单号',
    dataIndex: 'waybillCode',
    key: 'waybillCode',
    width: 100,
    fixed: 'left',
    scopedSlots: { customRender: 'waybillCode' }
  },
  {
    title: '客户单号',
    dataIndex: 'partnerName',
    key: 'partnerName',
    width: 100
  },
  {
    title: '发货方名称',
    dataIndex: 'sdName',
    key: 'sdName',
    width: 180
  },
  {
    title: '发货区域',
    dataIndex: 'sdAddressArea',
    key: 'sdAddressArea',
    width: 150
  },
  {
    title: '收货方名称',
    dataIndex: 'rvName',
    key: 'rvName',
    width: 180
  },
  {
    title: '收货区域',
    dataIndex: 'rvAddressArea',
    key: 'rvAddressArea',
    width: 150
  },

  {
    title: '收货方地址',
    dataIndex: 'rvAddress',
    key: 'rvAddress',
    width: 180
  },
  {
    title: '件数',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 100
  },

  {
    title: '重量(kg)',
    dataIndex: 'totalWeight',
    key: 'totalWeight',
    width: 100
  },
  {
    title: '体积(m³)',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    width: 100
  },
  {
    title: '运费',
    dataIndex: 'feeTrans',
    key: 'feeTrans',
    width: 100
  },
  {
    title: '提货费',
    dataIndex: 'feeGet',
    key: 'feeGet',
    width: 100
  },
  {
    title: '送货费',
    dataIndex: 'feeSend',
    key: 'feeSend',
    width: 100
  },
  {
    title: '装卸费',
    dataIndex: 'feeStevedoring',
    key: 'feeStevedoring',
    width: 100
  },
  {
    title: '月结',
    dataIndex: 'settlementMonth',
    key: '',
    width: 100
  },
  {
    title: '现付',
    dataIndex: 'settlementCurrent',
    key: 'settlementCurrent',
    width: 100
  },
  {
    title: '到付',
    dataIndex: 'settlementArrival',
    key: 'settlementArrival',
    width: 100
  },
  {
    title: '费用总计',
    dataIndex: 'totalValue',
    key: 'totalValue',
    width: 100
  },
  {
    title: '结算金额',
    dataIndex: 'settlementFee',
    key: 'settlementFee',
    width: 100
  }
]

// 运单列表表头
export const columns = willbillColumns

// 调度单列表
// export const dispatchColumns = (() => {
//   let columns = [...willbillColumns]
//   columns[0] = {
//     title: '调度单号',
//     dataIndex: 'waybillCode',
//     key: 'waybillCode',
//     width: 100,
//     fixed: 'left',
//     scopedSlots: { customRender: 'waybillCode' }
//   }
//   return columns
// })()
export const dispatchColumns = [

  {
    title: '调度单号',
    dataIndex: 'dispatchCode',
    key: 'dispatchCode',
    width: 100,
    fixed: 'left',
    scopedSlots: { customRender: 'dispatchCode' }
  },
  {
    title: '车牌号',
    dataIndex: 'plateNumber',
    key: 'plateNumber',
    width: 100
  },
  {
    title: '司机姓名',
    dataIndex: 'driverName',
    key: 'driverName',
    width: 180
  },
  {
    title: '司机手机号',
    dataIndex: 'mobile',
    key: 'mobile',
    width: 150
  },
  {
    title: '运输方式',
    dataIndex: 'transportTypeName',
    key: 'transportTypeName',
    width: 180
  },

  {
    title: '件数',
    dataIndex: 'amount',
    key: 'amount',
    width: 100
  },

  {
    title: '重量(kg)',
    dataIndex: 'weight',
    key: 'weight',
    width: 100
  },
  {
    title: '体积(m³)',
    dataIndex: 'volume',
    key: 'volume',
    width: 100
  },
  {
    title: '运费',
    dataIndex: 'yf',
    key: 'yf',
    width: 100
  },
  {
    title: '提货费',
    dataIndex: 'thf',
    key: 'thf',
    width: 100
  },
  {
    title: '送货费',
    dataIndex: 'shf',
    key: 'shf',
    width: 100
  },
  {
    title: '装卸费',
    dataIndex: 'xhf',
    key: 'xhf',
    width: 100
  },
  {
    title: '月结',
    dataIndex: 'settlementMonth',
    key: '',
    width: 100
  },
  {
    title: '现付',
    dataIndex: 'settlementCurrent',
    key: 'settlementCurrent',
    width: 100
  },
  {
    title: '到付',
    dataIndex: 'settlementArrival',
    key: 'settlementArrival',
    width: 100
  },
  {
    title: '费用总计',
    dataIndex: 'sumSettlement',
    key: 'sumSettlement',
    width: 100
  },
  {
    title: '结算金额',
    dataIndex: 'settlementFee',
    key: 'settlementFee',
    width: 100
  }
]

// 调差
// 表头
export const checkColumn = [

  {
    title: '运单号',
    dataIndex: 'waybillCode',
    key: 'waybillCode',
    width: 100,
    fixed: 'left',
    scopedSlots: { customRender: 'waybillCode' }
  },
  {
    title: '客户单号',
    dataIndex: 'partnerName',
    key: 'partnerName',
    width: 100
  },
  {
    title: '发货方名称',
    dataIndex: 'sdName',
    key: 'sdName',
    width: 180
  },
  {
    title: '发货区域',
    dataIndex: 'sdAddressArea',
    key: 'sdAddressArea',
    width: 150
  },
  {
    title: '收货方名称',
    dataIndex: 'rvName',
    key: 'rvName',
    width: 180
  },
  {
    title: '收货区域',
    dataIndex: 'rvAddressArea',
    key: 'rvAddressArea',
    width: 150
  },

  {
    title: '收货方地址',
    dataIndex: 'rvAddress',
    key: 'rvAddress',
    width: 180
  },
  {
    title: '件数',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: 100
  },

  {
    title: '重量(kg)',
    dataIndex: 'totalWeight',
    key: 'totalWeight',
    width: 100
  },
  {
    title: '体积(m³)',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    width: 100
  },
  {
    title: '运费',
    dataIndex: 'feeTrans',
    key: 'feeTrans',
    width: 100
  },
  {
    title: '提货费',
    dataIndex: 'feeGet',
    key: 'feeGet',
    width: 100
  },
  {
    title: '送货费',
    dataIndex: 'feeSend',
    key: 'feeSend',
    width: 100
  },
  {
    title: '装卸费',
    dataIndex: 'feeStevedoring',
    key: 'feeStevedoring',
    width: 100
  },
  {
    title: '月结',
    dataIndex: 'settlementMonth',
    key: 'settlementMonth',
    width: 100
  },
  {
    title: '现付',
    dataIndex: 'settlementCurrent',
    key: 'settlementCurrent',
    width: 100
  },
  {
    title: '到付',
    dataIndex: 'settlementArrival',
    key: 'settlementArrival',
    width: 100
  },
  {
    title: '费用总计',
    dataIndex: 'totalValue',
    key: 'totalValue',
    width: 100
  },
  {
    title: '差额合计',
    dataIndex: 'tunedTotalMoney',
    key: 'tunedTotalMoney',
    width: 100
  },
  {
    title: '对账备注',
    dataIndex: 'tunedRemark',
    key: 'tunedRemark',
    width: 100
  },
  {
    title: '结算金额',
    dataIndex: 'settlementFee',
    key: 'settlementFee',
    width: 100
  },

  {
    title: '操作',
    width: 110,
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
export function renderContent (value, row, index) {
  const obj = {
    children: value,
    attrs: {}
  }
  if (index === 4) {
    obj.attrs.colSpan = 0
  }
  return obj
};
// 费用明细的表头
export const CostDetailHead = [
  {
    title: '运单号',
    dataIndex: 'waybillCode',
    key: 'waybillCode',
    width: '100'
  },
  {
    title: '费用名称',
    dataIndex: 'typeName',
    key: 'typeName',
    width: '100'
  },
  {
    title: '费用金额',
    dataIndex: 'money',
    key: 'money',
    width: '100'
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: '100'
  },
  {
    title: '创建人',
    dataIndex: 'createAccountName',
    key: 'createAccountName',
    width: '100'
  }
]

// 开票明细表头
export const InvoiceHead = [
  {
    title: '发票名称',
    dataIndex: 'invoiceTypeName',
    key: 'invoiceTypeName',
    width: '100'
  },
  {
    title: '公司名称',
    dataIndex: 'coopCompanyName',
    key: 'coopCompanyName',
    width: '100'
  },
  {
    title: '统一社会信用',
    dataIndex: 'creditCode',
    key: 'creditCode',
    width: '100'
  },
  {
    title: '账号',
    dataIndex: 'bankAccount',
    key: 'bankAccount',
    width: '100'
  },
  {
    title: '开户行',
    dataIndex: 'bankName',
    key: 'bankName',
    width: '100'
  },
  {
    title: '发票编号',
    dataIndex: 'invoiceCode',
    key: 'invoiceCode',
    width: '100'
  },
  {
    title: '开票金额',
    dataIndex: 'invoiceMoney',
    key: 'invoiceMoney',
    width: '100'
  },
  {
    title: '联系人',
    dataIndex: 'contactName',
    key: 'contactName',
    width: '100'
  },
  {
    title: '联系人电话',
    dataIndex: 'mobile',
    key: 'mobile',
    width: '100'
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address',
    width: '100'
  },
  {
    title: '图片信息',
    dataIndex: 'invoiceUrl',
    key: 'invoiceUrl',
    width: '100',
    scopedSlots: { customRender: 'invoiceUrl' }
  }
]
// 结算明细表头
export const SettlementDetailsHead = [
  {
    title: '支付方式',
    dataIndex: 'payMothodName',
    key: 'payMothodName',
    width: '100'
  },
  {
    title: '支付金额',
    dataIndex: 'payMoney',
    key: 'payMoney',
    width: '100'
  },
  {
    title: '支付账号',
    dataIndex: 'payerAccount',
    key: 'payerAccount',
    width: '100'
  },
  {
    title: '要求付款时间',
    dataIndex: 'payDate',
    key: 'payDate',
    width: '100'
  },
  {
    title: '收款银行',
    dataIndex: 'payeeBankName',
    key: 'payeeBankName',
    width: '100'
  },
  {
    title: '收款公司',
    dataIndex: 'payeeCompany',
    key: 'payeeCompany',
    width: '100'
  },
  {
    title: '联系人',
    dataIndex: 'payee',
    key: 'payee',
    width: '100'
  },
  {
    title: '备注',
    dataIndex: 'payRemark',
    key: 'payRemark',
    width: '100'
  }
]
/**
 * 发出结算单 和 接收结算单的column
 */
export const coordinateTable = [
  {
    title: '结算单号',
    dataIndex: 'documentCode',
    key: 'documentCode',
    width: '100',
    scopedSlots: { customRender: '' }

  },
  {
    title: '结算单名称',
    dataIndex: 'documentName',
    key: 'documentName',
    width: '',
    scopedSlots: { customRender: '' }

  },
  {
    title: '结算类型',
    dataIndex: 'objectType',
    key: 'objectType',
    width: '',
    scopedSlots: { customRender: '' }

  },
  {
    title: '结算对象',
    dataIndex: 'partnerName',
    key: 'partnerName',
    width: '150',
    scopedSlots: { customRender: '' }

  },
  {
    title: '结算金额',
    dataIndex: 'totalMoney',
    key: 'totalMoney',
    width: '150',
    scopedSlots: { customRender: '' }

  },
  {
    title: '结算账期',
    dataIndex: 'settlementPeriod',
    key: 'settlementPeriod',
    width: '150',
    scopedSlots: { customRender: '' }

  },
  {
    title: '要求开票日期',
    dataIndex: 'reqInvoiceDate',
    key: 'reqInvoiceDate',
    width: '180',
    scopedSlots: { customRender: '' }

  },
  {
    title: '单据份数',
    dataIndex: 'waybillCount',
    key: 'waybillCount',
    width: '150',
    scopedSlots: { customRender: '' }

  },
  {
    title: '结算状态',
    dataIndex: 'settlementCoopStatusName',
    key: 'settlementCoopStatusName',
    width: '150',
    scopedSlots: { customRender: '' }

  },
  {
    title: '结算备注',
    dataIndex: 'remark',
    key: 'remark',
    width: '150',
    scopedSlots: { customRender: '' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '',
    scopedSlots: { customRender: 'action' }
  }
]
