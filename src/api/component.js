import axios from '@/utils/request'

/**
 * 获取所有权限组件
 * params: {
 * }
 *
 * @returns {*}
 */
export function getComponentList () {
  return axios({
    url: '/authcenter/component/listAll',
    method: 'post'
    // params: params
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
    params: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
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

export function modifyPassword (params) {
  return axios({
    url: '/authcenter/accounts/modifyPassword',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: params
  })
}
