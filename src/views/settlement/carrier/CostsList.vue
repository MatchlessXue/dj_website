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
                  :dataSource="allCarriersList"
                  placeholder="请选择承运商名称"
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
              <a-form-item label="调度时间">
                <a-range-picker
                  :defaultValue="defaultDate"
                  @change="onChangeDate"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="收货区域">
                <a-cascader v-model="queryParam.regionIds"
                            changeOnSelect
                            :options="regionsMap"
                            expandTrigger="hover"
                            :placeholder="`请选择收货区域`" />
              </a-form-item>
            </a-col>

          </a-row>
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <!-- {{settlementStylesMap}} -->
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
                  v-model="queryParam.settlementType" :defaultValue="[220]">
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
      <!-- 添加结算单 -->
      <add-modal ref="addModal" @hideForm="hideForm" />
      <!-- 费用详情 -->
      <!--<costdetail ref="costetail" :isShow="costModallvisible" @hideForm="hideForm" />-->
      <!-- 立即付款 -->
      <immediate-pay-modal ref="immediatePayModal" @hideForm="hideForm"/>

      <div class="table-page-option-wrapper">
        <a-row>
          <a-col
            :md="{span: 12}"
            :sm="12">
            <a-button
              type="primary"
              @click="handleAdd">添加结算单</a-button>
            <a-button
              type="primary"
              @click="handlePay"
              style="margin-left: 12px;">直接付款</a-button>
          </a-col>
          <a-col
            style="text-align: right;"
            :md="{span: 12}"
            :sm="12">
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
        <a slot="totalValue"
            slot-scope="text, record"
            @click="handleSettleTotalValue(record)"
        >{{text}}</a>
      </s-table>
      <document-detail ref="docDetail"></document-detail>
      <cost-detail ref="costDetail"></cost-detail>
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
import { getCostCheckList } from '@/api/settlement/carrier'

import addModal from '@views/settlement/components/AddModel'
import costDetail from '@views/settlement/components/CostDetail'
import ImmediatePayModal from '@views/settlement/components/ImmediatePayModal'
import moment from 'moment'
import DocumentDetail from '@views/settlement/components/DocumentDetail'

export default {
  name: 'carrierCostsList',
  mixins: [ librariesBase, base ],
  components: {
    STable,
    TopNav,
    ImportExport,
    addModal,
    costDetail,
    ImmediatePayModal,
    DocumentDetail
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
      allPartnerList: [], // 客户名称列表
      allCarriersList: [], // 承运方列表
      setCostTypeList: [], // 费用类型
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        settlementStyle: 1,
        settlementType: 220
      },
      // 表头
      columns: [
        {
          title: '运单号',
          width: 200,
          dataIndex: 'waybillCode'
        },
        {
          title: '调度单号',
          width: 200,
          dataIndex: 'dispatchCode'
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
          title: '承运方名称',
          width: 120,
          dataIndex: 'carrierName'
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
        this.queryParam.settlementObjectType = this.objectType // 结算对象 1:客户 2：承运商 3：司机 4：服务商
        const settlementStyle = !this.queryParam.settlementStyle ? 1 : this.queryParam.settlementStyle // 默认月结,不直接改this.queryParam.settlementStyle，否则下拉选框不能选
        const settlementType = !this.queryParam.settlementType ? 1 : this.queryParam.settlementType.toString().substr(1, 1)
        if (parameter.receiptTypeName) {
          parameter.receiptType = parameter.receiptTypeName.toString()
          delete parameter.receiptTypeName
        }
        let find = this.allCarriersList.find(item => {
          return item.partnerId === this.queryParam.partnerId
        })
        console.log('this.allDrivers', find)
        if (find) {
          this.queryParam.commonCarrierId = this.queryParam.partnerId
        } else {
          this.queryParam.commonCarrierName = this.queryParam.partnerId
          delete this.queryParam.partnerId
        }

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
    this.getAllPartnerList() // 获取客户名称信息
    this.getAllCarriersList() // 获取承运商信息
    this.getRegions() // 省市区
    this.getSettlementStylesMap() // 结算方式
    this.costTypeList().then(res => { // 费用类型
      this.setCostTypeList = res.data
    })
  },
  methods: {
    ...mapActions('settlement', [
      'costForm',
      'clientSelectCondiation'
    ]),
    checkSelect () {
      const { selectedRowKeys, selectedRows } = this
      // 校验选择的运单
      if (!selectedRowKeys.length) {
        this.$message.error('请选择运单')
        return false
      }
      let carriers = []
      for (let i = 0; i < selectedRows.length; i++) {
        const el = selectedRows[i]
        // 选择同一承运商
        if (carriers.length === 0 || carriers.includes(el.carrierId)) {
          carriers.push(el.carrierId)
        } else {
          this.$message.error('请选择同一承运商')
          return false
        }
        // 金额校验
        const { waybillCode, settlementStyle, settlementMonth, settlementCurrent, settlementArrival } = el
        if (settlementStyle === globalMap.settlementStyle_yj && settlementMonth <= 0) { // 月结
          this.$message.error(`${waybillCode}的月结金额必须大于0`)
          return false
        } else if (settlementStyle === globalMap.settlementStyle_xf && settlementCurrent <= 0) { // 现付
          this.$message.error(`${waybillCode}的现付金额必须大于0`)
          return false
        } else if (settlementStyle === globalMap.settlementStyle_df && settlementArrival <= 0) { // 到付
          this.$message.error(`${waybillCode}的到付金额必须大于0`)
          return false
        }
      }
      return true
    },
    // 查看详情
    handleSettleDocDetail (record) {
      console.log(record)
      this.$refs.docDetail.getDocDetail(record.settleId)
    },
    // 费用总计
    handleSettleTotalValue (record) {
      this.$refs.costDetail.showModal(record)
    },
    // 新增结算单
    handleAdd () {
      if (this.checkSelect()) {
        this.$refs.addModal.showModal(this.selectedRowKeys)
      }
    },
    // 结算方式change
    settlementStyleChange (val) {
      if (this.queryParam.settlementType !== 220 && val === 3) {
        this.queryParam.settlementStyle = 1
        this.$message.error('赔偿费用与索赔费用不支持到付方式！')
      }
    },
    // 费用类型change
    settlementTypeChange (val) {
      if (val !== 220 && this.queryParam.settlementStyle === 3) {
        this.queryParam.settlementType = 220
        this.$message.error('赔偿费用与索赔费用不支持到付方式！')
      }
    },
    // 立即付款
    handlePay () {
      if (this.checkSelect()) {
        if (this.queryParam.settlementType === 220) {
          this.$refs.immediatePayModal.show(this.selectedRowKeys)
        } else {
          this.$message.error('不支持此种类型的结算单！')
        }
      }
    },
    /**
     * 判断是否点击了费用详情 detail 为true
     */
    hideForm (value) {
      this.selectedRowKeys = []
      if (value.detail) {
        this.costModallvisible = value.detail
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
      this.costForm(this.selectedRows)
      // 将页面选择的数据带入
      this.clientSelectCondiation(this.queryParam)
      console.log(this.selectedRowKeys)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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

    // 承运方名称选择框事件处理方法
    carrierNameChange (value) {
      // console.log(option)
      console.log(`selected ${value}`)
      // this.queryParam.commonCarrierName = value

      for (let i = 0; i < this.allCarriersList.length; i++) {
        if (String(value) === this.allCarriersList[i].partnerId) {
          console.log(this.allCarriersList[i].partnerName)
          this.queryParam.commonCarrierName = this.allCarriersList[i].partnerName
        }
      }
    },
    // 获取承运方列表
    getAllCarriersList () {
      getAllPartners({ partnerTypes: 2 }).then(res => {
        let arr = []
        if (res.data && res.data.length) {
          res.data.forEach((item, index) => {
            arr.push({
              ...item,
              value: item.partnerId,
              text: item.partnerName
            })
          })
        }
        this.allCarriersList = arr
      })
    },
    // 过滤承运方列表
    filterCarrierOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 调度时间回调
    onChangeDate (date, dateString) {
      dateString.length > 0 && (this.queryParam.dispatchStart = dateString[0])
      dateString.length > 1 && (this.queryParam.dispatchEnd = dateString[1])
    },
    handleReset () {
      this.queryParam = {
        settlementStyle: 1,
        settlementType: 220
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
