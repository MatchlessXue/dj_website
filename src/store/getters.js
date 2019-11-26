const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  accountAlertShow: state => state.user.accountAlertShow,
  accountAlertMsg: state => state.user.accountAlertMsg,
  phoneAlertShow: state => state.user.phoneAlertShow,
  phoneAlertMsg: state => state.user.phoneAlertMsg,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  authRequired: state => state.user.authRequired,
  permissions: state => state.user.permissions,
  tenantId: state => state.user.tenantId,
  companyName: state => state.user.companyName,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters
}

export default getters
