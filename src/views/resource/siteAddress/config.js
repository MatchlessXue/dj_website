// 列表表格设置
export function getColumns (type) {
  return {
    // 发货方
    send: initColumns({
      partnerName: '客户名称',
      // externalCode: '外部编号',
      siteName: '发货方名称',
      addressArea: '发货方区域',
      address: '发货方地址',
      contact: '发货方联系人',
      mobile: '发货方手机号',
      tel: '发货方座机号'
    }),
    // 收货方
    receive: initColumns({
      partnerName: '客户名称',
      // externalCode: '外部编号',
      siteName: '收货方名称',
      addressArea: '收货方区域',
      address: '收货方地址',
      contact: '收货方联系人',
      mobile: '收货方手机号',
      tel: '收货方座机号'
    })
  }[type]
}

// 列表查询配置
export function getQueryConfig (type) {
  return {
    send: {
      siteName: '发货方名称',
      address: '发货方地址',
      queryAdcode: '发货方区域',
      addBtn: '新增发货方'
    },
    receive: {
      siteName: '收货方名称',
      address: '收货方地址',
      queryAdcode: '收货方区域',
      addBtn: '新增收货方'
    }
  }[type]
}

// router名称配置
export function getRouterNames (type) {
  return {
    send: {
      list: 'siteaddressSend'
    },
    receive: {
      list: 'siteaddressReceive'
    }
  }[type]
}

// 表单基本信息label配置
export function getBasicFormConfig (type) {
  return {
    // 发货方
    send: {
      title: '发货方',
      partnerName: '客户名称',
      // externalCode: '外部编号',
      siteName: '发货方名称',
      adcode: '发货方区域',
      address: '发货方地址',
      longitude: '经度',
      latitude: '纬度',
      contact: '发货方联系人',
      mobile: '发货方手机号',
      relatedMobile: '关联手机号',
      tel: '发货方座机号',
      remark: '备注'
    },
    // 收货方
    receive: {
      title: '收货方',
      partnerName: '客户名称',
      // externalCode: '外部编号',
      siteName: '收货方名称',
      adcode: '收货方区域',
      address: '收货方地址',
      longitude: '经度',
      latitude: '纬度',
      contact: '收货方联系人',
      mobile: '收货方手机号',
      relatedMobile: '关联手机号',
      tel: '收货方座机号',
      remark: '备注'
    }
  }[type]
}
/**
 * partner类型
 * @param {*} type
 */
export function getSitTypes (type) {
  return {
    // 发货方信息
    send: 1,
    receive: 2,
    transfer: 3
  }[type]
}
/**
 * 根据路径获取类型
 * @param {*} self
 */
export function getType (self) {
  const { path } = self.$route
  console.log('path==', path)
  return path.includes('send') ? 'send' : (path.includes('receive') ? 'receive' : 'transfer')
}

function initColumns (titles) {
  return [
    {
      title: titles.partnerName,
      dataIndex: 'partnerName',
      // width: 120,
      scopedSlots: { customRender: 'partnerName' }
    },
    // {
    //   title: titles.externalCode,
    //   dataIndex: 'externalCode'
    // },
    {
      title: titles.siteName,
      // width: 120,
      dataIndex: 'siteName',
      scopedSlots: { customRender: 'siteName' }
    },
    {
      title: titles.addressArea,
      // width: 160,
      dataIndex: 'addressArea'
    },
    {
      title: titles.address,
      // width: 160,
      dataIndex: 'address'
    },
    {
      title: titles.contact,
      // width: 130,
      dataIndex: 'contact'
    },
    {
      title: titles.mobile,
      // width: 130,
      dataIndex: 'mobile'
    },
    {
      title: titles.tel,
      // width: 130,
      dataIndex: 'tel'
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 160,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
}
