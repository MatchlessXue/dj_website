<template>
<div>
  <!-- :showAlertInfo="false" -->
  <s-table ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            :scroll="{ x: scrollX}"
            bordered
            rowKey="consignmentId"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
     <a slot="action"
        slot-scope="text, record" @click="checkSomeDiff(record)">

        <span v-if="record.waybillCode !=='总计'">调差</span>

        </a>
  </s-table>

</div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import STable from '@/components/table'
import { columns, dispatchColumns, checkColumn } from '@views/settlement/components/column'
import { countCollumnsWidth } from '@/utils/util'
import base from './mixins/base'

export default {
  name: 'tablist',
  mixins: [base],
  props: {
    goodsListPageSelectvisible: {
      type: Boolean,
      default () {
        return false
      }
    },
    type: {
      type: Number,
      default: 1
    }
  },
  watch: {
    goodsListPageSelectvisible: {
      deep: true,
      handler: function (val) {
        this.visible = val
        this.form.resetFields()
      }
    },
    type: {
      handler: function (val) {

      }
    }
  },
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
      datas: [], // 表格里的数据
      // 查询参数
      queryParam: {
        orderEnd: '',
        orderStart: '',
        page: '1',
        pageSize: '10',
        ids: []
      },
      // 表头
      columns: [],
      pagination: {},
      settleIds: '',
      // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   this.columns = {
      //     1: columns, // 新增
      //     2: checkColumn // 对账
      //   }[this.type]

      //   return this.getTableListData
      // },
      loadData: parameter => {
        console.log('this.getCostForm..', this.getCostForm)
        this.queryParam.ids = []

        for (let i = 0; i < this.getCostForm.length; i++) {
          let id = this.waybillIdName // 在mixins
          this.queryParam.ids.push(this.getCostForm[i][id])
        }
        /**
         * 1 为新增结算单
         * 2 为对账结算单
         */
        switch (Number(this.type)) {
          case 1:
            /**
             * 针对不同的
             *  页面类型 1:客户，2:承运商 3:司机 4:服务商
             */
            this.columns = columns
            this.pageType === 3 && (this.columns = dispatchColumns)
            if (this.getCostForm.length) {
              this.queryParam.settlementStyle = this.getCostForm[0].settlementStyle
            }
            if (this.settleIds) {
              this.queryParam.settleIds = this.settleIds
            } else {
              return false
            }
            return this.pageConfig.waybillPageWithFee(Object.assign(parameter, this.queryParam)).then(
              res => {
                if (this.pageType === 3) {
                  this.datas = res.data.records
                  let newData = this.createTotalRow(res.data.records)
                  this.totalMoney(newData)
                  this.$set(res.data, 'records', [...res.data.records, newData])
                } else {
                  this.datas = res.data.records
                  let newData = this.createTotalRow(res.data.records)
                  this.totalMoney(newData)
                  res.data.records = [...res.data.records, newData]
                }
                return res.data || []
              }
            )
          case 2:
            this.columns = checkColumn
            let tempQuery = {
              documentId: this.getDocumentInfo.documentId
            }
            console.log('this.pageConfig', this.pageConfig)
            return this.pageConfig.checkCoordinateDetail(Object.assign(tempQuery)).then(
              res => {
                this.setDocumentAllInfo(res.data)
                let tempArr = res.data

                let result = []
                if (this.pageType === 1) { // 客户
                  result = res.data.waybillList
                } else if (this.pageType === 2) { // 承运商
                  result = res.data.dispatchedWaybillList
                } else {
                  result = res.data.dispatches
                }
                this.datas = result
                console.log('this.datas===', this.datas)

                let newData = this.createTotalRow(result)
                this.totalMoney(newData)
                tempArr.records = [...result, newData]

                return tempArr || []
              }
            )
        }
      },
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  computed: {
    ...mapGetters('settlement', [
      'getCostForm',
      'getClientSelectCondiation',
      'getDocumentInfo',
      'getTableListData'

      // 'setcostCheckDetailList'// 费用盘点详情list
    ]
    ),
    scrollX () {
      return countCollumnsWidth(this.columns)
    },
    rowSelection () {
      // const { selectedRowKeys } = this
      return {
        // onChange: (selectedRowKeys, selectedRows) => {
        //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        // },
        getCheckboxProps: record => ({
          props: {
            disabled: record.title === '总计', // Column configuration not to be checked
            name: record.waybillCode
          }
        })
      }
    },
    // 保存时提交给后端的数据
    getSubTableData () {
      let costList = []
      const tabDatas = this.datas
      for (let i = 0; i < tabDatas.length; i++) {
        costList.push({
          partnerId: this.pageType === 2 ? tabDatas[i].carrierId : tabDatas[i].partnerId,
          mobile: tabDatas[i].mobile, // 用于司机
          settlementMoney: tabDatas[i].settlementFee,
          tunedRemark: tabDatas[i].tunedRemark,
          tunedTotalMoney: tabDatas[i].tunedTotalMoney,
          waybillId: tabDatas[i][this.waybillIdName]
        })
      }
      return costList
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions('settlement', [
      'totalMoney',
      'setDocumentAllInfo'
    ]),
    init (settleIds) {
      this.settleIds = settleIds
      this.$refs.table.refresh()
    },
    // 创建汇总行
    createTotalRow (records) {
      const data = {
        waybillCode: '总计',
        totalAmount: 0,
        totalWeight: 0,
        totalVolume: 0,
        feeTrans: 0,
        feeGet: 0,
        feeSend: 0,
        feeStevedoring: 0,
        feeOther: 0,
        settlementMonth: 0,
        settlementCurrent: 0,
        settlementArrival: 0,
        totalValue: 0,
        settlementFee: 0
      }
      for (let i = 0; i < records.length; i++) {
        records[i].totalAmount ? data.totalAmount += Number(records[i].totalAmount) : data.totalAmount += 0
        records[i].totalWeight ? data.totalWeight += Number(records[i].totalWeight) : data.totalWeight += 0
        records[i].totalVolume ? data.totalVolume += Number(records[i].totalVolume) : data.totalVolume += 0
        records[i].feeTrans ? data.feeTrans += Number(records[i].feeTrans) : data.feeTrans += 0
        records[i].feeGet ? data.feeGet += Number(records[i].feeGet) : data.feeGet += 0
        records[i].feeSend ? data.feeSend += Number(records[i].feeSend) : data.feeSend += 0
        records[i].feeStevedoring ? data.feeStevedoring += Number(records[i].feeStevedoring) : data.feeStevedoring += 0
        records[i].feeOther ? data.feeOther += Number(records[i].feeOther) : data.feeOther += 0
        records[i].settlementMonth ? data.settlementMonth += Number(records[i].settlementMonth) : data.settlementMonth += 0
        records[i].settlementCurrent ? data.settlementCurrent += Number(records[i].settlementCurrent) : data.settlementCurrent += 0
        records[i].settlementArrival ? data.settlementArrival += Number(records[i].settlementArrival) : data.settlementArrival += 0
        records[i].totalValue ? data.totalValue += Number(records[i].totalValue) : data.totalValue += 0
        records[i].settlementFee ? data.settlementFee += Number(records[i].settlementFee) : data.settlementFee += 0
      }
      return data
    },
    // 浮层关闭事件
    goodsListPageSelectCancel () {
      // 关闭浮层
      this.$emit('handlegoodsselectclose')
      // 清空表单信息
      this.form.resetFields()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    backSelectInfo () {
      return this.selectedRows
    },
    checkSomeDiff (record) {
      console.log(record)
      this.$emit('hide', 4)
    }

  }
}
</script>
