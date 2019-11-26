import axios from '@/utils/request'
import baseURL from '@root/baseurl.config'

// 公共服务
const api = {
  uploadPicture: '/common/v1/uploadFile', // 上传图片
  getBusinessLicenseInfoWithJson: '/common/aiocr/getBusinessLicenseInfoWithJson' // 营业执照识别
  // uploadPicture: 'http://192.168.1.122:1251/common/v1/uploadFile' // 上传图片
}

export default api

const API = (url, method = 'get', params = {}, data = {}) => {
  return axios({
    url,
    method,
    params,
    data
  })
}

// 更新待审批数量
export function updateNumberToApprove (val) {
  let _win = window.parent || window
  _win.postMessage({
    type: 'ring',
    value: val
  }, window.location.origin)
}

/**
 * 查询列表
 * @param {*} params
 */
export function uploadPictureOld (params) {
  return API(api.uploadPicture, 'post', {}, params)
}

export function uploadPicture (params) {
  return axios({
    url: api.uploadPicture,
    method: 'post',
    data: params,
    // processData: false,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getBusinessLicenseInfoWithJson (data) {
  return axios({
    url: api.getBusinessLicenseInfoWithJson,
    method: 'post',
    data: data
    // processData: false,
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
}

export function getCommonBaseUrl (key) {
  return `${baseURL}${api[key]}`
}

/**
 * 获取上传图片地址
 */
export function getUploadPictureUrl () {
  return getCommonBaseUrl('uploadPicture')
}
