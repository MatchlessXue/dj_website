<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级"/>
    <a-card class="card"
            title="基础信息"
            :bordered="false">
      <basicinfo-form ref="basicinfo"
                      :type="type"
                      :config="basicFormConfig"
                      :info="partner"/>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar align="center"
                     :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - 10px)` : '100%'}">
      <a-button @click="cancelSubmit">取消</a-button> &nbsp;&nbsp;
      <a-button type="primary"
                @click="validate"
                :loading="loading">
        {{ id ? '修改' : '提交' }}
      </a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import BasicinfoForm from './components/BasicinfoForm'
import FooterToolBar from '@/components/FooterToolbar'
import BackBtn from '@/components/BackBtn'
import { mixin, mixinDevice } from '@/utils/mixin'

import { savePartner, getAllByPartnerId } from '@/api/resource/partner'
import { getBasicFormConfig, getType, getRouterNames, getPartnerTypes } from './config'

export default {
  name: 'PartnerForm',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    BackBtn,
    BasicinfoForm
  },
  data () {
    const { id } = this.$route.params
    const type = getType(this)
    return {
      // 客户Id，区分是新增还是修改
      id,
      type,
      basicFormConfig: getBasicFormConfig(type),
      routerNames: getRouterNames(type), // router名称
      partnerType: getPartnerTypes(type),
      loading: false,
      partner: {},
      submitData: {}
    }
  },
  created () {
    this.getFormData()
  },
  watch: {
    '$route' (to, from) {
      this.type = getType(this)
      this.basicFormConfig = getBasicFormConfig(this.type)
    }
  },
  methods: {
    getFormData () {
      if (this.id) {
        getAllByPartnerId({ partnerId: this.id }).then((res) => {
          console.log('this.partner515', res)
          this.partner = res.data
        })
      }
    },
    cancelSubmit () {
      // 确认要取消吗
      this.$confirm({
        title: '提示',
        content: '确定要取消吗？',
        onOk: () => {
          this.$refs.basicinfo.resetCurrentProjectList()
          this.$router.push({ name: this.routerNames.list })
        },
        onCancel () {
        }
      })
    },
    handleSubmit () {
      this.loading = true
      savePartner(this.submitData).then((res) => {
        // console.log('savePartner res===', res)
        this.$refs.basicinfo.resetCurrentProjectList()
        this.$router.push({ name: this.routerNames.list })
      }).catch((err) => {
        console.log('savePartner>err', err)
        // this.$message.error(`${err && err.message}`)
      }).finally(() => {
        this.loading = false
      })
    },

    // 最终全页面提交
    validate () {
      let subData = {}
      let isOk = true

      this.$refs.basicinfo.form.validateFields((err, values) => {
        // console.log('err', err, 'basicinfo values', values)
        if (!err) {
          values.partnerType = this.partnerType
          values.projectList = this.partnerType === 2/* 承运商 */ ? [] : this.$refs.basicinfo.getCurrentProjectList()
          values.carrierAreaList = this.partnerType === 2 ? this.$refs.basicinfo.getCurrentAddressList() : []
          subData = values
        } else {
          isOk = false
        }
      })

      if (!isOk) return false
      // console.log('subData===', subData)

      this.submitData = subData

      this.handleSubmit()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
