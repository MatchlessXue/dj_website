import {
  RouteView
} from '@/components/layouts'
import { ziyuangl } from '@/core/icons'

const resourceChildRouter = [
  // 客户
  {
    path: '/resource/partner/customer',
    name: 'partnerCustomer',
    component: () => import('@/views/resource/partner/PartnerList'),
    meta: {
      title: '客户信息',
      permission: ['resource:custom']
    },
    alwaysShow: true
  },
  // 项目
  {
    path: '/resource/project/project',
    name: 'ProjectList',
    component: () => import('@/views/resource/project/ProjectList'),
    meta: {
      title: '项目信息'
      // permission: ['resource:custom']
    },
    alwaysShow: true
  },
  // 发货方管理
  {
    path: '/resource/siteaddress/send',
    name: 'siteaddressSend',
    component: () => import('@/views/resource/siteAddress/SiteAddressList'),
    meta: {
      title: '发货方管理',
      permission: ['resource:shipper']
    },
    alwaysShow: true
  },
  // 收货方管理
  {
    path: '/resource/siteaddress/receive',
    name: 'siteaddressReceive',
    component: () => import('@/views/resource/siteAddress/SiteAddressList'),
    meta: {
      title: '收货方管理',
      permission: ['resource:receiver']
    },
    alwaysShow: true
  },
  // 货物管理
  {
    path: '/resource/cargo',
    name: 'cargo',
    component: () => import('@/views/resource/cargo/CargoList'),
    meta: {
      title: '货物管理',
      permission: ['resource:cargo']
    },
    alwaysShow: true
  },
  {
    path: '/resource/partner/customer/add',
    name: 'partnerCustomerAddForm',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerForm'),
    meta: {
      title: '新增客户信息',
      permission: ['resource:addcustom']
    }
  },
  {
    path: '/resource/partner/customer/update/:id',
    name: 'partnerCustomerUpdateForm',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerForm'),
    meta: {
      title: '修改客户信息',
      permission: ['resource:modfiycustom']
    }
  },
  {
    path: '/resource/partner/customer/detail/:id',
    name: 'partnerCustomerDetail',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerDetail'),
    meta: {
      title: '客户详细信息',
      permission: ['resource:customdetail']
    }
  },

  // 承运商
  {
    path: '/resource/partner/carrier',
    name: 'partnerCarrier',
    component: () => import('@/views/resource/partner/PartnerList'),
    meta: {
      title: '承运商信息',
      permission: ['resource:carrierinfo']
    },
    alwaysShow: true
  },
  {
    path: '/resource/partner/carrier/add',
    name: 'partnerCarrierAddForm',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerForm'),
    meta: {
      title: '新增承运商信息',
      permission: ['resource:carrieradd']
    }
  },
  {
    path: '/resource/partner/carrier/update/:id',
    name: 'partnerCarrierUpdateForm',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerForm'),
    meta: {
      title: '修改承运商信息',
      permission: ['resource:carriermodify']
    }
  },
  {
    path: '/resource/partner/carrier/detail/:id',
    name: 'partnerCarrierDetail',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerDetail'),
    meta: {
      title: '承运商详细信息',
      permission: ['resource:carrierdetail']
    }
  },
  // 司机
  {
    path: '/resource/driver',
    name: 'driver',
    component: () => import('@/views/resource/driver/DriverList'),
    meta: {
      title: '司机信息',
      permission: ['resource:driverinfo']
    },
    alwaysShow: true
  },
  /* // 服务商管理列表
  {
    path: '/resource/partner/thirdserver',
    name: 'partnerThirdServer',
    component: () => import('@/views/resource/partner/PartnerList'),
    meta: {
      title: '服务商信息',
      permission: ['resource:servicerinfo']
    },
    alwaysShow: true
  },
  {
    path: '/resource/partner/thirdserver/add',
    name: 'partnerThirdServerAddForm',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerForm'),
    meta: {
      title: '新增服务商信息',
      permission: ['resource:serviceradd']
    }
  },
  {
    path: '/resource/partner/thirdserver/update/:id',
    name: 'partnerThirdServerUpdateForm',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerForm'),
    meta: {
      title: '修改服务商信息',
      permission: ['resource:servicermodify']
    }
  },
  {
    path: '/resource/partner/thirdserver/detail/:id',
    name: 'partnerThirdServerDetail',
    hidden: true,
    component: () => import('@/views/resource/partner/PartnerDetail'),
    meta: {
      title: '服务商详细信息',
      permission: ['resource:servicerdetail']
    }
  }, */

  {
    path: '/resource/driver/add',
    name: 'driverAddForm',
    hidden: true,
    component: () => import('@/views/resource/driver/DriverForm'),
    meta: {
      title: '新增司机信息'
      // permission: ['resource:driveradd']
    }
  },
  {
    path: '/resource/driver/update/:id',
    name: 'driverUpdateForm',
    hidden: true,
    component: () => import('@/views/resource/driver/DriverForm'),
    meta: {
      title: '修改司机信息'
      // permission: ['resource:drivermodify']
    }
  },
  {
    path: '/resource/driver/detail/:id',
    name: 'driverDetail',
    hidden: true,
    component: () => import('@/views/resource/driver/DriverDetail'),
    meta: {
      title: '司机详细信息'
      // permission: ['resource:driverdetail']
    }
  },
  // 车辆
  {
    path: '/resource/truck',
    name: 'truck',
    component: () => import('@/views/resource/truck/TruckList'),
    meta: {
      title: '车辆信息',
      permission: ['resource:truckinfo']
    },
    alwaysShow: true
  },
  {
    path: '/resource/truck/add',
    name: 'truckAddForm',
    hidden: true,
    component: () => import('@/views/resource/truck/TruckForm'),
    meta: {
      title: '新增车辆信息',
      permission: ['resource:truckadd']
    }
  },
  {
    path: '/resource/truck/update/:id',
    name: 'truckUpdateForm',
    hidden: true,
    component: () => import('@/views/resource/truck/TruckForm'),
    meta: {
      title: '修改车辆信息',
      permission: ['resource:truckmodify']
    }
  },
  {
    path: '/resource/truck/detail/:id',
    name: 'truckDetail',
    hidden: true,
    component: () => import('@/views/resource/truck/TruckDetail'),
    meta: {
      title: '车辆详细信息',
      permission: ['resource:truckdetail']
    }
  },
  // 合同管理
  {
    path: '/resource/contract',
    name: 'contractManagement',
    component: RouteView,
    meta: {
      title: '合同管理',
      permission: ['resource:contract']
    },
    children: [
      {
        path: '/resource/contract/contractList',
        name: 'contractList',
        component: () => import('@/views/resource/contract/contractList/Index'),
        meta: {
          title: '合同列表',
          permission: ['resource:contract']
        },
        alwaysShow: true
      },
      {
        path: '/resource/contract/roadLineList',
        name: 'roadLineList',
        component: () => import('@/views/resource/contract/roadLineList/Index'),
        meta: {
          title: '线路列表',
          permission: ['resource:contract']
        },
        alwaysShow: true
      }
    ],
    alwaysShow: true
  },
  /*  // 合同编辑
  {
    path: '/resource/contract/ContractForm',
    name: 'ContractForm',
    component: () => import('@/views/resource/contract/ContractForm'),
    meta: {
      title: '合同编辑',
      permission: ['resource:contractedit']
    },
    alwaysShow: false,
    hidden: true
  }, */
  // 合同详细
  {
    path: '/resource/contract/detail/:id?',
    name: 'ContractDetail',
    component: () => import('@/views/resource/contract/ContractDetail'),
    meta: {
      title: '合同详细',
      permission: ['resource:contractdetail']
    },
    alwaysShow: false,
    hidden: true
  },
  /* // 价格文件列表
  {
    path: '/resource/price/list',
    name: 'priceList',
    component: () => import('@/views/resource/price/PriceList'),
    meta: {
      title: '价格管理',
      permission: ['resource:pricelist']
    },
    alwaysShow: true
  },
  // 新增价格文件
  {
    path: '/resource/price/add',
    name: 'priceAddForm',
    component: () => import('@/views/resource/price/PriceForm'),
    meta: {
      title: '新增价格文件',
      permission: ['resource:priceadd']
    },
    alwaysShow: false,
    hidden: true
  },
  // 修改价格文件
  {
    path: '/resource/price/update/:id',
    name: 'priceUpdateForm',
    component: () => import('@/views/resource/price/PriceForm'),
    meta: {
      title: '修改价格文件',
      permission: ['resource:pricemodify']
    },
    alwaysShow: false,
    hidden: true
  },
  // 价格文件详情
  {
    path: '/resource/price/detail/:id',
    name: 'priceDetail',
    component: () => import('@/views/resource/price/PriceDetail'),
    meta: {
      title: '价格文件详情',
      permission: ['resource:pricedetail']
    },
    alwaysShow: false,
    hidden: true
  }, */
  // GPS
  {
    path: '/resource/gps/List',
    name: 'gpsList',
    component: () => import('@/views/resource/gps/List'),
    meta: {
      title: 'GPS设备',
      permission: ['resource:gps']
    },
    alwaysShow: true
  },

  // 中转站管理
  {
    path: '/resource/siteaddress/transfer',
    name: 'siteaddressTransfer',
    component: () => import('@/views/resource/siteTransfer/SiteAddressList'),
    meta: {
      title: '中转站管理',
      permission: ['resource:transfer']
    },
    alwaysShow: true
  }
]

const resourceRouter = [{
  path: '/resource',
  redirect: '/resource/partner/customer',
  component: RouteView,
  meta: {
    title: '资源管理',
    icon: ziyuangl,
    permission: ['resource']
  },
  children: [
    // 客户信息
    ...resourceChildRouter
  ]
}]

export default resourceRouter
