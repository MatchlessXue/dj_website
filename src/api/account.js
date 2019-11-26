import axios from '@/utils/request'

/**
 * 获取部门全部账户 --- 租户
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*}
 */
export function getDepAccountsList (params) {
  return axios({
    url: '/authcenter/department/getdepaccounts',
    method: 'post',
    params: params
  })
}

/**
 * 获取部门全部账户 --- 用户
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*}
 */
export function getDepAccountsListUser (params) {
  return axios({
    url: '/authcenter/department/child/account',
    method: 'post',
    params: params
  })
}
/**
 * 获取部门列表 --- 租户
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*}
 */
export function getPartList (params) {
  return axios({
    url: '/authcenter/department/selectAll',
    method: 'post',
    params: params
  })
}
/**
 * 获取部门列表 --- 用户
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*}
 */
export function getPartListUser (params) {
  return axios({
    url: '/authcenter/department/child',
    method: 'post',
    params: params
  })
}
/**
 * 获取账户列表
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*}
 */
export function getAccountList (params) {
  return axios({
    url: '/authcenter/accounts/selectByPage',
    method: 'post',
    params: params
  })
}

/**
 * 新增修改账户
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*}
 */
export function addEditAccount (params) {
  return axios({
    url: '/authcenter/accounts/addorupd',
    method: 'post',
    data: params
  })
}
/**
 * 删除账户
 * params: {
 * }
 * accountId
 * @param params currentPage pageSize
 * @returns {*}
 */
export function deleteAccountById (params) {
  return axios({
    url: '/authcenter/accounts/delete',
    method: 'delete',
    params: params
  })
}
/**
 * 重置密码
 * params: {
 * }
 * accountId
 * @param params currentPage pageSize
 * @returns {*}
 */
export function resetPasswordsById (params) {
  return axios({
    url: '/authcenter/accounts/resetPasswords',
    method: 'POST',
    params: params
  })
}

// 新增修改部门节点
export function addEditPartNode (params) {
  return axios({
    url: '/authcenter/department/addorupd',
    method: 'post',
    data: params
  })
}

// 删除部门节点
export function deletePartNode (params) {
  return axios({
    url: '/authcenter/department/delete',
    method: 'delete',
    params: params
  })
}

// roleDepartment/addorupd
export function addEditRoleDepartment (params) {
  return axios({
    url: '/authcenter/roleDepartment/addorupd',
    method: 'post',
    data: params
  })
}
export function modifyPassword (params) {
  return axios({
    url: '/authcenter/accounts/modifyPassword',
    method: 'post',
    params: params
  })
}

// 绑定手机发送验证码
export function getupdateMobileSendMsg (params) {
  return axios({
    url: '/authcenter/accounts/updateMobileSendMsg',
    method: 'post',
    params: params
  })
}

// 修改绑定手机
export function modifyMobile (params) {
  return axios({
    url: '/authcenter/accounts/modifyMobile',
    method: 'post',
    params: params
  })
}

// export function getInfo () {
//   return axios({
//     url: '/authcenter/user/accountinfo',
//     method: 'get',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }

// export function logout () {
//   return axios({
//     url: '/authcenter/user/logout',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }

// 公司相关
export function companyCertification (params) { // 公司认证
  return axios({
    url: '/authcenter/company/certification',
    method: 'post',
    params: params
  })
}

export function queryCompanysByPage (data) { // 分页获取所有公司信息
  return axios({
    url: '/authcenter/company/selectByPage',
    method: 'post',
    data: data
  })
}

export function companyAudit (data) { // 公司信息审核
  return axios({
    url: '/authcenter/company/audit',
    method: 'post',
    data: data
  })
}

export function companyAuditReject (data) { // 公司信息审核驳回
  return axios({
    url: '/authcenter/company/audit/reject',
    method: 'post',
    data: data
  })
}

export function companyReject (params) { // 公司信息审核-驳回
  return axios({
    url: '/authcenter/company/turndown',
    method: 'post',
    params: params
  })
}

export function getTenantList (params) { // 获取所有租户信息
  return axios({
    url: '/authcenter/company/getCompanyForPlant',
    method: 'get',
    params: params
  })
}

export function getCompanyDetail (params) { // 获得公司信息
  return axios({
    url: '/authcenter/company/detail',
    method: 'get',
    params: params
  })
}

export function getCompanyUpdate (data) { // 修改公司信息
  return axios({
    url: '/authcenter/company/update',
    method: 'post',
    data: data
  })
}

export function getCompanyUpdatelogo (data) { // 修改公司信息
  return axios({
    url: '/authcenter/company/update/logo',
    method: 'post',
    data: data
  })
}
