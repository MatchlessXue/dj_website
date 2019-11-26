import axios from '@/utils/request'

/**
 * 获取菜单列表
 * params: {
 * }
 *
 * @returns {*}
 */
export function getMenuList (params) {
  return axios({
    url: '/authcenter/menu/listAll',
    method: 'post',
    params: params
  })
}
