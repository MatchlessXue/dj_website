import api from '../API'

const API = (url, method = 'get', params = {}, data = {}) => {
  url = `/dataio${url}`
  return api(url, method, params, data)
}

export default API
