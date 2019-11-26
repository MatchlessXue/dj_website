<template>
  <div>
     <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @ok="handlerOK"
      @cancel="handleaddCancel"
      width='80%'
      :title="title"
    >

      <a-table
      :columns="columns"
      :dataSource="data"
      bordered
      :scroll="{ x: scrollX}"
      :pagination="false"
      :loading="loading">
         <template v-for="(col, i) in cols" :slot="col" slot-scope="text, record">
           <div :key="col" >
            <a-input  v-if="col !== 'waybillCode'" style="margin: -5px 0" :value="text" :placeholder="columns[i].title"
                      v-decorator="[ `${col}${record.key}`,{rules: [{ message: `请输入正确的金额`, whitespace: true, max: 10}]}]"
                      @change="e => handleChange(e.target.value, record.key, col)"
                      maxLength="10" />
            <template v-else>
              {{text}}
            </template>
          </div>
        </template>
      </a-table>
    </a-modal>

  </div>
</template>

<script>

import { countCollumnsWidth } from '@/utils/util'
import base from './mixins/base'
import { mapGetters } from 'vuex'

export default {
  name: 'invest',
  mixins: [base],
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
      columns: [
        {
          title: '运单号',
          width: 160,
          dataIndex: 'waybillCode',
          scopedSlots: { customRender: 'waybillCode' }
        },
        {
          title: '运单差额',
          width: 120,
          dataIndex: 'pay1',
          scopedSlots: { customRender: 'pay1' }
        },
        {
          title: '提货差额',
          width: 140,
          dataIndex: 'pay2',
          scopedSlots: { customRender: 'pay2' }
        },
        {
          title: '送货差额',
          width: 150,
          dataIndex: 'pay3',
          scopedSlots: { customRender: 'pay3' }
        },
        {
          title: '装卸费差额',
          width: 160,
          dataIndex: 'pay4',
          selectOptions: this.openBankList,
          scopedSlots: { customRender: 'pay4' }
        },
        {
          title: '其他费用差额',
          width: 120,
          dataIndex: 'pay5',
          scopedSlots: { customRender: 'pay5' }
        },
        {
          title: '差额合计',
          width: 100,
          dataIndex: 'pay6',
          scopedSlots: { customRender: 'pay6' }
        },
        {
          title: '对账备注',
          width: 140,
          dataIndex: 'pay7',
          scopedSlots: { customRender: 'pay7' }
        }

      ],
      data: [],
      form: this.$form.createForm(this),
      cols: ['waybillCode', 'pay1', 'pay2', 'pay3', 'pay4', 'pay5', 'pay6', 'pay7'],
      queryItem: {
        'costId': '',
        'dispatchId': '',
        'tunedMoney': '',
        'tunedRemark': '',
        'type': 1,
        'waybillId': ''
      },
      baseQuery: {
        adjustmentTotal: '',
        documentId: '',
        remark: '',
        waybillId: '',
        waybillCostParamVoList: []
      },
      getterBack: [],
      query: []
    }
  },
  computed: {
    ...mapGetters('settlement',
      [
        'getAllDocumentInfo'
      ]
    ),
    scrollX () {
      return countCollumnsWidth(this.columns)
    }

  },
  watch: {
    visible: {
      handler: function () {
        this.data = []

        console.log(this.getAllDocumentInfo)
        /**
         * waywaybillList为客户的
         * dispatchedWaybillList 为承运商的
         * 客户调差的为waybillList>businessIncomes
         */
        let tempList = []
        console.log('当前页面', this.pageType)
        // 页面类型 1:客户，2:承运商 3:司机 4:服务商
        if (this.pageType === 1) {
          tempList = this.getAllDocumentInfo.waybillList
          this.baseQuery.documentId = this.getAllDocumentInfo.documentId
          this.baseQuery.waybillId = this.getAllDocumentInfo.waybillList[0].waybillId
          this.baseQuery.waybillCostParamVoList = this.getAllDocumentInfo.waybillList.businessIncomes
          for (let i = 0; i < tempList.length; i++) {
            this.query = tempList[i].businessIncomes
            let temp = {
              waybillCode: tempList[i].waybillCode,
              pay1: this.query[0].tunedMoney || 0,
              pay2: this.query[1].tunedMoney || 0,
              pay3: this.query[2].tunedMoney || 0,
              pay4: this.query[3].tunedMoney || 0,
              pay5: this.query[4].tunedMoney || 0,
              pay6: tempList[i].tunedTotalMoney || 0,
              pay7: this.query[0].tunedRemark || '',
              wayId: this.query[0].waybillId
              // id: this.query[0].incomeId
            }
            this.data.push(temp)
          }
        } else if (this.pageType === 2) {
          /**
           * 承运商存放调差数据的数组为dispatchedWaybillList>businessOutgos
           */
          tempList = this.getAllDocumentInfo.dispatchedWaybillList
          this.baseQuery.documentId = this.getAllDocumentInfo.documentId
          this.baseQuery.waybillId = this.getAllDocumentInfo.dispatchedWaybillList[0].waybillId
          this.baseQuery.dispatchId = this.getAllDocumentInfo.dispatchedWaybillList[0].dispatchId

          this.baseQuery.dispatchedWaybillId = this.getAllDocumentInfo.dispatchedWaybillList[0].dispatchedWaybillId
          this.baseQuery.waybillCostParamVoList = this.getAllDocumentInfo.dispatchedWaybillList.businessOutgos
          for (let i = 0; i < tempList.length; i++) {
            this.query = tempList[i].businessOutgos
            let temp = {
              waybillCode: tempList[i].waybillCode,
              pay1: this.query[0].tunedMoney || 0,
              pay2: this.query[1].tunedMoney || 0,
              pay3: this.query[2].tunedMoney || 0,
              pay4: this.query[3].tunedMoney || 0,
              pay5: this.query[4].tunedMoney || 0,
              pay6: tempList[i].tunedTotalMoney || 0,
              pay7: this.query[0].tunedRemark || '',
              // id: query[0].incomeId,
              dispatchId: this.query[0].dispatchId

            }
            this.data.push(temp)
          }
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    dealData (ListName, idName, subListName, MoneyName) {
      let tempList = []

      tempList = this.getAllDocumentInfo[ListName]
      this.baseQuery.documentId = this.getAllDocumentInfo.documentId
      this.baseQuery.waybillId = this.getAllDocumentInfo[ListName][0][idName]
      this.baseQuery.waybillCostParamVoList = this.getAllDocumentInfo[ListName][subListName]
      for (let i = 0; i < tempList.length; i++) {
        this.query = tempList[i].businessIncomes
        let temp = {
          waybillCode: tempList[i].waybillCode,
          pay1: this.query[0][MoneyName] || 0,
          pay2: this.query[1][MoneyName] || 0,
          pay3: this.query[2][MoneyName] || 0,
          pay4: this.query[3][MoneyName] || 0,
          pay5: this.query[4][MoneyName] || 0,
          pay6: 0,
          pay7: ''
        }
        this.data.push(temp)
      }
    },
    showModal () {
      this.visible = true
    },
    hideModal () {
      this.visible = false
    },
    handleaddCancel () {
      this.hideModal()
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      console.log(value)
      console.log(key)
      console.log(column)
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
        let num = 0
        for (let i = 0; i < 5; i++) {
          num += Number(this.data[0][`pay${i + 1}`])
        }
        target['pay6'] = num
      }
    },
    handlerOK () {
      for (let i = 0; i < this.data.length; i++) {
        let tempArr = []
        for (let k = 0; k < 5; k++) {
          console.log(this.query[k].outgoId)
          let item = {
            'costId': this.query[k].incomeId || this.query[k].outgoId || '',
            'dispatchId': this.query[k].dispatchId || '',
            'tunedMoney': this.data[i][`pay${k + 1}`],
            'tunedRemark': this.data[i][`pay7`],
            'type': k + 1,
            'waybillId': this.query[k].waybillId || ''
          }
          tempArr.push(item)
        }
        let num = 0
        for (let m = 0; m < tempArr.length; m++) {
          for (let item in tempArr[m]) {
            if (item === 'tunedMoney') {
              num += Number(tempArr[m][item])
            }
          }
        }
        this.baseQuery.adjustmentTotal = num
        this.baseQuery.waybillCostParamVoList = tempArr
      }

      this.pageConfig.adjustDocument(Object.assign(this.baseQuery)).then(res => {
        console.log('调差成功')
        if (res.code === 0) {
          this.$message.success('调差成功')
          this.visible = false
          this.$emit('checksuccess', true)
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
