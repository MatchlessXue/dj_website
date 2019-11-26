<template>
  <a-modal title="结算单信息" :width="900" :visible="visible" :confirmLoading="confirmLoading"  @ok="handleadd"  @cancel="handleaddCancel">
    <a-spin :spinning="confirmLoading">
      <condition-modal v-if="hackReset"></condition-modal>
      <payment-modal ref="paymentModal" v-if="hackReset" :payType="payType"></payment-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import ConditionModal from './condition1'
import PaymentModal from './PaymentModal'
import base from './mixins/base'

import { mapGetters, mapActions } from 'vuex'
const data = []
export default {
  name: 'AddpaymentModal',
  mixins: [base],
  components: {
    ConditionModal,
    PaymentModal
  },
  data () {
    return {
      data,
      loading: false,
      visible: false,
      confirmLoading: false,
      totalMoney: 0,
      hackReset: true,
      form: this.$form.createForm(this),
      payType: 1
    }
  },
  computed: {
    ...mapGetters('settlement',
      ['getPaymentList', 'getDocumentId']
    )
  },
  created () {
  },
  methods: {
    ...mapActions('settlement', [
      'setdocumentId'
    ]),
    handleadd () {
      console.log(this.$refs.paymentModal.setbizStatus())
      if (this.$refs.paymentModal.setbizStatus() > 302) {
        let documentId = this.getDocumentId
        console.log(this.getPaymentList)
        this.pageConfig.enterSettlement({ documentId }).then(res => {
          this.$message.success('操作成功')
          this.handleaddCancel()
          this.visible = false
        })
      } else {
        this.totalMoney = this.getPaymentList.totalMoney
        let PaymentList = this.getPaymentList.paylists
        if (!PaymentList.invoiceVo) {
          return false
        }
        let money = 0
        let iscan = true
        PaymentList.invoiceVo.forEach(function (item, i) {
          money += parseFloat(item.payMoney)
          if (item.payMoney <= 0) {
            iscan = false
          }
        })
        // console.log('总金额：' + this.totalMoney)
        // console.log('提交金额' + money)
        if (iscan === false) {
          this.$message.info('支付金额必须大于0')
          return false
        }
        if (money > this.totalMoney) {
          this.$message.info('新添的货物金额不能大于总金额')
          return false
        }
        this.confirmLoading = true
        this.pageConfig.paymentUpdate(PaymentList).then(res => {
          this.confirmLoading = false
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.handleaddCancel()
          } else {
            this.$message.fail('操作失败')
          }
        }).catch(error => {
          this.confirmLoading = false
          this.$message.fail(error)
        })
      }
    },
    handleaddCancel () {
      this.visible = false
      this.$emit('hideForm')
    },
    // type: 1：添加结款；2：添加付款；
    add (documentId, type) {
      this.setdocumentId(documentId)
      this.payType = type
      this.visible = true
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    }
  }
}
</script>

<style scoped>
</style>
