// 订单详情基本设置
export const baseInfo = {
  orderId: '订单号',
  transportWay: '运输方式',
  clientName: '客户名称',
  carLong: '车长',
  clientNumber: '客户单号',
  carType: '车辆类型'
}
export const labelNameConfig = {
  // 基本信息

  baseInfo: {
    orderId: '订单号',
    transportWay: '运输方式',
    clientName: '客户名称',
    carLong: '车长',
    clientNumber: '客户单号',
    carType: '车辆类型'
  },
  // 发货方
  send: {
    GoodName: '发货方名称',
    MobilePhone: '发货方手机号',
    Area: '发货区域',
    Address: '发货方地址',
    Contact: '发货方联系人',
    Phone: '发货方座机号：',
    DefineArea: '自定义区'

  },
  // 收货方
  receive: {
    GoodName: '收货方名称',
    MobilePhone: '收货方手机号',
    Area: '收货区域',
    Address: '收货方地址',
    Contact: '收货方联系人',
    Phone: '收货方座机号：',
    DefineArea: '自定义区'
  }

}

// 表单值
export const labelValueConfig = {

  // 基本信息
  baseInfo: {
    orderId: '',
    transportWay: '',
    clientName: '',
    carLong: '车长',
    clientNumber: '',
    carType: ''
  },
  // 发货方
  send: {
    GoodName: '',
    MobilePhone: '',
    Area: '',
    Address: '',
    Contact: '',
    Phone: '',
    DefineArea: ''

  },
  // 收货方
  receive: {
    GoodName: '',
    MobilePhone: '',
    Area: '',
    Address: '',
    Contact: '',
    Phone: '',
    DefineArea: ''
  }

}

// 货物信息 table 名称
export const cargoInfo = {
  num: { title: '序号' },
  cargo: { title: '货物名称' },
  cargoCode: { title: '货物代码' },
  cargoPackage: { title: '货物包装' },
  cargpType: { title: '货物类型' },
  cargoNumber: { title: '件数' },
  weigth: { title: '重量' },
  volume: { title: '体积（m）' },
  totalWay: { title: '计价方式' },
  price: { title: '单价' },
  freight: { title: '运费' },
  freightid: { title: '交货单号' },
  remark: { title: '备注' }

}

// 时间信息
export const timeLabelInfo = {
  requestTime: '要求提货时间',
  timeKeep: '时效',
  checktime: '托运时间'
}

// 回单信息
export const backOrder = {
  type: '回单类型',
  number: '回单份数',
  time: '要求返回时间',
  total: '合计',
  totalway: ''

}

export const chargeInfo = {
  name: '费用名称',
  costnumber: '费用金额',
  cargocost: '提货费',
  total: '合计',
  totalway: '计价方式',
  price: '单价',
  costway: '现付',
  monthway: '月结',
  delayway: '缓付',
  freight: '到付'
}
export const submitForm = {
  'accountId': 'string',
  'bizStatusName': 'string',
  // 'businessIncomes': [
  //   {
  //     'currency': 'CNY',
  //     'incomeAmount': 0,
  //     'incomeId': '',
  //     'incomeType': 0,
  //     'incomeTypeName': 'string'
  //   }
  // ],
  'clientCode': '',
  'consignments': [
    // {
    //   'consignmentCode': '',
    //   'consignmentId': '',
    //   'consignmentName': 'string',
    //   'consignmentType': '',
    //   'consignmentTypeName': 'string',
    //   'consignmentValue': 0,
    //   'currency': 'string',
    //   'deliveryCode': 'string',
    //   'orderAmount': '',
    //   'orderVolume': '',
    //   'orderWeight': '',
    //   'packageType': '',
    //   'packageTypeName': 'string',
    //   'remark': 'string',
    //   'totalPrice': 0
    // }
  ],

  'currency': 'CNY',

  'manualCode': '',
  'partnerId': '',
  'partnerName': '',
  'projectId': '',
  'projectName': '',
  'priceUnit': 0,
  'priceUnitName': 'string',
  'receiptAmount': '',
  'receiptType': '',
  'receiptTypeName': 'string',
  'receiver': 'string',
  'recepitDate': '',
  'recepitStatus': '',
  'remark': 'string',
  'reqArrivalDate': '',
  'reqDeliveryDate': '',
  'reqReturnDate': '',
  'returnAccountName': 'string',
  'returnDate': '',
  'rvAddress': '',

  'rvCityRgcode': '',
  'rvContact': '',
  'rvCustomArea': 1,
  'rvCustomAreaName': 'string',
  'rvDistrictRgcode': '',
  'rvId': '',

  'rvMobile': '',
  'rvName': '',
  'rvNationCode': 86,
  'rvProvinceRgcode': '',
  'rvStreetRgcode': '',
  'rvTel': '',
  'sdAddress': '',
  // 'sdAddressArea': 'string',
  'sdCityRgcode': '',
  'sdContact': '',
  'sdCustomArea': 1,
  'sdCustomAreaName': 'string',
  'sdDistrictRgcode': '',
  'sdId': '',
  'sdMobile': '',
  'sdName': '',
  'sdNationCode': '',
  'sdProvinceRgcode': '',
  'sdStreetRgcode': '',
  'sdTel': '',
  'settlementArrival': '',
  'settlementCurrent': '',
  'settlementMonth': '',

  'timeLimit': '',
  'totalAmount': '',
  'totalValue': '',
  'totalVolume': '',
  'totalWeight': '',
  'transportDate': '',
  'transportType': '',
  'transportTypeName': 'string',
  'truckLength': '',
  'truckLengthName': 'string',
  'truckLoad': '',
  'truckType': '',
  'truckTypeName': 'string',
  'unitPrice': '',
  'upstreamTenantId': 'string',
  'waybillCode': '',
  'waybillId': ''
}
