<template>
  <div class="page-container">
    <a-card
      :bordered="false"
      class="card-container tabbar-container">
      <top-nav :items='tabItems'></top-nav>
    </a-card>
    <a-card :bordered="false" class = "card-container" @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="调度单号">
                <a-input
                  v-model="queryParam.dispatchCode"
                  placeholder="请输入调度单号"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="结算对象">
                <a-auto-complete
                  :dataSource="allDriverList"
                  placeholder="请选择司机名称"
                  v-model="queryParam.driverId"
                  @change="partnerNameChange">
                </a-auto-complete>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="车牌号码">
                <a-input
                  v-model="queryParam.plateNumber"
                  placeholder="请输入车牌号码"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="运输方式">
                <a-select
                  allowClear
                  showSearch
                  placeholder="请选择运输方式"
                  :filterOption="true"
                  v-model="queryParam.transportType" defaultValue="1">
                  <a-select-option v-for="d in transportTypeMap" :key="d.dictId">
                    {{d.dictName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="调度时间">
                   <!--:defaultValue="[defaultDate, defaultDate]"-->
                <a-range-picker
                  :defaultValue="defaultDate"
                  format="YYYY-MM-DD"
                  @change="onChangeDate"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="结算方式">
                <a-select
                  @change="settlementStyleChange"
                  placeholder="请选择结算方式"
                  v-model="queryParam.settlementStyle">
                  <a-select-option v-for="d in settlementStylesMap" :key="d.dictId">
                    {{d.dictName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="费用类型">
                <a-select
                  @change="settlementTypeChange"
                  placeholder="运输费用"
                  v-model="queryParam.settlementType">
                  <a-select-option v-for="d in setCostTypeList" :key="d.code">
                    {{d.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.table.refresh()"
                >查询</a-button>
                <a-button
                  @click="resetQuery"
                  style="margin-left: 12px;"
                >重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card
      :bordered="false"
      style="margin-top: 10px" class="card-container"
    >
      <!-- 添加结算单 -->
      <add-modal ref="addModal" @hideForm="hideForm" />
      <!-- 费用详情 -->
      <costdetail ref="costdetail" :isShow="costModallvisible" @hideForm="hideForm" />
      <!-- 立即付款 -->
      <immediate-pay-modal ref="immediatePayModal" @hideForm="hideForm"/>

      <div class="table-page-option-wrapper">
        <a-row>
          <a-col
            :md="{span: 12}"
            :sm="12"
          >
            <a-button
              type="primary"
              @click="handleAdd"
            >添加结算单</a-button>
            <a-button
              type="primary"
              @click="handlePay"
              style="margin-left: 12px;"
            >直接付款</a-button>
          </a-col>
          <a-col
            style="text-align: right;"
            :md="{span: 12}"
            :sm="12"
          >
            <import-export />
          </a-col>
        </a-row>
      </div>
      <s-table
        ref="table"
        size="default"
        bordered
        :scroll="{ x: scrollX}"
        :columns="columns"
        :data="loadData"
        :showAlertInfo="false"
        rowKey="settleId"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @onSelect="onChange"
      >
        <a slot="driverName"
          slot-scope="text, record"
          @click="handleDetail(record)"
        >{{text}}</a>
        <a slot="totalValue"
           slot-scope="text, record"
           @click="handleSettleTotalValue(record)"
        >{{text}}</a>

        <a slot="bizStatus"
           slot-scope="text, record">{{record.bizStatusName}}</a>

      </s-table>
    </a-card>
  </div>
</template>

<script>
import { throttle, trim } from 'lodash'
import { mapActions } from 'vuex'
import STable from '@/components/table'
import ImportExport from '@/components/ImportExport'
import TopNav from '@/components/tabs/'

import { globalMap } from '@/api/global'
import base from './mixins/base'
import librariesBase from '@/views/mixins/libraries_base'
import { countCollumnsWidth } from '@/utils/util'
import { getAllDrivers } from '@/api/resource/driver'
import { getCostCheckList } from '@/api/settlement/driver'

import addModal from '@views/settlement/components/AddModel'
import costdetail from '@views/settlement/components/CostDetail'
import ImmediatePayModal from '@views/settlement/components/ImmediatePayModal'
import moment from 'moment'

export default {
  name: 'driverCostsList',
  mixins: [ librariesBase, base ],
  components: {
    STable,
    TopNav,
    ImportExport,
    addModal,
    ImmediatePayModal,
    costdetail
  },
  data () {
    return {
      visible: false,
      costModallvisible: false,
      mixins: [ librariesBase, base ],
      form: null,
      mdl: {},
      statusEnable: globalMap.statusEnable, // 启用状态
      defaultDate: [moment(this.getFirstDay(), 'YYYY-MM-DD'), moment(this.getLastDay(), 'YYYY-MM-DD')],
      queryDate: [],
      allDriverList: [], // 司机名称列表
      allCarriersList: [], // 承运方列表
      setCostTypeList: [], // 费用类型
      advanced: false, // 高级搜索 展开/关闭
      // 查询参数
      queryParam: {
        settlementStyle: 1,
        settlementType: undefined,
        transportType: undefined,
        plateNumber: undefined,
        driverId: undefined,
        dispatchCode: undefined
      },
      // 表头
      columns: [
        {
          title: '调度单号',
          width: 200,
          dataIndex: 'dispatchCode',
          scopedSlots: { customRender: 'dispatchCode' }
        },
        {
          title: '车牌号',
          width: 100,
          dataIndex: 'plateNumber'
        },
        {
          title: '司机姓名',
          width: 100,
          dataIndex: 'driverName'
        },
        {
          title: '司机手机号',
          width: 140,
          dataIndex: 'mobile'
        },
        {
          title: '车辆类型',
          width: 150,
          dataIndex: 'truckTypeName'
        },
        {
          title: '调度单类型',
          width: 150,
          dataIndex: 'dispatchTypeName'
        },
        {
          title: '运输方式',
          width: 140,
          dataIndex: 'transportTypeName'
        },
        {
          title: '调度单时间',
          width: 200,
          dataIndex: 'createDate'
        },
        {
          title: '件数',
          width: 100,
          dataIndex: 'totalAmount'
        },
        {
          title: '重量(kg)',
          width: 100,
          dataIndex: 'totalWeight'
        },
        {
          title: '体积',
          width: 100,
          dataIndex: 'totalVolume'
        },
        {
          title: '费用总计',
          width: 100,
          dataIndex: 'totalValue'
          // scopedSlots: { customRender: 'totalValue' }
        },
        {
          title: '现付金额',
          width: 100,
          dataIndex: 'settlementCurrent'
        },
        {
          title: '到付金额',
          width: 100,
          dataIndex: 'settlementArrival'
        },
        {
          title: '月结金额',
          width: 100,
          dataIndex: 'settlementMonth'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.selectedRowKeys = []
        this.selectedRows = []
        console.log(parameter, 'queryParam=', this.queryParam)
        this.queryParam.settlementObjectType = this.objectType // 结算对象 1:客户 2：承运商 3：司机 4：服务商
        const settlementStyle = !this.queryParam.settlementStyle ? 1 : this.queryParam.settlementStyle // 默认月结,不直接改this.queryParam.settlementStyle，否则下拉选框不能选
        const settlementType = !this.queryParam.settlementType ? 2 : this.queryParam.settlementType.toString().substr(1, 1)

        return getCostCheckList(Object.assign(parameter, this.queryParam, { settlementStyle, settlementType })).then(
          res => {
            console.log('res data==', res)
            return res.data
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  created () {
    this.getAllPartnerList() // 获取司机名称信息
    this.getSettlementStylesMap() // 结算方式
    this.getTransportTypeMap() // 运输方式
    this.costTypeList().then(res => { // 费用类型
      this.setCostTypeList = res.data
      if (res.data && res.data.length) {
        this.queryParam.settlementType = res.data[0].code
      }
      console.log('查看费用类型', res.data)
    })
    // this.initDate()
  },
  methods: {
    ...mapActions('settlement', [
      'costForm',
      'clientSelectCondiation'
    ]),
    // 重置
    resetQuery () {
      this.queryParam.transportType = undefined
      this.queryParam.plateNumber = undefined
      this.queryParam.driverId = undefined
      this.queryParam.dispatchCode = undefined
      // this.initDate()
    },
    checkSelect () {
      const { selectedRowKeys, selectedRows } = this
      // 校验选择的运单
      if (!selectedRowKeys.length) {
        this.$message.error('请选择调度单')
        return false
      }
      let carriers = []
      for (let i = 0; i < selectedRows.length; i++) {
        const el = selectedRows[i]
        // 选择同一司机
        if (carriers.length === 0 || carriers.includes(el.mobile)) {
          carriers.push(el.mobile)
        } else {
          this.$message.error('请选择同一司机')
          return false
        }
        // 金额校验
        const { dispatchCode, settlementStyle, settlementMonth, settlementCurrent, settlementArrival } = el
        if (settlementStyle === globalMap.settlementStyle_yj && settlementMonth <= 0) { // 月结
          this.$message.error(`${dispatchCode}的月结金额必须大于0`)
          return false
        } else if (settlementStyle === globalMap.settlementStyle_xf && settlementCurrent <= 0) { // 现付
          this.$message.error(`${dispatchCode}的现付金额必须大于0`)
          return false
        } else if (settlementStyle === globalMap.settlementStyle_df && settlementArrival <= 0) { // 到付
          this.$message.error(`${dispatchCode}的到付金额必须大于0`)
          return false
        }
      }
      return true
    },
    // 新增结算单
    handleAdd () {
      if (this.checkSelect()) {
        this.$refs.addModal.showModal(this.selectedRowKeys)
      }
    },
    // 立即付款
    handlePay () {
      if (this.checkSelect()) {
        if (this.queryParam.settlementType === 320) {
          this.$refs.immediatePayModal.show(this.selectedRowKeys)
        } else {
          this.$message.error('不支持此种类型的结算单！')
        }
      }
    },
    /**
     * 判断是否点击了费用详情 detail 为true
     */
    handleSettleTotalValue (record) {
      this.$refs.costdetail.showModal(record)
    },
    hideForm (value) {
      this.selectedRowKeys = []
      if (value.detail) {
        this.costModallvisible = value.detail
      } else {
        this.$refs.table.refresh()
      }
    },
    handleEdit (record) {
      console.log('handleEdit.record.', record)
      this.$router.push({
        name: 'driverUpdateForm',
        params: { id: record.driverId }
      })

      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      this.visible = true
    },
    // 查看详情
    handleDetail (record) {
      this.$router.push({
        name: 'driverDetail',
        params: { id: record.driverId }
      })
    },
    onChange (row) {
      // console.log('row......', row)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.costForm(this.selectedRows) // 将页面选择的数据带入
      this.clientSelectCondiation(this.queryParam)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 结算方式change
    settlementStyleChange (val) {
      if (this.queryParam.settlementType !== 320 && val === 3) {
        this.queryParam.settlementStyle = 1
        this.$message.error('赔偿费用与索赔费用不支持到付方式！')
      }
    },
    // 费用类型change
    settlementTypeChange (val) {
      if (val !== 110 && this.queryParam.settlementStyle === 3) {
        this.queryParam.settlementType = this.setCostTypeList[0].code
        this.$message.error('赔偿费用与索赔费用不支持到付方式！')
      }
    },
    // 客户名称选择框事件处理方法
    partnerNameChange: throttle(async function (v) {
      if (v === '') {
        this.getAllPartnerList()
        return
      }
      const key = trim(v)
      // 重置表单的值
      // this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        await getAllDrivers({ driverName: key, page: 1, pageSize: 1000 }).then((res) => {
          const datas = res.data.records || []
          self.clientNameList = res.data.records
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.driverId, text: val.driverName })
          })
          self.allDriverList = source
        })
      }
    }, 500),
    // 获取司机列表
    getAllPartnerList () {
      getAllDrivers({ page: 1, pageSize: 100000 }).then(res => {
        let datas = []
        if (res.data && res.data.length) {
          this.clientNameList = res.data
          datas = res.data
        }
        if (res.data.records && res.data.records.length) {
          this.clientNameList = res.data.records
          datas = res.data.records
        }
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach((val) => {
          source.push({ value: val.driverId, text: val.driverName })
        })
        console.log('获取司机=============================', source)
        this.allDriverList = source
      })
    },
    // 过滤司机列表
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    initDate () {
      this.defaultDate = moment(new Date(), 'YYYY-MM-DD')
      this.queryDate = [this.defaultDate, this.defaultDate]
      this.onChangeDate(null, [this.defaultDate.format('YYYY-MM-DD'), this.defaultDate.format('YYYY-MM-DD')])
    },
    // 调度时间回调
    onChangeDate (date, dateString) {
      dateString.length > 0 && (this.queryParam.dispatchStart = dateString[0])
      dateString.length > 1 && (this.queryParam.dispatchEnd = dateString[1])
      // dateString.length > 0 && (this.queryParam.dispatchStart = `${dateString[0]}` + (!dateString[0] ? '' : ' 00:00:00'))
      // dateString.length > 1 && (this.queryParam.dispatchEnd = `${dateString[1]}` + (!dateString[0] ? '' : ' 23:59:59'))
    },
    getFirstDay () {
      let date = new Date()
      let monthStart = date.setDate(1)
      return moment(monthStart).format('YYYY-MM-DD')
    },
    getLastDay () {
      let date = new Date()
      let currentMonth = date.getMonth()
      let nextMonth = ++currentMonth
      let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      let oneDay = 1000 * 60 * 60 * 24
      return moment(nextMonthFirstDay - oneDay).format('YYYY-MM-DD')
    }
  },
  watch: {}
}
</script>

<style lang="less">

</style>
