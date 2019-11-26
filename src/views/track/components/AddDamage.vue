<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :width="1100" :visible="visible" :maskClosable="false"
      @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item >
            <h3 style="font-weight:bold;" v-if="payType === 'waybill'">收入费用</h3>
            <payment-modal ref="paymentModal" @getSettlement="getSettlement" v-if="hackReset" :payType="payType" :trackData="trackNode[0]" :id="currentCode"></payment-modal>
          </a-form-item>
          <a-form-item v-if="payType === 'waybill'">
            <h3 style="font-weight:bold;margin-top:20px;">支出费用</h3>
            <payment-modal ref="paymentModalOut" @getSettlement="getSettlement" v-if="hackReset" payType="expend" :trackData="trackNode[0]" :id="currentCode"></payment-modal>
          </a-form-item>
          <a-form-item v-if="payType === 'dispatch'" style="width:800px;">
            <h3 class="detail">分摊详情</h3>
            <a-table :columns="columnsList" :scroll="{ x: 600 }" :dataSource="dataList" bordered :pagination="false">
              <span v-for="(item,i) in dynamicList" :key='i' :slot="item.dataIndex" slot-scope="text, record">{{record.businessOutgo[i].outgoMoney}}</span>
            </a-table>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { mapGetters } from 'vuex'
import PaymentModal from './AddFee'
import { addTrackExpense, saveExpense, dispatchTrackWaybill, dispatchTrackExpense } from '@/api/track/track.js'
export default {
  name: 'AddDamage',
  mixins: [fileBase],
  components: {
    PaymentModal
  },
  props: {
    payType: {
      type: String,
      default: 'waybill'
    }
  },
  data () {
    return {
      currentCode: '',
      hackReset: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isSubmit: false,
      settlementData: null,
      columnsList: [
        {
          title: '运单号',
          width: 120,
          dataIndex: 'waybillCode'
        },
        {
          title: '客户名称',
          width: 80,
          dataIndex: 'partnerName'
        },
        {
          title: '件数',
          width: 80,
          dataIndex: 'totalAmount'
        },
        {
          title: '重量',
          width: 80,
          dataIndex: 'totalWeight'
        },
        {
          title: '体积',
          width: 80,
          dataIndex: 'totalVolume'
        }
      ],
      columnsList1: [
        {
          title: '运单号',
          width: 120,
          dataIndex: 'waybillCode'
        },
        {
          title: '客户名称',
          width: 80,
          dataIndex: 'partnerName'
        },
        {
          title: '件数',
          width: 80,
          dataIndex: 'totalAmount'
        },
        {
          title: '重量',
          width: 80,
          dataIndex: 'totalWeight'
        },
        {
          title: '体积',
          width: 80,
          dataIndex: 'totalVolume'
        }
      ],
      dataList: [],
      dynamicList: [],
      trackNode: []
    }
  },
  created () {
  },
  watch: {
    trackNode: {
      deep: true,
      handler: function (val) {
        // console.log('trackNode 》watch-val', val, this.payType)

        this.$nextTick(() => {
          if (val.length > 0) {
            this.currentCode = ''
            if (this.payType === 'dispatch') {
              // 收入费用

              dispatchTrackExpense({
                dispatchId: val[0].dispatchId
              }).then(res => {
                console.log(res)
              })
              // console.log('====')
              // 加载特殊费用，分摊详情
              dispatchTrackWaybill({
                dispatchId: val[0].dispatchId
              }).then(res => {
                this.dataList = res.data
                console.log('this.dataList515', this.dataList)
                if (this.dataList !== null && this.dataList.length > 0) {
                  let newarray = this.dataList[0].businessOutgo
                  const _ = this
                  this.dynamicList = []
                  newarray && newarray.forEach(function (item, i) {
                    let newvalue = {
                      title: item.outgoTypeName,
                      width: 80,
                      dataIndex: 'outgoMoney' + i,
                      scopedSlots: { customRender: 'outgoMoney' + i }
                    }
                    _.dynamicList.push(newvalue)
                  })
                  this.columnsList = [ ...this.columnsList1, ...this.dynamicList ]
                }
                // console.log(this.dynamicList)
              })
              this.currentCode = val[0].dispatchCode
            } else if (this.payType === 'waybill') {
              this.currentCode = val[0].waybillCode
            }
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters('track',
      ['getPaymentList', 'getExpendList']
    ),
    title () {
      return `添加特殊费`
    }
  },
  methods: {
    getSettlement (data) {
      console.log('this.settlementData=====', data)
      this.settlementData = data
    },
    isNeeded (item) {
      const isNeed = !!item.editable && !!item.nodeType && !!(item.price * 100) && !!item.settlementType && (
        (item.budgetFlag === 2 && !!item.settlementObjId) || item.budgetFlag === 1/* 收入费用时没有settlementObjId */)
      console.log('isNeed (item', item, isNeed)
      return isNeed
    },
    add (rows) {
      console.log('传递的数据', rows)
      this.trackNode = rows
      // 运行安全
      if (rows.length > 0) {
        this.dispatchId = rows[0].dispatchId
      }
      // 显示
      this.visible = true
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    handleadd (e) {
      if (this.isSubmit) return
      e.preventDefault()
      // console.log(this.$refs.paymentModalOut.data,'wpwwwwwwwwwww')
      this.form.validateFields((err, values) => {
        console.log('err515', err)
        const wabillIncome = this.getPaymentList.paylistsWI ? this.getPaymentList.paylistsWI.filter(item => this.isNeeded(item)) : []
        // const wabillExpend = this.getPaymentList.paylistsWE ? this.getPaymentList.paylistsWE : []
        const wabillExpend = this.$refs.paymentModalOut ? this.$refs.paymentModalOut.data.filter(item => this.isNeeded(item)) : []// 支出数据暂取
        const dispatchIncome = this.getPaymentList.paylistsD ? this.getPaymentList.paylistsD : []
        console.log('wabillExpend', wabillExpend)
        console.log('dispatchIncome', dispatchIncome)
        console.log('wabillIncome', wabillIncome)
        console.log('this.settlementData', this.settlementData)
        console.log('this.payType', this.payType)
        // console.log('运单收入费用')
        // console.log(wabillIncome)
        // console.log(`运单支付费用`)
        // console.log(wabillExpend)
        // console.log(`调度单收入费用`)
        // console.log(dispatchIncome)
        let reqData = this.payType === 'waybill' ? [ ...wabillIncome, ...wabillExpend ] : [ ...dispatchIncome ]
        console.log('reqData515', reqData)
        reqData.forEach(function (item, i) {
          if (item.fileList.length > 0) {
            let img = []
            item.fileList.forEach(function (item2, o) {
              img.push(item2.response.data)
            })
            item.picJson = JSON.stringify(img)
          }
          const nodeTypeObj = item.nodeType ? JSON.parse(item.nodeType) : {}
          item.nodeType = nodeTypeObj.id
          item.nodeTypeName = nodeTypeObj.name
        })
        reqData = reqData.filter(v => !v.expenseId && v.nodeType)
        if (reqData.length === 0) {
          this.$message.warning('没有可保存的数据！请确保填入了所有必填数据')
          return
        }
        // 修改保存的时候的参数
        if (this.settlementData && this.settlementData.length) {
          if (reqData && reqData.length) {
            reqData.forEach(item => {
              let settlementObjIdObj = item.settlementObjId ? JSON.parse(item.settlementObjId) : {}
              let id = settlementObjIdObj.settleId
              console.log('id, item515', id, item)
              let find = this.settlementData.find(settlement => {
                console.log('settlement', settlement.settleId, id, settlement.settleId === id)
                return settlement.settleId === id
              })
              console.log('find ====', find, this.settlementData, item.settlementObjId, item)
              if (find) {
                item.settlementObjId = find.settleId
                item.settlementName = find.settleName
                item.settlementObj = find.settleType
                item.dispatchCode = find.dispatchCode
              }
            })
          }
        }
        console.log(reqData, '11111')
        // return false
        this.isSubmit = true
        this.confirmLoading = true
        // addTrackExpense({ trackExpense: JSON.stringify(trackExpenses), tracks: JSON.stringify(this.trackNode) }).then(res => {
        if (this.payType === 'waybill') {
          reqData && addTrackExpense(reqData).then(res => {
            this.confirmLoading = false
            // console.log(res)
            if (res.code === 0) {
              this.$message.success('操作成功')
            } else {
              this.$message.fail(res.message)
            }
            this.visible = false
            this.form.resetFields()
          }).finally(() => {
            this.confirmLoading = false
            this.isSubmit = false
          })
        } else {
          reqData && saveExpense(reqData).then(res => {
            this.confirmLoading = false
            console.log(res)
            if (res.code === 0) {
              this.$message.success('操作成功')
            } else {
              this.$message.fail(res.message)
            }
            this.visible = false
            this.form.resetFields()
          }).finally(() => {
            this.confirmLoading = false
            this.isSubmit = false
          })
        }
      })
    },
    handleaddCancel (isRefresh) {
      this.info = {}
      this.visible = false
      this.form.resetFields()
      this.$emit('hideForm', isRefresh)
    },
    chknum (value) {
      const reg = /^(-)*(\d+)\.(\d\d).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) { return (parseFloat(value)).toFixed(2) }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.site-addr-form-layout {
  .get-map {
    display: inline;
    cursor: pointer;
  }
}
.ant-form-item {
  margin-bottom: 10px;
}
.detail {
  display: inline-block;
  margin: 20px 0 15px 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  /*color: #1890FF;*/
  /*border-bottom: 1px solid #1890FF;*/
}
</style>
