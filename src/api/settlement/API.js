import api from '../API'

const API = (url, method = 'get', params = {}, data = {}) => {
  if (url === '/settle/customer/summary/page') {
    url = `/order${url}`
  } else if (url === '/settle/carrier/summary/page') {
    url = `/order${url}`
  } else if (url === '/settle/driver/summary/page') {
    url = `/order${url}`
  } else {
    url = `/settle${url}`
  }
  return api(url, method, params, data)
}

export default API
