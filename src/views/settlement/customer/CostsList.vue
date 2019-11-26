<template>
  <div class="page-container">
    <a-card
      :bordered="false"
      class="card-container tabbar-container"
    >
      <top-nav :items='tabItems'></top-nav>
    </a-card>
    <a-card :bordered="false" class = "card-container" @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="结算对象">
                <a-auto-complete
                  :dataSource="allPartnerList"
                  placeholder="请选择客户名称"
                  v-model="queryParam.partnerId"
                  @change="partnerNameChange">
                </a-auto-complete>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="运单号">
                <a-input
                  v-model="queryParam.waybillCode"
                  placeholder="请输入运单号"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="收货方名称">
                <a-input
                  v-model="queryParam.rvName"
                  placeholder="请输入收货方名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="收货方地址">
                <a-input
                  v-model="queryParam.rvAddress"
                  placeholder="请输入收货方地址"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="下单时间">
                <a-range-picker
                  allowClear
                  :defaultValue="defaultDate"
                  @change="onChangeDate"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="结算方式">
                <a-select
                  @change="settlementStyleChange"
                  placeholder="请选择结算方式"
                  v-model="queryParam.settlementStyle" :defaultValue="[1]">
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
                  v-model="queryParam.settlementType" :defaultValue="[110]">
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
                  @click="handleReset"
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
      <!-- 新增结算单窗口 -->
      <add-modal ref="addModal" @hideForm="hideForm" />
      <!-- 费用详情 -->
      <costdetail ref="costDetail" :isShow="costModallvisible" @hideForm="hideForm" />

      <div class="table-page-option-wrapper">
        <a-row>
          <a-col :md="12" :sm="12">
            <a-button type="primary" @click="handleAdd">添加结算单</a-button>
          </a-col>
          <a-col :md="12" :sm="12" style="text-align: right;">
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
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
import { getAllPartners } from '@/api/resource/partner'
import { getCostCheckList } from '@/api/settlement/customer'
import addModal from '@views/settlement/components/AddModel'
import costdetail from '@views/settlement/components/CostDetail'
import moment from 'moment'

export default {
  name: 'customerCostsList',
  mixins: [ librariesBase, base ],
  components: {
    STable,
    TopNav,
    ImportExport,
    addModal,
    costdetail
  },
  data () {
    return {
      visible: false,
      costModallvisible: false,
      setCostTypeList: [],
      form: null,
      mdl: {},
      statusEnable: globalMap.statusEnable, // 启用状态
      defaultDate: [moment(this.getFirstDay(), 'YYYY-MM-DD'), moment(this.getLastDay(), 'YYYY-MM-DD')],
      allPartnerList: [], // 客户名称列表
      advanced: false, // 高级搜索 展开/关闭
      // 查询参数
      queryParam: {
        settlementStyle: 1,
        settlementType: 110
      },
      // 表头
      columns: [
        {
          title: '运单号',
          width: 200,
          dataIndex: 'waybillCode',
          scopedSlots: { customRender: 'waybillCode' }
        },
        {
          title: '客户名称',
          width: 100,
          dataIndex: 'partnerName'
        },
        {
          title: '客户单号',
          width: 100,
          dataIndex: 'clientCode'
        },
        {
          title: '发货区域',
          width: 150,
          dataIndex: 'sdAddressArea'
        },
        {
          title: '收货区域',
          width: 150,
          dataIndex: 'rvAddressArea'
        },
        {
          title: '收货方名称',
          width: 140,
          dataIndex: 'rvName'
        },
        {
          title: '收货方地址',
          width: 120,
          dataIndex: 'rvAddress'
        },
        {
          title: '回单状态',
          width: 130,
          dataIndex: 'receiptTypeName',
          needTotal: true,
          filterMultiple: true,
          filters: [
            { text: '全部', value: '' },
            { text: '未签收', value: '1' },
            { text: '已签收', value: '2' },
            { text: '已登记', value: '3' },
            { text: '已寄出', value: '4' },
            { text: '货主签收', value: '5' }
          ],
          scopedSlots: {
            customRender: 'waybillStatus'
          }
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
          title: '结算对象',
          width: 100,
          dataIndex: 'projectName'
        },
        {
          title: '费用录入时间',
          width: 150,
          dataIndex: 'entryTime'
        },
        {
          title: '费用总计',
          width: 100,
          dataIndex: 'totalValue'
          // scopedSlots: {
          //   customRender: 'totalValue'
          // }
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
        this.queryParam.settlementObjectType = this.objectType // 结算对象 1:客户 2：承运商 3：司机 4：服务商
        const settlementStyle = !this.queryParam.settlementStyle ? 1 : this.queryParam.settlementStyle // 默认月结,不直接改this.queryParam.settlementStyle，否则下拉选框不能选
        const settlementType = !this.queryParam.settlementType ? 1 : this.queryParam.settlementType.toString().substr(1, 1) // 默认运输费用,费用类型为索赔费用、赔偿费用时，结算方式只支持选择现付、月结
        if (parameter.receiptTypeName) {
          parameter.receiptType = parameter.receiptTypeName.toString()
          delete parameter.receiptTypeName
        }
        return getCostCheckList(Object.assign(parameter, this.queryParam, { settlementStyle, settlementType })).then(
          res => {
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
    this.getAllPartnerList() // 获取客户名称信息
    this.getRegions() // 省市区
    this.getSettlementStylesMap() // 结算方式
    this.costTypeList().then(res => { // 费用类型
      this.setCostTypeList = res.data
    })
  },
  mounted () {

  },
  methods: {
    ...mapActions('settlement', [
      'costForm',
      'clientSelectCondiation'
    ]),
    handleAdd () {
      const { selectedRowKeys, selectedRows } = this
      // 校验选择的运单
      if (!selectedRowKeys.length) {
        this.$message.error('请选择运单')
        return
      }
      let carriers = []
      for (let i = 0; i < selectedRows.length; i++) {
        const el = selectedRows[i]
        // 选择同一客户
        if (carriers.length === 0 || carriers.includes(el.partnerId)) {
          carriers.push(el.partnerId)
        } else {
          this.$message.error('请选择同一客户')
          return
        }
        // 同一结算方式

        // 金额校验
        const { waybillCode, settlementStyle, settlementMonth, settlementCurrent, settlementArrival } = el
        if (settlementStyle === globalMap.settlementStyle_yj && settlementMonth <= 0) { // 月结
          this.$message.error(`${waybillCode}的月结金额必须大于0`)
          return
        } else if (settlementStyle === globalMap.settlementStyle_xf && settlementCurrent <= 0) { // 现付
          this.$message.error(`${waybillCode}的现付金额必须大于0`)
          return
        } else if (settlementStyle === globalMap.settlementStyle_df && settlementArrival <= 0) { // 到付
          this.$message.error(`${waybillCode}的到付金额必须大于0`)
          return
        }
      }

      this.$refs.addModal.showModal(selectedRowKeys)
    },
    /**
     * 判断是否点击了费用详情 detail 为true
     */
    hideForm (value) {
      this.selectedRowKeys = []
      if (value.detail) {
        this.$refs.costDetail.showModal(value.record)
      } else {
        this.$refs.table.refresh()
      }
    },
    handleEdit (record) {
      this.$router.push({
        name: 'driverUpdateForm',
        params: { id: record.driverId }
      })
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    // 费用总计
    handleSettleTotalValue (record) {
      this.$refs.costDetail.showModal(record)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.costForm(this.selectedRows)
      // 将页面选择的数据带入
      this.clientSelectCondiation(this.queryParam)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 结算方式change
    settlementStyleChange (val) {
      if (this.queryParam.settlementType !== 110 && val === 3) {
        this.queryParam.settlementStyle = 1
        this.$message.error('赔偿费用与索赔费用不支持到付方式！')
      }
    },
    // 费用类型change
    settlementTypeChange (val) {
      if (val !== 110 && this.queryParam.settlementStyle === 3) {
        this.queryParam.settlementType = 110
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
        await getAllPartners({ partnerName: key, partnerTypes: 1 }).then((res) => {
          const datas = res.data || []
          self.allPartnerList = res.data
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.partnerId, text: val.partnerName })
          })
          self.allPartnerList = source
        })
      }
    }, 500),
    // 获取客户列表
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        const datas = res.data || []
        this.clientNameList = res.data
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach((val) => {
          source.push({ value: val.partnerId, text: val.partnerName })
        })
        this.allPartnerList = source
      })
    },
    // 过滤客户列表
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 调度时间回调
    onChangeDate (date, dateString) {
      dateString.length > 0 && (this.queryParam.orderStart = dateString[0])
      dateString.length > 1 && (this.queryParam.orderEnd = dateString[1])
    },
    handleReset () {
      this.queryParam = {
        settlementStyle: 1,
        settlementType: 110
      }
      this.defaultDate = moment()
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
