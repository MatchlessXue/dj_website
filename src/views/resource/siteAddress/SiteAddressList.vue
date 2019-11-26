<template>
  <div class="page-container">
    <div style="background:#fff" :bordered="false" class="card-container tabbar-container">
      <top-nav :items='tabItems'></top-nav>
    </div>
    <a-card :bordered="false" class="card-container"  @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="客户名称">
                <a-select showSearch placeholder="请选择客户名称"
                          optionFilterProp="children"
                          v-model="queryParam.partnerId"
                          :allowClear="true"
                          :filterOption="filterOption">
                  <a-select-option v-for="partner in allPartnerList" :key="partner.partnerId">{{partner.partnerName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="config.siteName">
                <a-select showSearch :placeholder="`请选择${config.siteName}`"
                          optionFilterProp="children"
                          v-model="queryParam.siteId"
                          :allowClear="true"
                          :filterOption="filterOption">
                  <a-select-option v-for="partner in allSiteNameList" :key="partner.siteId">{{partner.siteName}}</a-select-option>
                </a-select>
                <!-- <a-input v-model="queryParam.siteName" @keyup.enter="$refs.table.refresh()" :placeholder="`请输入${config.siteName}`" /> -->
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item :label="config.address">
                <a-input v-model="queryParam.address" @keyup.enter="$refs.table.refresh()" :placeholder="`请输入${config.address}`" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item :label="config.queryAdcode">
                <!-- <a-input v-model="queryParam.customArea" placeholder="请输入发货方区域"/> -->
                <a-cascader v-model="queryAdcode"
                            :showSearch="{filter}"
                            changeOnSelect
                            allowClear
                            :options="regionsMap"
                            expandTrigger="hover"
                            :placeholder="`请输入${config.queryAdcode}`" />
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
          <a-col :sm="12">
            <a-button type="primary" icon="plus" @click="handleAdd">{{config.addBtn}}</a-button>
          </a-col>
           <a-col style="text-align: right;" :sm="12">
            <a-button @click="importSiteAddress">导入</a-button>
            <a-button style="margin-left:10px" @click="$refs.importHistoryRef.add(3, siteType)">导入历史</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" size="default" :columns="columns" :data="loadData"
               :showAlertInfo="false" bordered
               :scroll="{x:1200}"
               :rowKey="record => record.siteId"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @onSelect="onChange">
        <template slot="partnerName" slot-scope="text, record">
          <span v-if="record.partnerStatusName === '停用'" style="color:#D1D1D1">{{text}}</span>
          <span v-else>{{text}}</span>
        </template>
        <a slot="siteName" slot-scope="text, record"  @click="handleDetail(record)">{{text}}</a>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <confirm-info title="确认删除这条记录么" content="删除" @onconfirm="handleDelete(record)" />
        </span>
      </s-table>
      <site-address-form :isShow="addModalvisible" :info="siteAddressForm" :regionsList="regionsMap" :type="type" :siteType="siteType" @hideForm="hideForm" />
      <site-address-detail :isShow="detailModalvisible" :detail="siteAddressForm" :type="type" :siteType="siteType" @hideDetail="hideDetail" />
    </a-card>

    <import-template ref="importSiteAddressRef"
                     :templateType="3"
                     :templateSubType="siteType"
                     @success="importSiteAddressSuccess"
                     :title="siteType === 1 ? '导入发货方信息' : '导入收货方信息'">
    </import-template>
    <import-history ref="importHistoryRef"></import-history>
  </div>
</template>

<script>
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'
import ConfirmInfo from '@/components/ConfirmInfo'
import SiteAddressForm from './SiteAddressForm'
import SiteAddressDetail from './SiteAddressDetail'

import { throttle, trim } from 'lodash'
import { selectByPage, deleteSiteAddress, getAllSiteName } from '@/api/resource/siteAddress'
import librariesBase from '@views/mixins/libraries_base'
import { globalMap } from '@/api/global'
import { getPartnersWithLike, getAllPartners } from '@/api/resource/partner'
import { getRegionInfo, countCollumnsWidth } from '@/utils/util'
import ImportTemplate from '@/components/ImportTemplate/'
import ImportHistory from '@/views/resource/components/ImportHistory' // 导入历史


import { getColumns, getSitTypes, getType, getQueryConfig } from './config'

import TopNav from '@/components/tabs/'
import base from '@/views/resource/mixins/base'

export default {
  name: 'SiteAddressList',
  mixins: [librariesBase, base],
  components: {
    AInput,
    STable,
    ConfirmInfo,
    SiteAddressForm,
    SiteAddressDetail,
    ImportTemplate,
    ImportHistory,
    TopNav
  },
  data () {
    const type = getType(this)
    const siteType = getSitTypes(type)
    // console.log('type===', type, siteType)

    return {
      type,
      siteType,
      first: false,
      config: getQueryConfig(type),
      visible: false,
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
      nameDataSource: [],
      statusEnable: globalMap.statusEnable, // 启用状态
      queryAdcode: [], // 发货方区域选项
      // 弹窗相关
      addModalvisible: false, // 是否显示新增框
      detailModalvisible: false, // 是否显示详情
      siteAddressForm: {},
      allPartnerList: [], // 客户名称列表
      allSiteNameList: [], // 收发货名称列表
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: getColumns(type),
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log(parameter, 'queryParam=', this.queryParam)
        parameter.siteType = this.siteType
        if (this.first === true) this.queryParam.page = 1
        this.first = false
        const region = getRegionInfo(this.queryAdcode)
        return selectByPage(
          Object.assign(parameter, region, this.queryParam)
        ).then(res => {
          // console.log('res data==', res)
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  watch: {
    $route (to, from) {
      this.type = getType(this)
      this.config = getQueryConfig(this.type)
      this.columns = getColumns(this.type)
      this.siteType = getSitTypes(this.type)
      this.first = true
      this.queryParam.siteId = undefined
      this.$refs.table.refresh()
      this.getAllSiteNameList()
      this.handleReset()
    }
  },
  computed: {
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  mounted () {
    this.getAllSiteNameList()
    this.getAllPartnerList()
    this.getRegions() // 省市区
    console.log(this.columns)
  },
  methods: {
    // 导入收发货方相关
    importSiteAddress () {
      if (this.$refs.importSiteAddressRef) this.$refs.importSiteAddressRef.showModal()
    },
    importSiteAddressSuccess (res) {
      console.log('导入成功')
      console.log('importTempSuccess (res)', res)
      this.$refs.table.refresh()
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    handleReset () {
      this.queryParam = {}
      this.queryAdcode = []
    },
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    },
    getAllSiteNameList () {
      getAllSiteName({ siteType: this.siteType }).then(res => {
        this.allSiteNameList = res.data
      })
    },
    // 过滤
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 查询客户级联列表
    handleNameSearch: throttle(async function (v) {
      const key = trim(v)
      if (!key) {
        this.nameDataSource = []
      } else {
        const self = this
        await getPartnersWithLike({ name: key }).then(res => {
          const datas = res.data || []
          let source = []
          datas.forEach(val => {
            source.push({ value: val.partnerId, text: val.partnerName })
            // source.push(val.partnerName)
          })
          // source = [ '11', '22', '333' ]
          self.nameDataSource = source
        })
      }
    }, 500),
    // 新增按钮事件
    handleAdd () {
      this.siteAddressForm = {}
      this.$nextTick(() => {
        this.addModalvisible = true
      })
    },
    // 修改
    handleEdit (record) {
      this.siteAddressForm = record
      this.addModalvisible = true
    },
    hideForm (isRefresh) {
      this.addModalvisible = false
      if (isRefresh) {
        this.$refs.table.refresh()
      }
    },
    // 查看详情
    handleDetail (record) {
      this.siteAddressForm = record
      this.detailModalvisible = true
    },
    hideDetail () {
      this.detailModalvisible = false
    },
    // 删除
    handleDelete (record) {
      deleteSiteAddress({ siteId: record.siteId }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    onChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows

      // console.log(this.$refs.table)
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
