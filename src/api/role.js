import axios from '@/utils/request'

/**
 * 获取角色列表
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*}
 */
export function getRoleListByPage (params) {
  return axios({
    url: '/authcenter/role/list',
    method: 'post',
    params: params
  })
}

/**
 * 获取角色下拉列表
 * params: {
 * }
 * @param params currentPage pageSize
 * @returns {*} /role/listAll
 */
export function getRoleListAll (params) {
  return axios({
    url: '/authcenter/role/listAll',
    method: 'post',
    params: params
  })
}

// /role/delete
/**
 * 删除角色
 * params: {
 *  roleId
 * }
 */
export function deleteRoleById (params) {
  return axios({
    url: '/authcenter/role/delete',
    method: 'delete',
    params: params
  })
}

// 保存角色信息
// 保存角色菜单权限
export function addEditRoleMenuList (params) {
  return axios({
    url: '/authcenter/role/addupdaterole',
    method: 'post',
    data: params
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
// savedepartment
// 保存角色数据权限
export function addEditRoleDepartment (params) {
  return axios({
    url: '/authcenter/role/savedepartment',
    method: 'post',
    data: params
  })
}
