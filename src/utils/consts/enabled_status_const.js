export function getEnableStatusConst () {
  const ENABLE_STATUS_CONST = {
    100: '启用',
    101: '停用',
    ENABLED: 100,
    DISABLED: 101
  }
  ENABLE_STATUS_CONST.getToggleName = function (code) {
    return code === 100 ? '停用' : '启用'
  }
  ENABLE_STATUS_CONST.getToggleCode = code => {
    return code === 100 ? 101 : 100
  }
  return ENABLE_STATUS_CONST
}
