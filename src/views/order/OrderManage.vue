<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container"
            @keyup.enter="$refs.roleTable.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="客户名称：">
                <!-- <a-select showSearch
                          placeholder="请选择客户名称"
                          optionFilterProp="children"
                          @change="clientNameChange"
                          v-model="queryParam.partnerId"
                          :filterOption="filterOption">
                  <a-select-option v-for="partner in allPartnerList"
                                   :key="partner.partnerId">{{partner.partnerName}}</a-select-option>
                </a-select> -->
                 <a-auto-complete :dataSource="clientNameMap"
                             @change="ClientNameChange"
                             @select="clientSelect"
                             v-model="queryParam.partnerId"
                             placeholder="请选择客户名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="订单号：">
                <a-input v-model="queryParam.waybillCode"
                         placeholder="请输入订单号" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="下单时间：">
                <a-range-picker v-decorator="['orderDate']"
                                :defaultValue="[moment(this.getToday(), dateFormat), moment(this.getToday(), dateFormat)]"
                                :format="'YYYY-MM-DD'"
                                @change="dateOnChange" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="收货方名称：">
                <a-input v-model="queryParam.rvName"
                         placeholder="请输入收货方名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="收货方地址：">
                <a-input v-model="queryParam.rvAddress"
                         placeholder="请输入收货方地址" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button @click="$refs.roleTable.refresh()"
                          type="primary">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false"
            style="margin-top: 10px"
            class="card-container">
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col :md="16"
                 :sm="24">
            <a-button icon="plus"
                      @click="$router.push({ name: 'orderNew' })"
                      type="primary">新增订单</a-button>
            <!-- <a-button
            icon="edit"
            type="primary"
            style="margin-left:10px;"
            >导入订单</a-button> -->
            <!-- <a-button
            icon="edit"
            type="primary"
            style="margin-left:10px;"
            >生成运单</a-button> -->
            <!-- <a-button
            icon="edit"
            type="primary"
            style="margin-left:10px;"
            >接单</a-button> -->
            <!-- <a-button
            icon="edit"
            type="primary"
            style="margin-left:10px;"
            >订单调度</a-button> -->
          </a-col>
          <a-col :md="8"
                 :sm="24"
                 style="text-align: right;">
            <a-button>导出</a-button>
            <CheckboxMulty :plainOptions="columnsOption"
                           :defaultCheckedList="defaultCheckList"
                           @change="handleCheked"
                           style="margin-left:10px;"
                           title="自定义列"></CheckboxMulty>
          </a-col>
        </a-row>

      </div>
      <s-table ref="roleTable"
               size="default"
               :columns="selectedColumns"
               :data="loadData"
               :scroll="{ x: 2200}" bordered
               :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{rowIndex(index)}}
        </span> -->
        <span slot="waybillId"
              slot-scope="text, record">
          <a @click="goDetail(record)">{{text}}</a>
        </span>
        <span slot="statuses"
        slot-scope="text, record">{{record.waybillStatusName}}</span>
        <span slot="action"
              slot-scope="text, record">
          <a @click="orderedit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleRoleDelete(record)">删除</a>
        </span>
      </s-table>

      <part-modal ref="partModal"></part-modal>
    </a-card>
  </div>
</template>

<script>
import { throttle, trim } from 'lodash'

import moment from 'moment'
import STable from '@/components/table/'
import PartModal from './components/PartModal'
import CheckboxMulty from '@/components/CheckboxMulty'
import { orderSelectByPage, orderDelete } from '@/api/order/order'
import { getAllPartners } from '@/api/resource/partner'
export default {
  name: 'TableList',
  components: {
    STable,
    PartModal,
    CheckboxMulty
  },
  data () {
    return {
      partnerId: '',
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      form: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      allPartnerList: [], // 客户名称列表
      clientNameMap: [],

      // 查询参数
      queryParam: {
        partnerId: '',
        waybillCode: '',
        orderEnd: '',
        orderStart: this.getToday(),
        rvName: '',
        rvAddress: '',
        // page: '1',
        // pageSize: '10',
        orderCode: ''
      },
      // 表头
      columns: [
        // {
        //   title: '序号',
        //   scopedSlots: { customRender: 'serial' }
        // },
        // {
        //   title: '序号',
        //   render:(text,record,index)=>`${index+1}`,
        // },
        {
          title: '订单号',
          dataIndex: 'waybillCode',
          key: 'waybillCode',
          width: 120,
          fixed: 'left',
          scopedSlots: { customRender: 'waybillId' }
        },
        {
          title: '客户名称',
          dataIndex: 'partnerName',
          key: 'partnerName',
          width: 200
        },
        {
          title: '客户单号',
          dataIndex: 'clientCode',
          key: 'clientCode',
          width: 150
        },
        {
          title: '发货区域',
          dataIndex: 'sdAddressArea',
          key: 'sdAddressArea',
          width: 150
        },
        {
          title: '发货方名称',
          dataIndex: 'sdName',
          key: 'sdName',
          width: 150
        },
        {
          title: '收货区域',
          dataIndex: 'rvAddressArea',
          key: 'rvAddressArea',
          width: 150
        },
        {
          title: '收货方名称',
          dataIndex: 'rvName',
          key: 'rvName',
          width: 150
        },
        {
          title: '收货方地址',
          dataIndex: 'rvAddress',
          key: 'rvAddress',
          width: 150
        },
        {
          title: '订单状态',
          dataIndex: 'statuses',
          key: 'statuses',
          width: 150,
          scopedSlots: { customRender: 'statuses' },
          filters: [
            { text: '待接单', value: '1' },
            { text: '已接单', value: '2' },
            { text: '待调度', value: '3' },
            { text: '待派车', value: '4' },
            { text: '待提货', value: '5' },
            { text: '运输中', value: '8' },
            { text: '已送达', value: '10' },
            { text: '已取消', value: '0' }
          ]
        },
        {
          title: '件数',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          width: 150
        },
        {
          title: '重量(kg)',
          dataIndex: 'totalTargetWeight',
          key: 'totalTargetWeight',
          width: 150
        },
        {
          title: '体积(m³)',
          dataIndex: 'totalTargetVolume',
          key: 'totalTargetVolume',
          width: 150
        },
        {
          title: '排序',
          key: 'sort',
          width: 150,
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '创建时间',
          dataIndex: 'recTime',
          width: 200,
          key: 'recTime',
          sorter: true
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'action',
          key: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedColumns: [],
      // 加载数据方法 必须为 Promise 对象

      loadData: params => {
        console.log('params', params)
        // this.queryParam.partnerId = this.tenantId
        console.log('111', this.queryParam)
        return orderSelectByPage(Object.assign(params, this.queryParam)).then(
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
  created () {
    this.queryParam.orderStart = this.getToday()
    this.queryParam.orderEnd = this.getToday()
    this.selectedColumns = this.columns.slice(0)
    // this.orderSelectByPage({})
  },
  computed: {
    columnsOption () {
      return this.columns.map(function (item) {
        console.log(item)
        // console.log({ label: item.title, value: item.key, disabled: item.fixed });
        // return { label: item.title, value: item.key, disabled: item.fixed }，
        return { label: item.title, value: item.key }
      })
    },
    defaultCheckList () {
      return this.columns.map(function (item) {
        return item.key
      })
    }
  },
  mounted () {
    this.getAllPartnerList() // 获取客户名称信息
    this.init()
  },
  methods: {
    moment,
    getToday () {
      let DD = new Date()
      DD.setTime(DD.getTime())
      let TT = DD.getMonth() + 1
      let AA = DD.getDate()

      if (TT < 10) {
        TT = '0' + TT
      }
      if (AA < 10) {
        AA = '0' + AA
      }
      let s2 = DD.getFullYear() + '-' + TT + '-' + AA
      console.log(s2)
      return s2
    },
    // 客户名称选择框事件处理方法
    init () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        const datas = res.data || []
        this.clientNameList = res.data
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach((val) => {
          source.push({ value: val.partnerId, text: val.partnerName, some: val })
        })
        this.clientNameMap = source
      })
    },
    ClientNameChange: throttle(async function (v) {
      console.log(v)
      if (v === '') {
        this.init()
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
          self.clientNameList = res.data
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.partnerId, text: val.partnerName, some: val })
          })
          self.clientNameMap = source
        })
      }
    }, 500),
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    },

    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    dateOnChange (date, dateString) {
      console.log('time', date)
      console.log('aa', dateString)
      this.queryParam.orderStart = dateString[0]
      this.queryParam.orderEnd = dateString[1]
    },
    // 修改订单
    orderedit (record) {
      console.log('xiug', record.waybillStatus)
      if (record.waybillStatus === 0 || record.waybillStatus === 1 || record.waybillStatus === 2 || record.waybillStatus === 3) {
        this.$router.push({
          name: 'OrderEdit',
          params: { id: record.waybillId }
        })
      } else {
        this.$message.error('不能修改订单')
      }
      // this.$router.push({ name: 'OrderEdit' })
    },
    // 订单详情页
    goDetail (record) {
      console.log('____detail', record)
      console.log('aa', record.waybillId)
      this.$router.push({
        name: 'orderDetail',
        params: { id: record.waybillId }
      })
    },
    handleCheked (checkList) {
      // 过滤
      this.selectedColumns = this.columns.filter(function (item) {
        if (checkList.includes(item.key)) {
          // 在免登录白名单，直接进入
          return item
        }
      })
    },
    rowIndex (index) {
      const { current, pageSize } = this.$refs.roleTable.localPagination
      return (current - 1) * pageSize + index
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleRoleDelete (record) {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定要删除${record.partnerName}吗 ?`,
        onOk () {
          return orderDelete({ orderId: record.waybillId }).then(res => {
            that.$refs.roleTable.refresh()
          })
        }
      })
    },
    // 权限
    // handleEdit (record) {
    //   this.mdl = Object.assign({}, record)

    //   this.mdl.permissions.forEach(permission => {
    //     permission.actionsOptions = permission.actionEntitySet.map(action => {
    //       return {
    //         label: action.describe,
    //         value: action.action,
    //         defaultCheck: action.defaultCheck
    //       }
    //     })
    //   })

    //   console.log(this.mdl)
    //   this.visible = true
    // },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
<style lang="less" scoped>
</style>
