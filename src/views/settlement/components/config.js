
import {
  getCostCheckList as getCostCheckList1,
  addSettlement as addSettlement1,
  waybillPageWithFee as waybillPageWithFee1,
  updateCoordinateList as updateCoordinateList1,
  checkCoordinateDetail as checkCoordinateDetail1,
  updataSettlement as updataSettlement1,
  reqCoordinateList as reqCoordinateList1,
  adjustDocument as adjustDocument1,
  openbankDetail as openbankDetail1,
  openbankUpdate as openbankUpdate1,
  openbankDetele as openbankDetele1,
  addDetail as addDetail1,
  paymentDetail as paymentDetail1,
  paymentUpdate as paymentUpdate1,
  addWaybillList as addWaybillList1

} from '@/api/settlement/customer'

import {
  getCostCheckList as getCostCheckList2,
  addSettlement as addSettlement2,
  waybillPageWithFee as waybillPageWithFee2,
  updateCoordinateList as updateCoordinateList2,
  checkCoordinateDetail as checkCoordinateDetail2,
  updataSettlement as updataSettlement2,
  reqCoordinateList as reqCoordinateList2,
  adjustDocument as adjustDocument2,
  openbankDetail as openbankDetail2,
  openbankUpdate as openbankUpdate2,
  openbankDetele as openbankDetele2,
  addDetail as addDetail2,
  paymentDetail as paymentDetail2,
  paymentUpdate as paymentUpdate2,
  addWaybillList as addWaybillList2,
  enterSettlement as enterSettlement2
} from '@/api/settlement/carrier'

import {
  getCostCheckList as getCostCheckList3,
  addSettlement as addSettlement3,
  waybillPageWithFee as waybillPageWithFee3,
  updateCoordinateList as updateCoordinateList3,
  checkCoordinateDetail as checkCoordinateDetail3,
  updataSettlement as updataSettlement3,
  reqCoordinateList as reqCoordinateList3,
  adjustDocument as adjustDocument3,
  openbankDetail as openbankDetail3,
  openbankUpdate as openbankUpdate3,
  openbankDetele as openbankDetele3,
  addDetail as addDetail3,
  paymentDetail as paymentDetail3,
  paymentUpdate as paymentUpdate3,
  addWaybillList as addWaybillList3,
  enterSettlement as enterSettlement3
} from '@/api/settlement/driver'

const config = {
  // 结算对象类型 1:客户，2:承运商 3:司机 4:服务商
  // 1:客户
  1: {
    getCostCheckList: getCostCheckList1, // 费用盘点
    addSettlement: addSettlement1, // 新增结算单接口
    waybillPageWithFee: waybillPageWithFee1, // 获取列表数据接口
    updateCoordinateList: updateCoordinateList1, // 更新协同结算单
    updataSettlement: updataSettlement1, // 更新客户结算单
    reqCoordinateList: reqCoordinateList1, // 协同结算单列表
    checkCoordinateDetail: checkCoordinateDetail1, // 对账结算单详情
    adjustDocument: adjustDocument1, // 结算单调差
    addWaybillList: addWaybillList1, // 新增删除结算单

    openbankDetail: openbankDetail1, // 查询开票详情
    openbankUpdate: openbankUpdate1, // 添加开票信息
    openbankDetele: openbankDetele1, // 删除开票信息
    addDetail: addDetail1, // 查询添加开票详情
    paymentDetail: paymentDetail1, // 客户结算单出纳详情
    paymentUpdate: paymentUpdate1 // 添加出纳信息
  },
  // 2:承运商
  2: {
    getCostCheckList: getCostCheckList2, // 费用盘点
    addSettlement: addSettlement2, // 新增结算单接口
    waybillPageWithFee: waybillPageWithFee2, // 获取列表数据接口
    updateCoordinateList: updateCoordinateList2, // 更新协同结算单
    updataSettlement: updataSettlement2, // 更新客户结算单
    reqCoordinateList: reqCoordinateList2, // 协同结算单列表
    checkCoordinateDetail: checkCoordinateDetail2, // 对账结算单详情
    adjustDocument: adjustDocument2, // 结算单调差
    addWaybillList: addWaybillList2, // 新增删除结算单

    openbankDetail: openbankDetail2, // 查询开票详情
    openbankUpdate: openbankUpdate2, // 添加开票信息
    openbankDetele: openbankDetele2, // 删除开票信息
    addDetail: addDetail2, // 查询添加开票详情
    paymentDetail: paymentDetail2, // 客户结算单出纳详情
    paymentUpdate: paymentUpdate2, // 添加出纳信息
    enterSettlement: enterSettlement2
  },
  // 3:司机
  3: {
    getCostCheckList: getCostCheckList3, // 费用盘点
    addSettlement: addSettlement3, // 新增结算单接口
    waybillPageWithFee: waybillPageWithFee3, // 获取列表数据接口
    updateCoordinateList: updateCoordinateList3, // 更新协同结算单
    updataSettlement: updataSettlement3, // 更新客户结算单
    reqCoordinateList: reqCoordinateList3, // 协同结算单列表
    checkCoordinateDetail: checkCoordinateDetail3, // 对账结算单详情
    adjustDocument: adjustDocument3, // 结算单调差
    addWaybillList: addWaybillList3, // 新增删除结算单

    openbankDetail: openbankDetail3, // 查询开票详情
    openbankUpdate: openbankUpdate3, // 添加开票信息
    openbankDetele: openbankDetele3, // 删除开票信息
    addDetail: addDetail3, // 查询添加开票详情
    paymentDetail: paymentDetail3, // 客户结算单出纳详情
    paymentUpdate: paymentUpdate3, // 添加出纳信息
    enterSettlement: enterSettlement3
  }
}

export default config
