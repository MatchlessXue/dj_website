<template>
<div>
  <a-row :gutter="0" class="wa_details_card">
    <a-col :xs="12">
      <a-card :bordered="false" title="发货方信息">
        <a-form layout="inline">
          <a-row :gutter='16'>
            <a-col :xs='12'>
              <a-form-item label="发货方名称">
                {{backInfo.sdName}}
              </a-form-item>
            </a-col>
            <a-col :xs='12'>
              <a-form-item label="发货区域">
                {{backInfo.sdAddressArea}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col :xs='12'>
              <a-form-item label="发货方联系人">
                {{backInfo.sdContact}}
              </a-form-item>
            </a-col>
            <a-col :xs='12'>
              <a-form-item label="发货方手机号">
                {{backInfo.sdMobile}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="发货方地址">
                {{backInfo.sdAddress}}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-col>
    <a-col :xs="12">
      <a-card :bordered="false" title="收货方信息">
        <a-form layout="inline">
          <a-row :gutter='10'>
            <a-col :xs='12'>
              <a-form-item label="收货方名称">
                {{backInfo.rvName}}
              </a-form-item>
            </a-col>
            <a-col :xs='12'>
              <a-form-item label="收货区域">
                {{backInfo.rvAddressArea}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='10'>
            <a-col :xs='12'>
              <a-form-item label="收货方联系人">
                {{backInfo.rvContact}}
              </a-form-item>
            </a-col>
            <a-col :xs='12'>
              <a-form-item label="收货方手机号">
                {{backInfo.rvMobile}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item  label="收货方地址">
                {{backInfo.rvAddress}}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-col>
  </a-row>
  <a-card class="wa_details_card" :bordered="false" title="货物信息">
    <a-table
      :columns="columned"
      :dataSource="backInfo.consignments"
      size="middle"
      :pagination="false"
      rowKey="accountId">
    </a-table>
  </a-card>
  <a-card :bordered="false" class="wa_details_card" title="时间信息">
    <a-form  layout="inline">
      <a-row class="form-row"
        :gutter="60" >
        <a-col :sm="6">
          <a-form-item label="要求提货时间">
            {{backInfo.reqDeliveryDate}}
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="时效(小时)">
            {{backInfo.timeLimit}}
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="要求送货时间">
            {{backInfo.reqArrivalDate}}
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="托运日期">
            {{backInfo.transportDate}}
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <a-card :bordered="false" class="wa_details_card" title="回单信息">
    <a-form layout="inline">
      <a-row class="form-row"
              :gutter="60">
        <a-col :sm="6">
          <a-form-item label="回单类型">
            {{backInfo.receiptTypeName}}
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="回单份数">
            {{backInfo.receiptAmount}}
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="回单要求时间">
            {{backInfo.reqReturnDate}}
          </a-form-item>
        </a-col>
        <a-col :sm="6">
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <a-card :bordered="false" class="wa_details_card" title="费用信息">
    <a-form layout="inline">
    <a-radio-group :options="radioOptions" class="mb10" v-model="backInfo.calculateType" disabled/>
    <a-row class="form-row"
            :gutter="60">
      <a-col :sm="6">
        <a-form-item label="计费方式:">
          {{backInfo.priceUnitName}}
        </a-form-item>
      </a-col>
      <a-col :sm="6">
        <a-form-item label="单价:">
          {{backInfo.unitPrice}}
        </a-form-item>
      </a-col>
      <a-col :sm="6" v-if="backInfo.calculateType === 1">
        <a-form-item label="合同名称:">
          {{backInfo.contractName}}
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row"
            :gutter="60">
      <a-col :sm="6" v-for="cost in backInfo.businessIncomes"  :key="cost.incomeType">
        <a-form-item :label="cost.incomeTypeName ? (cost.incomeTypeName + ':') : ''">
          {{cost.incomeMoney}}
        </a-form-item>
      </a-col>
    </a-row>
    </a-form>
  </a-card>
  <a-card :bordered="false" class="wa_details_card" title="结算信息">
    <a-row class="form-row"
            :gutter="60">
      <a-form layout="inline">
      <a-col :sm="6">
        <a-form-item label="月结">
          {{backInfo.settlementMonth}}
        </a-form-item>
      </a-col>
      <a-col :sm="6">
        <a-form-item label="现付">
          {{backInfo.settlementCurrent}}
        </a-form-item>
      </a-col>
      <a-col :sm="6">
        <a-form-item label="到付">
          {{backInfo.settlementArrival}}
        </a-form-item>
      </a-col>
      </a-form>
    </a-row>
  </a-card>
  <a-card :bordered="false" class="wa_details_card" title="备注">
    <a-row>
      <a-col :xs='24' style="height:72px;" >
        {{backInfo.remark}}
      </a-col>
    </a-row>
  </a-card>
</div>
</template>
<script>
import { countCollumnsWidth } from '@/utils/util'
import ARow from 'ant-design-vue/es/grid/Row'

export default {
  name: 'good-base-info',
  components: {
    ARow
  },
  props: {
    waybillId: {
      type: String,
      default () {
        return {}
      }
    },
    backInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      columns: [],
      // // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.selectedRowKeys = []
        this.selectedRows = []
        console.log(parameter, 'waybillId=', this.waybillId)

        return this.pageConfig.waybillPageWithFee(this.waybillId).then(res => {
          this.columns = res.data.tableTitle
          res.data.records.forEach(val => {
            val.expenseVos.forEach(v => {
              this.$set(val, v.type, v.expenseMoney)
            })
          })
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      totalMoney: 0,
      radioOptions: [
        { label: '按合同计费', value: 1 },
        { label: '按手工计费', value: 2 }
      ],
      cargoInfo: {
        num: { title: '序号' },
        cargo: { title: '货物名称' },
        cargoCode: { title: '货物代码' },
        cargoPackage: { title: '货物包装' },
        cargpType: { title: '货物类型' },
        cargoNumber: { title: '件数' },
        weigth: { title: '重量(kg)' },
        volume: { title: '体积(m³）' },
        // totalWay: { title: '计价方式' },
        freightid: { title: '交货单号' },
        consignmentValue: { title: '申明价值' },
        unitWeight: { title: '单件重量' },
        unitVolume: { title: '单件体积' },
        remark: { title: '备注' }
      },
      timeLabelInfo: {
        requestTime: '要求提货时间:',
        requestSendTime: '要求送货时间:',
        timeKeep: '时效:',
        checktime: '托运时间:'
      },
      columned: [{
        title: '序号',
        dataIndex: 'dataStatus',
        key: 'dataStatus',
        customRender: (text, record, index) => {
          if (record.totalCol) {
            return (<span>合计</span>)
          }
          return (
            <span>{index + 1}</span>
          )
        }
      }, {
        title: '货物名称',
        key: 'consignmentName',
        dataIndex: 'consignmentName'
      }, {
        title: '货物代码',
        key: 'consignmentCode',
        dataIndex: 'consignmentCode'
      }, {
        title: '货物包装',
        key: 'packageTypeName',
        dataIndex: 'packageTypeName'
      }, {
        title: '货物类型',
        key: 'consignmentTypeName',
        dataIndex: 'consignmentTypeName'
      }, {
        title: '件数',
        key: 'orderAmount',
        dataIndex: 'orderAmount'
      }, {
        title: '重量(kg)',
        key: 'orderTargetWeight',
        dataIndex: 'orderTargetWeight'
      }, {
        title: '体积(m³）',
        key: 'orderTargetVolume',
        dataIndex: 'orderTargetVolume'
      }, {
        title: '交货单号',
        key: 'deliveryCode',
        dataIndex: 'deliveryCode'
      }, {
        title: '申明价值',
        key: 'consignmentValue',
        dataIndex: 'consignmentValue'
      }, {
        title: '单件重量',
        key: 'unitWeight',
        dataIndex: 'unitWeight'
      }, {
        title: '单件体积',
        key: 'unitVolume',
        dataIndex: 'unitVolume'
      }, {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark'
      }]
    }
  },
  computed: {
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  mounted () {
  },
  methods: {
    onChange (row) {
      console.log(row)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.costForm(this.selectedRows)
      // 将页面选择的数据带入
      this.clientSelectCondiation(this.queryParam)
    }
  },
  watch: {
    queryParam (n, o) {

    }
  }
}
</script>

<style lang="less" scoped>
  .mb10 {
    padding: 10px 0 20px 0;
  }
</style>
