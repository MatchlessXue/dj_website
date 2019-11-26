
<template>
  <div>
    <a-card :bordered="false"
            class="content-layout">
      <h1>TMS</h1>
      <p>{{userinfo.companyName}}</p>
      <p v-if="userinfo.verifiedStatus === 3">合同有效期至 {{userinfo.endDate}}</p>
    </a-card>

    <div v-if="needDisplayDoAuthBtn || userinfo.verifiedStatus==2">
      <employer-auth-common class="employerAuthCardClass">
        <h1 slot="employerAuthCardHeading">企业认证</h1>
        <a-col :lg="12"
               :md="12"
               :sm="12"
               v-if="needDisplayDoAuthBtn || userinfo.verifiedStatus==2"
               slot="rightTitleSection">
          <a-steps :current="userinfo.verifiedStatus - 1">
            <a-step v-for="(item) in steps"
                    :key="item.title"
                    :title="item.title" />
          </a-steps>
        </a-col>
        <a-col :lg="18"
               :md="18"
               :sm="18">
          <div :style="getTipTextFontSize(1.3)">当前账号尚未完成企业认证</div>
          <div :style="getTipTextFontSize(1)"
               class="enjoyClass">请完成企业认证以便更好的享受服务</div>
        </a-col>

        <a-col :offset="1"
               :lg="5"
               :md="5"
               :sm="5"
               :style="layoutStyle">
          <a-button v-if="needDisplayDoAuthBtn"
                    type="primary"
                    @click="employerAuth"
                    class="authBtnClass">立即认证—></a-button>
        </a-col>
      </employer-auth-common>

      <employer-auth-modal :visible="isModalShow"
                           :heading="modalHeading"
                           ref="employerAuthForm"
                           @onCancel="modalCancel($event)"
                           @onOkForSubmit="modalAddConfirm($event)"
                           :userinfo="userinfo"></employer-auth-modal>
    </div>
  </div>
</template>
<script>
import { getInfo } from '@/api/login'
import { stepsToggle } from '@/mixins/account/stepsToggle'
import EmployerAuthBus from '@/mixins/account/employerAuthBus'
export default {
  data () {
    return {
      userinfo: {}
    }
  },
  mixins: [stepsToggle],
  created () {
    // 获取用户信息
    this.getInfoMap()
  },
  updated: function () {
    var vm = this
    // 用$on事件来接收参数
    EmployerAuthBus.$on('userinfoForSetting', data => {
      console.log("EmployerAuthBus.$on('userinfoForSetting', data:center", data)
      vm.userinfo = data
    })
  },
  methods: {
    /**
     * 获取用户信息
     */
    getInfoMap () {
      return getInfo().then(res => {
        this.userinfo = res.data
        EmployerAuthBus.$emit('userinfoForCenter', this.userinfo)
      })
    }
  }
}
</script>

<style scoped>
.authBtnClass {
  height: 45px;
  padding-bottom: 0;
}
.employerAuthCardClass {
  margin-top: 30px;
}
</style>
