<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="调度单号：">
                <a-input v-model="queryParam.dispatchCode" placeholder="请输入调度单号"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="车牌号：">
                <a-input v-model="queryParam.plateNumber" placeholder="请输入车牌号"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="承运商名称：">
                <a-input v-model="queryParam.carrierName" placeholder="请输入承运商名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="调度时间：">
                <a-range-picker
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDuDateChange"
                  v-model="dispatchValue"
                  :style="{ width: '100%' }"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="运单号：">
                <a-input v-model="queryParam.waybillCode" placeholder="请输入运单号"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="提货时间：">
                <a-range-picker
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDepartDateChange"
                  v-model="startValue"
                  :style="{ width: '100%' }"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="送达时间：">
                <a-range-picker
                  :placeholder="['开始时间', '结束时间']"
                  @change="onArrivalDateChange"
                  v-model="endValue"
                  :style="{ width: '100%' }"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px" class="card-container">
      <div class="table-page-option-wrapper">
        <a-row>
          <a-col :md="{span: 12}" :sm="12">
            <a-button type="primary" @click="printDialogShow" :loading="printLoading">打印</a-button>
          </a-col>
          <a-col style="text-align: right;" :md="{span: 12}" :sm="12">
            <CheckboxMulty :plainOptions="columnsOption"
                           :defaultCheckedList="defaultCheckList"
                           @change="handleCheked"
                           cardWidth="420px"
                           :itemCount="3"
                           style="margin-left:10px;"
                           title="自定义列"></CheckboxMulty>
          </a-col>
        </a-row>
      </div>
      <s-table
        ref="table"
        bordered
        size="default"
        :scroll="{x:scrollX}"
        :columns="selectedColumns"
        :data="loadData"
        :showAlertInfo="false"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :rowKey='record => record.dispatchId'>
        <a slot="dispatchCode" slot-scope="text,record" @click="handleDetail(record)" >{{text}}</a>
        <span slot="transportType" slot-scope="text">{{getTransportTypeDesc(text)}}</span>
        <span slot="bizStatus" slot-scope="text">{{getDispatchStatusDesc(text)}}</span>
        <span slot="weightPercent" slot-scope="text,record">{{getWeightPercent(record)}}</span>
        <span slot="volumePercent" slot-scope="text,record">{{getVolumePercent(record)}}</span>
        <span slot="totalAmount" slot-scope="text">{{text > 0 ? text : 0}}</span>
        <span slot="totalWeight" slot-scope="text">{{text > 0 ? text : 0}}</span>
        <span slot="totalVolume" slot-scope="text">{{text > 0 ? text : 0}}</span>
<!--        <span slot="totalValue" slot-scope="text,record">{{getSumFee(record)}}</span>-->

        <span slot="action" slot-scope="text,record">
          <template v-if="record.isdel === true">
            <span @click="handleEdit(record)"><a>修改</a><a-divider type="vertical"/></span>
            <!--待派车，待接单状态的调度单显示删除按钮-->
          <Confirm-Info  :title="'确认删除这条记录么'" :content="'删除'" @onconfirm="handleDelete(record)"/>
          </template>

        </span>
      </s-table>
    </a-card>
    <print-dialog ref="PrintDialogRef" :store="$store" title="调度单打印" @success="printLoading=false" :printmenuId="2"></print-dialog>
  </div>
</template>

<script>
import datetimeBase from '@/views/dispatch/DispatchList/mixins/datetime_base'
import dictionaryBase from '@/views/dispatch/DispatchList/mixins/dictionary_base'
import dispatchComputeBase from '@/views/dispatch/DispatchList/mixins/dispatch_compute'
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import ConfirmInfo from '@/components/ListConfirm/ConfirmInfo'
import { dispatchSelectByPage, oneKeyNotify, deleteDispatchById, getAllDispatchStatus } from '@/api/dispatch/dispatch'
import CheckboxMulty from '@/components/CheckboxMulty'
// import SelectAutoComplete from './components/SelectAutoComplete'
import { queryAllTrucks } from '@/api/resource/truck'
import { getPartnerList } from '@/api/resource/partner'
import { PrintDialog } from 'dj_print'
import cityCollection from './mixins/city_collection'
import { selectAll } from '@/api/resource/siteAddress'

// 调度页面
export default {
  name: 'DispatchList',
  mixins: [datetimeBase, dictionaryBase, dispatchComputeBase, cityCollection],
  components: {
    AInput,
    STable,
    ConfirmInfo,
    CheckboxMulty,
    PrintDialog
    // SelectAutoComplete
  },
  data () {
    return {
      queryAllTrucks: queryAllTrucks,
      getPartnerList: getPartnerList,
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 8 },
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      scrollX: 0,
      isFindDriverShow: false,
      currentDispatchId: '',
      allStatusList: [], // 状态列表列表
      selectedColumns: [], // 需要显示的列
      eDate: undefined,
      sDate: undefined,
      printLoading: false,
      sites: [],
      // 查询参数
      queryParam: {},
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        console.log('加载数据查看原有参数')
        console.log(params)
        Object.assign(this.queryParam, params)
        return dispatchSelectByPage(this.queryParam).then(res => {
          console.log('res data==', res)
          return res.data || []
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  watch: {

  },
  activated () {
    let pageCatch = this.$ls.get('pageCatch')
    if (pageCatch) {
      this.$refs.table.refresh()
    } else {
      this.handleReset(true)
    }
    this.selectedRowKeys = []
    this.$ls.remove('pageCatch')
  },
  created () {
    selectAll().then(res => {
      this.sites = res.data || []
    })
    let cols = this.$ls.get('DDDispatchSelectedCols_1')
    console.log('查看缓存的cols', typeof cols, cols)
    if (cols && cols.length) {
      this.selectedColumns = cols
    } else {
      this.selectedColumns = this.columns.filter(col => col.defaultShow)
    }

    console.log('查看selectedColumns', this.selectedColumns)
    // this.selectedColumns = this.columns.slice(0)
    this.updateColumnWidth()
  },
  mounted () {
    this.init()
  },
  computed: {
    columnsOption () {
      return this.columns.map(function (item) {
        // console.log({ label: item.title, value: item.key, disabled: item.fixed });
        // return { label: item.title, value: item.key, disabled: item.fixed }，
        return { label: item.title, value: item.key }
      })
    },
    defaultCheckList () {
      let catchCols = this.$ls.get('DDDispatchSelectedCols_1')
      let defaultCols = this.columns.reduce((res, item) => {
        if (item.defaultShow) res.push(item.key)
        return res
      }, [])
      if (catchCols && catchCols.length) {
        defaultCols = catchCols.reduce((res, item) => {
          res.push(item.key)
          return res
        }, [])
      }
      return defaultCols
    },
    columns () {
      const cols = [
        {
          title: '调度单号',
          key: 'dispatchCode',
          dataIndex: 'dispatchCode',
          width: 200,
          defaultShow: true,
          scopedSlots: { customRender: 'dispatchCode' }
        },
        {
          title: '车牌号',
          key: 'plateNumber',
          defaultShow: true,
          width: 120,
          dataIndex: 'plateNumber'
        },
        {
          title: '司机姓名',
          key: 'driverName',
          width: 150,
          dataIndex: 'driverName'
        },
        {
          title: '司机手机号',
          key: 'mobile',
          width: 160,
          dataIndex: 'mobile'
        },
        {
          title: '承运商名称',
          key: 'carrierName',
          width: 150,
          defaultShow: true,
          dataIndex: 'carrierName'
        },
        {
          title: '运输方式',
          key: 'transportType',
          defaultShow: true,
          width: 120,
          dataIndex: 'transportType',
          scopedSlots: { customRender: 'transportType' },
          filters: [
            { text: '整车', value: '2' },
            { text: '零担', value: '1' }
          ]

        },
        {
          title: '件数',
          key: 'totalAmount',
          defaultShow: true,
          width: 120,
          dataIndex: 'totalAmount',
          scopedSlots: { customRender: 'totalAmount' }
        },
        {
          title: '重量(kg)',
          key: 'totalWeight',
          defaultShow: true,
          width: 120,
          dataIndex: 'totalWeight',
          scopedSlots: { customRender: 'totalWeight' }
        },
        {
          title: '体积(m³)',
          key: 'totalVolume',
          defaultShow: true,
          width: 120,
          dataIndex: 'totalVolume',
          scopedSlots: { customRender: 'totalVolume' }
        },
        {
          title: '费用(元)',
          key: 'totalValue',
          defaultShow: true,
          dataIndex: 'totalValue',
          width: 100,
          scopedSlots: { customRender: 'totalValue' }
        },
        {
          title: '状态',
          key: 'bizStatus',
          defaultShow: true,
          dataIndex: 'bizStatus',
          width: 100,
          scopedSlots: { customRender: 'bizStatus' },
          filters: [
            { text: '待提货', value: '1' },
            { text: '运输中', value: '2' },
            { text: '已送达', value: '3' }
          ]
        },
        {
          title: '要求提货时间',
          key: 'pickupTime',
          defaultShow: true,
          dataIndex: 'pickupTime',
          width: 150,
          scopedSlots: { customRender: 'pickupTime' }
        },
        {
          title: '要求送达时间',
          key: 'arrivalTime',
          defaultShow: true,
          dataIndex: 'arrivalTime',
          width: 150,
          scopedSlots: { customRender: 'arrivalTime' }
        },
        {
          title: '备注',
          key: 'remark',
          width: 140,
          dataIndex: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: 140,
          fixed: 'right',
          defaultShow: true,
          scopedSlots: { customRender: 'action' }
        }
      ]
      return cols
    }
  },
  methods: {
    init () {
      this.getAllStatusList()
    },
    // 提交
    handleQuery (e) {
      console.log('queryParam:', this.queryParam)
      this.handleDateTimeConditions()
      this.$refs.table.refresh()
    },
    handleReset (pageOne) {
      this.queryParam = {}
      this.startValue = undefined
      this.endValue = undefined
      this.filterInfo = null
      this.$refs.table.refresh(pageOne)
    },
    /* handleOneKeyNotify () {
      // 批量处理一键通知here
      let ids = []
      this.selectedRows.forEach(row => {
        ids.push(row.dispatchId)
      })
      this.oneKeyNotifyWrapper(ids)
    }, */
    handleFindDriver (record) {
      console.log('handleFindDriver (record)', record)
      this.currentDispatchId = record.dispatchId
      this.isFindDriverShow = true
    },
    handleNotify (record) {
      // 处理单个调度单的通知功能 here
      console.log('handleNotify (record)', record)
      this.oneKeyNotifyWrapper([record.dispatchId])
    },
    handleDelete (record) {
      console.log('handleDelete(record):', record)
      deleteDispatchById({ dispatchId: record.dispatchId }).then(res => {
        this.$message.success('删除成功')
        this.$refs.table.refresh()
      })
    },
    oneKeyNotifyWrapper (dispatchids) {
      console.log('dispatchids', dispatchids)
      if (dispatchids.length > 0) {
        oneKeyNotify({ dispatchids: dispatchids }).then(res => {
          this.$message.success('通知成功')
          this.$refs.table.refresh()
        })
      } else {
        this.$message.error('请选择要一键通知的调度单')
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 自定义列表回调
    handleCheked (checkList) {
      this.selectedColumns = this.columns.filter(function (item) {
        if (checkList.includes(item.key)) {
          return item
        }
      })
      this.$ls.set('DDDispatchSelectedCols_1', this.selectedColumns)
      this.updateColumnWidth()
    },
    updateColumnWidth () {
      this.scrollX = this.selectedColumns.reduce((res, col) => {
        return (res += col.width)
      }, 0)
      console.log('scrollX值更新', this.scrollX)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleDetail (record) {
      let toRoute = { name: 'dispatchDetail' }
      if (record.carrierId) toRoute.name = 'shopDetail'
      if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
      this.$router.push(toRoute)
    },
    handleEdit (record) {
      let toRoute = { name: 'assignedVehicle' }
      if (record.carrierId) toRoute.name = 'assignedShop'
      if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
      this.$router.push(toRoute)
    },
    getAllStatusList () {
      getAllDispatchStatus().then(res => {
        this.allStatusList = res.data
      })
    },
    toDecimal2 (val, len) {
      // val 值 len保留小数位数
      var f = parseFloat(val)
      if (isNaN(f)) {
        return false
      }
      f = Math.round(val * Math.pow(10, len)) / Math.pow(10, len)
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + len) {
        s += '0'
      }
      return s
    },
    FindDriverConfirm (record) {
      // 处理找到的司机信息here
      this.$refs.table.refresh()
    },
    FindDriverCancel (e) {
      this.isFindDriverShow = false
    },
    getSumFee (record) {
      // console.log('getSumFee (record)',record)
      return record.settlementArrival + record.settlementCurrent + record.settlementMonth
    },
    autoCompleteBefore (value) {
      console.log('before', value)
      if (this.$refs.autoCompleteDc) {
        // this.$refs.autoCompleteDc.setParams()
      }
      if (this.$refs.autoCompletePn) {

      }
      if (this.$refs.autoCompleteCn) {
        var params = { partnerType: 2, pageSize: 10000 }
        if (value) params.partnerName = value
        this.$refs.autoCompleteCn.setParams(params)
      }
    },
    // 打印
    printDialogShow () {
      if (this.selectedRowKeys.length) {
        this.printLoading = true
        this.$refs.PrintDialogRef.print(this.selectedRows)
      } else {
        this.$message.error('请选择数据')
      }
    }

  }
}
</script>

<style lang="less" scoped>
</style>
