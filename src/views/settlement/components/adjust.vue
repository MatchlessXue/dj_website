<template>
  <div class="adjust">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @ok="handleadd"
      @cancel="handleaddCancel"
      :confirmLoading="loading"
      width='70%'>
      <span slot="title">
        <span>{{title}}</span>
      </span>
      <div class="waybillCode-tit">
        <span tit>运单号：</span>{{record.waybillCode}}
      </div>
      <a-table
        :columns="columns"
        :pagination="false"
        :dataSource="record.expenseVos">
        <template v-for="col in ['tunedMoney', 'resultMoney']" :slot="col" slot-scope="text, record, index">
          <div :key="col" style="text-align: center;">
            <a-input
              style="width: 50%;"
              :disabled="col==='resultMoney' || record.typeName === '合计'"
              :value="text"
              @change="e => handleChange(e.target.value, col, index)"/>
          </div>
        </template>
      </a-table>
      <a-form-item label="对账备注：">
        <a-textarea v-model="remark" :rows="4"/>
      </a-form-item>
    </a-modal>
  </div>
</template>
<script>
import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'
export default {
  name: 'adjustModel',
  mixins: [ librariesBase, base ],
  components: {

  },
  props: {
    title: {
      type: String,
      default: '调差'
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      detailvisible: false,
      // form: this.$form.createForm(this),
      record: {},
      remark: '',
      queryParam: {},
      oldAdjustmentTotal: 0,
      columns: [
        {
          title: '费用类型',
          dataIndex: 'typeName',
          width: '100',
          scopedSlots: { customRender: 'typeName' }
        },
        {
          title: '当前金额',
          dataIndex: 'money',
          width: '100',
          scopedSlots: { customRender: 'expenseMoney' }
        },
        {
          title: '调差金额',
          dataIndex: 'tunedMoney',
          width: '100',
          scopedSlots: { customRender: 'tunedMoney' }
        },
        {
          title: '实际金额',
          dataIndex: 'resultMoney',
          width: '100',
          scopedSlots: { customRender: 'resultMoney' }
        }
      ]
    }
  },
  created () {

  },
  methods: {
    showModal (record, queryParam) {
      this.visible = true
      this.remark = ''
      this.queryParam = {}
      this.record = record
      this.record.expenseVos.push({
        typeName: '合计',
        money: 0,
        tunedMoney: 0,
        resultMoney: 0
      })
      this.setTotalValue()
      this.oldAdjustmentTotal = record.monthTunedTotalMoney ? record.monthTunedTotalMoney : 0
      this.record.expenseVos.forEach(v => {
        if (v.monthTunedRemark) {
          this.remark = v.monthTunedRemark
        }
        if (v.tunedMoney) {
          this.$set(v, 'resultMoney', v.tunedMoney * 1 + v.money)
        } else {
          this.$set(v, 'resultMoney', v.money)
        }
      })
      this.queryParam = queryParam
    },
    handleChange (value, key, idx) {
      this.$set(this.record.expenseVos[idx], key, value)
      this.$set(this.record.expenseVos[idx], 'resultMoney', (this.record.expenseVos[idx].money * 1 + value * 1))
      if (value === '') {
        this.$set(this.record.expenseVos[idx], 'resultMoney', this.record.expenseVos[idx].money)
      }
      this.setTotalValue()
    },
    setTotalValue () {
      let totalValue = {
        money: 0,
        tunedMoney: 0,
        resultMoney: 0
      }
      let lastItem = this.record.expenseVos[this.record.expenseVos.length - 1]
      this.record.expenseVos.forEach((val, idx) => {
        for (let key in totalValue) {
          if (val[key] && idx !== this.record.expenseVos.length - 1) {
            this.$set(totalValue, key, (totalValue[key] * 1 + val[key] * 1))
          }
        }
      })
      lastItem.money = totalValue.money
      lastItem.resultMoney = totalValue.resultMoney
      lastItem.tunedMoney = totalValue.tunedMoney
    },
    // 新增浮层确认事件
    handleadd () {
      let queryData = {
        adjustmentTotal: 0,
        remark: this.remark,
        settleId: this.record.settleId,
        expenseAdjustVos: [],
        oldAdjustmentTotal: this.oldAdjustmentTotal
      }
      this.record.expenseVos.forEach(v => {
        if (v.typeName !== '合计') {
          this.$set(queryData, 'adjustmentTotal', queryData.adjustmentTotal + v.tunedMoney * 1)
          queryData.expenseAdjustVos.push({
            'costId': v.expenseId,
            'settleId': v.settleId,
            'tunedMoney': v.tunedMoney || '',
            'tunedRemark': this.remark,
            'type': v.type
          })
        }
      })
      this.loading = true
      this.pageConfig.adjustDocument(Object.assign(this.queryParam, queryData)).then(res => {
        this.handleaddCancel()
        queryData = {
          adjustmentTotal: 0,
          remark: '',
          settleId: ''
        }
        this.oldAdjustmentTotal = 0
      }).finally(() => {
        this.loading = false
      })
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', { isRefresh: true, detail: false })
    }
  },
  watch: {
    record: {
      handler (val) {
        this.setTotalValue()
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scope>

  .waybillCode-tit{
    padding: 24px;
    padding-left: 0;
    span[tit]{
      font-size: 18px;
      font-weight: 600;
    }
  }

</style>
