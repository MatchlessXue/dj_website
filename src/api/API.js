
import axios from '@/utils/request'
import qs from 'qs' // https://www.npmjs.com/package/qs

// const toType = obj => {
//   return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
// }

const filterNull = o => {
  // for (let key in o) {
  //   if (o[key] == null) {
  //     delete o[key]
  //   }
  //   if (toType(o[key]) === 'string') {
  //     o[key] = o[key].trim()
  //     if (o[key] === '') {
  //       delete o[key]
  //     }
  //   } else if (toType(o[key]) === 'object') {
  //     o[key] = filterNull(o[key])
  //   } else if (toType(o[key]) === 'array') {
  //     o[key] = filterNull(o[key])
  //   }
  // }
  return o
}

const API = (url, method = 'get', params = {}, data = {}) => {
  params = filterNull(params)
  data = filterNull(data)
  return axios({
    url,
    method,
    params,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    },
    indices: false,
    data
  })
}

export default API

/**
qs.stringify({ a: [1, 2, 3 ] }, { arrayFormat: 'indices' });
//  'a[0]=1&a[1]=2&a[2]=3'

qs.stringify( { a: [1, 2, 3 ]} , { arrayFormat: 'brackets' });
//  'a[]=1&a[]=2&a[]=3'

qs.stringify( {a: [1, 2, 3 ]}, { arrayFormat: 'repeat' } );
//  'a=1&a=2&a=3'
 */
