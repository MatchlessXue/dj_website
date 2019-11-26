// 立即付款
<template>
  <div class="total">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      :destroyOnClose="true"
      :confirmLoading="loading"
      @ok="handleadd"
      @cancel="handleaddCancel"
      width='90%'>
    <span slot="title">
      <span >{{title}}</span>
    </span>
    <condition ref="condition" :isImmediatePay="true" ></condition>
    <payment-modal ref="paymentModal"></payment-modal>
    <tab-List v-show="false" ref="tablist" :type='1'></tab-List>
    </a-modal>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import condition from '@views/settlement/components/ConditionForm'
import tabList from '@views/settlement/components/TableList'
import PaymentModal from './PaymentModal'
import { addDocumentParams } from '@views/settlement/components/queryParams.js'

import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'

export default {
  name: 'addModel',
  mixins: [librariesBase, base],
  components: {
    condition,
    PaymentModal,
    tabList
  },
  props: {
    title: {
      type: String,
      default: '立即付款'
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      detailvisible: false,
      form: this.$form.createForm(this),
      isSubmit: false,
      partnerId: '',
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      allPartnerList: [] // 客户名称列表
    }
  },
  computed: {
    ...mapGetters('settlement', [
      'getCostForm',
      'getClientSelectCondiation',
      'getPaymentList'
    ]
    )
  },
  mounted () {
    console.log('addModal.this.....', this)
  },

  methods: {
    ...mapActions('settlement', [
      'setdocumentId'
    ]),
    show (settleIds) {
      this.visible = true
      this.init(settleIds)
      this.settleIds = settleIds.toString()
    },
    init (settleIds) {
      this.setdocumentId('')
      this.$nextTick(() => {
        this.$refs.condition.init()
        this.$refs.paymentModal.init()
        this.$refs.tablist.init(settleIds)
      })
    },
    // 新增浮层确认事件
    handleadd () {
      // 表单中的数据
      let myParams = {}
      let isOk = true
      this.$refs.condition.form.validateFields((err, values) => {
        if (!err) {
          myParams = Object.assign({}, addDocumentParams, values)
        } else {
          isOk = false
        }
      })
      console.log('isOk...', isOk)

      if (!isOk) return

      // 校验结款信息
      if (!this.checkPayList(myParams)) return

      myParams.settlementNow = true // 是否立即结算
      myParams.settleIds = this.settleIds
      // 结款信息列表的数据
      myParams.paymentSaveVo = this.getPaymentList.paylists
      // 选中的运单的数据
      // myParams.documentWaybillMapParamVoList = this.$refs.tablist.getSubTableData
      if (this.pageType === 3) {
        this.$set(myParams, 'mobile', this.$refs.tablist.getSubTableData[0].mobile)
      }
      this.loading = true
      console.log(myParams)
      this.pageConfig.addSettlement(myParams).then(res => {
        this.handleaddCancel()
        myParams = {}
      }).finally(() => {
        this.loading = false
      })
    },
    // 校验结款信息
    checkPayList (document) {
      const payList = this.getPaymentList.paylists || {}

      if (!payList.invoiceVo) {
        this.$message.info('请添加结款信息')
        return false
      }
      let money = 0
      payList.invoiceVo.forEach(function (item, i) {
        money += parseFloat(item.payMoney)
      })
      console.log(`money: ${money}, document.totalMoney: ${document.totalMoney}`)

      if (money - document.totalMoney !== 0) {
        this.$message.info('新添的结款金额不等于总金额')
        return false
      }
      return true
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', { isRefresh: true, detail: false })
    },
    // 费用详情页
    checkDetail () {
      this.visible = false
      this.detailvisible = true
      this.$emit('hideForm', { isRefresh: true, detail: true })
    }

  }
}
</script>
<style lang="less" scope>
</style>
