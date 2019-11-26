<template>
  <div class="page-container">
    <div style="background:#fff" v-if="type === 'customer'" :bordered="false" class="card-container tabbar-container">
      <top-nav :items='tabItems'></top-nav>
    </div>
    <a-card :bordered="false" @keyup.enter="$refs.table.refresh()" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item :label="queryConfig.partnerName">
                <a-input v-model="queryParam.partnerName" :placeholder="`请输入${queryConfig.partnerName}`"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
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
            <a-button type="primary" icon="plus" @click="handleAdd">{{queryConfig.addBtn}}</a-button>
          </a-col>
          <a-col style="text-align: right;" :md="{span: 12}" :sm="12">
            <a-button @click="importDriver">导入</a-button>
            <a-button style="margin-left:10px" @click="$refs.importHistoryRef.add(6, partnerType)">导入历史</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" bordered :scroll="{x:1000}" size="default" :columns="columns" :data="loadData" :showAlertInfo="false"
               :rowKey="record => record.partnerId" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleChange" @onSelect="onChange">
        <a slot="partnerName" slot-scope="text, record" @click="handleDetail(record)">{{text}}</a>

        <span slot="bizStatus" slot-scope="text, record">
          <a-badge :status="record.bizStatus === djConsts.ENABLE_STATUS_CONST.DISABLED ? 'default' : 'success'"/>
          {{ djConsts.ENABLE_STATUS_CONST[text] }}
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"/>

          <a @click="handleStatus(record)">
            {{ djConsts.ENABLE_STATUS_CONST.getToggleName(record.bizStatus) }}</a>
        </span>
      </s-table>
      <import-template ref="importPartnerRef" :templateType="6" :templateSubType="partnerType"
      @success="importDriverSuccess" :title="'导入' + (partnerType === 1 ? '客户' : '承运商')  + '信息'">
      </import-template>
      <import-history ref="importHistoryRef"></import-history>
    </a-card>
  </div>

</template>

<script>
import STable from '@/components/table'
import ImportExport from '@/components/ImportExport'
import ImportTemplate from '@/components/ImportTemplate/' // 导入
import ImportHistory from '@/views/resource/components/ImportHistory' // 导入历史
import AInput from 'ant-design-vue/es/input/Input'
// import ConfirmInfo from '@/components/ConfirmInfo'

import { getPartnerList, setPartnerStatus } from '@/api/resource/partner'
import { globalMap } from '@/api/global'

import TopNav from '@/components/tabs/'
import base from '@/views/resource/mixins/base'

import {
  getColumns,
  getQueryConfig,
  getType,
  getRouterNames,
  getPartnerTypes
} from './config'

export default {
  name: 'CustomerList',
  mixins: [ base ],
  components: {
    AInput,
    ImportExport,
    ImportTemplate,
    ImportHistory,
    STable,
    TopNav
    // ConfirmInfo
  },
  data () {
    const type = getType(this)
    return {
      first: false,
      type, // 类型：客户，承运商，第三方
      queryConfig: getQueryConfig(type), // 查询的配置项
      routerNames: getRouterNames(type), // router名称
      partnerType: getPartnerTypes(type),
      statusEnable: globalMap.statusEnable, // 启用状态
      visible: false,
      pagination: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: getColumns(type),
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('this.partnerTypes[type]==', this.partnerType, type)
        if (this.first === true) this.queryParam.page = 1
        this.first = false
        return getPartnerList(
          Object.assign(parameter, this.queryParam, {
            partnerType: this.partnerType
          })
        ).then(res => {
          console.log('res data==', res)
          return res.data
        })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  watch: {
    $route (to, from) {
      this.first = true
      this.type = getType(this)
      this.queryConfig = getQueryConfig(this.type)
      this.columns = getColumns(this.type)
      this.routerNames = getRouterNames(this.type)
      this.partnerType = getPartnerTypes(this.type)
      this.queryParam.partnerName = ''
      this.$refs.table.refresh()
      this.handleReset()
      console.log('columns', this.columns)
    }
  },
  created () {
    console.log(this.type)
    console.log('columns', this.columns)
  },
  methods: {
    go (key) {
      const urls = [
        'siteaddressSend', // 新建发货方
        'siteaddressReceive', // 新建收货方
        'cargo', // 新建货物
        'contractList' // 新建合同
      ]
      this.$router.push({
        name: urls[key]
      })
    },
    // 导入客户承运商相关
    importDriver () {
      if (this.$refs.importPartnerRef) this.$refs.importPartnerRef.showModal()
    },
    importDriverSuccess (res) {
      console.log('导入成功')
      console.log('importTempSuccess (res)', res)
      this.$refs.table.refresh()
    },
    handleReset () {
      this.queryParam = {}
    },
    handleAdd () {
      this.$router.push({
        name: this.routerNames.add,
        params: { type: this.type }
      })
    },
    handleEdit (record) {
      console.log('handleEdit.record.', record)
      this.$router.push({
        name: this.routerNames.update,
        params: { id: record.partnerId, type: this.type }
      })

      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      this.visible = true
    },
    // 查看详情
    handleDetail (record) {
      this.$router.push({
        name: this.routerNames.detail,
        params: { id: record.partnerId, type: this.type }
      })
    },
    // 启用 停用
    handleStatus (record) {
      console.log('handleStatus.record.', record)
      setPartnerStatus({ partnerId: record.partnerId }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    // handleOk () {

    // },
    handleChange (pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      this.filteredInfo = filters
      this.sortedInfo = sorter
    },
    onChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        // date: moment(new Date())
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
