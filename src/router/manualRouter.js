
const manualChildRouter = [{
  path: 'workbench',
  name: 'ManualWorkbench',
  component: () => import('@/views/manual/Workbench')
}, {
  path: 'employerAuth',
  name: 'ManualEmployerAuth',
  component: () => import('@/views/manual/EmployerAuth')
}, {
  path: 'employerInfo',
  name: 'ManualEmployerInfo',
  component: () => import('@/views/manual/EmployerInfo')
}, {
  path: 'addRole',
  name: 'ManualAddRole',
  component: () => import('@/views/manual/AddRole')
}, {
  path: 'addDepartment',
  name: 'ManualAddDepartment',
  component: () => import('@/views/manual/AddDepartment')
}, {
  path: 'AddAccount',
  name: 'ManualAddAccount',
  component: () => import('@/views/manual/AddAccount')
}, {
  path: 'AddCustomer',
  name: 'ManualAddCustomer',
  component: () => import('@/views/manual/AddCustomer')
}, {
  path: 'AddCarrier',
  name: 'ManualAddCarrier',
  component: () => import('@/views/manual/AddCarrier')
}, {
  path: 'AddFacilitator',
  name: 'ManualAddFacilitator',
  component: () => import('@/views/manual/AddFacilitator')
}, {
  path: 'AddDriver',
  name: 'ManualAddDriver',
  component: () => import('@/views/manual/AddDriver')
}, {
  path: 'AddVehicle',
  name: 'ManualAddVehicle',
  component: () => import('@/views/manual/AddVehicle')
}, {
  path: 'AddCargo',
  name: 'ManualAddCargo',
  component: () => import('@/views/manual/AddCargo')
}, {
  path: 'AddContract',
  name: 'ManualAddContract',
  component: () => import('@/views/manual/AddContract')
}, {
  path: 'AddPrice',
  name: 'ManualAddPrice',
  component: () => import('@/views/manual/AddPrice')
}, {
  path: 'AddGPSEquipment',
  name: 'ManualAddGPSEquipment',
  component: () => import('@/views/manual/AddGPSEquipment')
}, {
  path: 'AddSender',
  name: 'ManualAddSender',
  component: () => import('@/views/manual/AddSender')
}, {
  path: 'AddReceiver',
  name: 'ManualAddReceiver',
  component: () => import('@/views/manual/AddReceiver')
}, {
  path: 'AddFreightStation',
  name: 'ManualAddFreightStation',
  component: () => import('@/views/manual/AddFreightStation')
}, {
  path: 'AddOrder',
  name: 'ManualAddOrder',
  component: () => import('@/views/manual/AddOrder')
}, {
  path: 'UpdateWaybill',
  name: 'ManualUpdateWaybill',
  component: () => import('@/views/manual/UpdateWaybill')
}, {
  path: 'LineRoadDispatch',
  name: 'ManualLineRoadDispatch',
  component: () => import('@/views/manual/LineRoadDispatch')
}, {
  path: 'LookAtDispatch',
  name: 'ManualLookAtDispatch',
  component: () => import('@/views/manual/LookAtDispatch')
}, {
  path: 'OnWayTracking',
  name: 'ManualOnWayTracking',
  component: () => import('@/views/manual/OnWayTracking')
}, {
  path: 'RegisterReceipt',
  name: 'ManualRegisterReceipt',
  component: () => import('@/views/manual/RegisterReceipt')
}, {
  path: 'SenderSigning',
  name: 'ManualSenderSigning',
  component: () => import('@/views/manual/SenderSigning')
}, {
  path: 'ReceiptOut',
  name: 'ManualReceiptOut',
  component: () => import('@/views/manual/ReceiptOut')
}, {
  path: 'ConsignorSigning',
  name: 'ManualConsignorSigning',
  component: () => import('@/views/manual/ConsignorSigning')
}, {
  path: 'CustomerSettlement',
  name: 'ManualCustomerSettlement',
  component: () => import('@/views/manual/CustomerSettlement')
}, {
  path: 'DriverSettlement',
  name: 'ManualDriverSettlement',
  component: () => import('@/views/manual/DriverSettlement')
}, {
  path: 'CarrierSettlement',
  name: 'ManualCarrierSettlement',
  component: () => import('@/views/manual/CarrierSettlement')
}
]

export default manualChildRouter
