import axios from '@/utils/request'
// import axios from '@/utils/dj-request'
/**
 * login func
 * params: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 *     type: 0账户密码登录   1手机号登录
 * }
 * @param params
 * @returns {*}
 */
export function login (params) {
  let resUrl = params.type ? '/authcenter/user/mobilelogin' : '/authcenter/user/login'
  return axios({
    url: resUrl,
    method: 'post',
    params: params
  })
}

export function getSmsCaptcha (params) {
  return axios({
    url: '/authcenter/user/mobilevcode',
    method: 'post',
    params: params
  })
}

export function getInfo () {
  return axios({
    url: '/authcenter/user/accountinfo',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: '/authcenter/user/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
