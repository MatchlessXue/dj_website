// import { getAllStatusFilter } from '@api/global'
// 列表表格设置
export function getColumns (type) {
  return {
    // 客户信息
    customer: initColumns({
      partnerName: '客户名称',
      // partnerCode: '客户编码',
      // partnerPropertyName: '所属行业',
      partnerPropertyName: '业务类型',
      contactName: '联系人姓名',
      contactMobile: '联系人手机',
      contactTel: '联系人座机号',
      bizStatusName: '客户状态'
    }),
    // 承运商信息
    carrier: initColumns1({
      partnerName: '承运商名称',
      partnerCode: '承运商编码',
      partnerPropertyName: '业务类型',
      bizStatusName: '承运商状态'
    }),
    // 服务商信息
    thirdServer: initColumns({
      partnerName: '服务商名称',
      partnerPropertyName: '服务商类型',
      partnerIndustryName: '服务类型',
      bizStatusName: '状态'
    })
  }[type]
}

// 列表查询配置
export function getQueryConfig (type) {
  return {
    customer: {
      partnerName: '客户名称',
      addBtn: '新增客户'
    },
    carrier: {
      partnerName: '承运商名称',
      addBtn: '新增承运商'
    },
    thirdServer: {
      partnerName: '服务商名称',
      addBtn: '新增服务商'
    }
  }[type]
}

// router名称配置
export function getRouterNames (type) {
  return {
    customer: {
      list: 'partnerCustomer',
      add: 'partnerCustomerAddForm',
      update: 'partnerCustomerUpdateForm',
      detail: 'partnerCustomerDetail'
    },
    carrier: {
      list: 'partnerCarrier',
      add: 'partnerCarrierAddForm',
      update: 'partnerCarrierUpdateForm',
      detail: 'partnerCarrierDetail'
    },
    thirdServer: {
      list: 'partnerThirdServer',
      add: 'partnerThirdServerAddForm',
      update: 'partnerThirdServerUpdateForm',
      detail: 'partnerThirdServerDetail'
    }
  }[type]
}

// 表单基本信息label配置
export function getBasicFormConfig (type) {
  return {
    // 客户信息
    customer: {
      partnerName: '客户名称',
      partnerCode: '客户编码',
      partnerProperty: '客户类型',
      partnerIndustry: '业务类型',
      remark: '备注',
      bizStatus: '状态',
      contactName: '联系人姓名',
      contactMobile: '联系人手机号',
      contactTel: '联系人座机号',
      contactMail: '联系人邮箱'
    },
    // 承运商信息
    carrier: {
      partnerName: '承运商名称',
      partnerCode: '承运商编码',
      partnerProperty: '承运商类型',
      partnerIndustry: '业务类型',
      remark: '备注',
      bizStatus: '状态',
      contactName: '联系人姓名',
      contactMobile: '联系人手机号',
      contactMail: '联系人邮箱'
    },
    // 服务商信息
    thirdServer: {
      partnerName: '服务商名称',
      partnerCode: '服务商编码',
      partnerProperty: '服务商类型',
      partnerIndustry: '服务类型',
      remark: '备注',
      bizStatus: '状态'
    }
  }[type]
}
/**
 * partner类型
 * @param {*} type
 */
export function getPartnerTypes (type) {
  return {
    // 客户信息
    customer: 1,
    // 承运商信息
    carrier: 2,
    // 服务商信息
    thirdServer: 3
  }[type]
}
/**
 * 根据路径获取类型
 * @param {*} self
 */
export function getType (self) {
  const {
    path
  } = self.$route
  return path.includes('customer') ? 'customer' : (path.includes('carrier') ? 'carrier' : 'thirdServer')
}

function initColumns (titles) {
  return [{
    title: titles.partnerName,
    dataIndex: 'partnerName',
    scopedSlots: {
      customRender: 'partnerName'
    }
  },
  // {
  //   title: titles.partnerCode,
  //   dataIndex: 'partnerCode'
  // },
  {
    title: titles.partnerPropertyName,
    dataIndex: 'partnerPropertyName'
  },
  {
    title: titles.contactName,
    dataIndex: 'contactName'
  },
  {
    title: titles.contactMobile,
    dataIndex: 'contactMobile'
  },
  {
    title: titles.contactTel,
    dataIndex: 'contactTel'
  },
  {
    title: titles.bizStatusName,
    dataIndex: 'bizStatus',
    // needTotal: true,
    // filterMultiple: false,
    // filtered: true,
    // sorter: true,
    // // onFilter: (value, record) => console.log('ehllll')
    // filters: getAllStatusFilter(),
    scopedSlots: {
      customRender: 'bizStatus'
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    fixed: 'right',
    scopedSlots: {
      customRender: 'action'
    }
  }
  ]
}

function initColumns1 (titles) {
  return [{
    title: titles.partnerName,
    dataIndex: 'partnerName',
    scopedSlots: {
      customRender: 'partnerName'
    }
  },
  {
    title: titles.partnerCode,
    dataIndex: 'partnerCode'
  },
  {
    title: titles.partnerPropertyName,
    dataIndex: 'partnerPropertyName'
  },
  {
    title: titles.bizStatusName,
    dataIndex: 'bizStatus',
    scopedSlots: {
      customRender: 'bizStatus'
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    fixed: 'right',
    scopedSlots: {
      customRender: 'action'
    }
  }
  ]
}
