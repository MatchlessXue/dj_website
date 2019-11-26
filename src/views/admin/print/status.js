export function getPrintModes () {
  return [
    { label: '直接打印', value: 1 },
    { label: '预览打印', value: 2 }
  ]
}
export function getPrintMode (value) {
  let menus = getPrintModes()
  let find = menus.find(item => item.value === value)
  if (find) return find
  return {}
}
