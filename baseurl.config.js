// 根据环境配置baseUrl
const env = process.env.NODE_ENV
const title = process.env.VUE_APP_TITLE
let e = 'development'
if (env === 'production') {
  e = title || 'production'
}

let baseUrl = '/api'
// switch (e) {
//   // 本地开发
//   case 'development':
//     baseUrl = '/api'
//     break
//     // 开发环境部署
//   case 'dev':
//     baseUrl = 'http://tms-dev.dj.com/api'
//     break
//     // 测试环境部署
//   case 'test':
//     baseUrl = 'http://tms-uat.dj.com/api'
//     break
//     // 线上环境部署
//   case 'production':
//     baseUrl = 'https://cs.56ctm.com/api'
//     break
// }
console.log('env====', env, title, e, baseUrl)

export default baseUrl
