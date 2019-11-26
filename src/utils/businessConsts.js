import { getEnableStatusConst } from './consts/enabled_status_const'
import Vue from 'vue'

Vue.prototype.djConsts = {
  ENABLE_STATUS_CONST: getEnableStatusConst()
}
