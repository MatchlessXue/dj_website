<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container"
            @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" >
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="发货区域">
                <a-cascader
                  allowClear
                  :options="regionsMap"
                  expandTrigger="hover"
                  :showSearch="{filter}"
                  changeOnSelect
                  v-model="queryParam.sendRegion"
                  placeholder="省/市/区"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="收货区域">
                <a-cascader
                  allowClear
                  :options="regionsMap"
                  v-model="queryParam.receiveRegion"
                  expandTrigger="hover"
                  :showSearch="{filter}"
                  changeOnSelect
                  placeholder="省/市/区"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同名称">
                <a-select placeholder="请选择合同名称"
                          allowClear
                          showSearch
                          :filterOption="filterOption"
                          v-model="queryParam.contractId">
                  <a-select-option v-for="value in contractMap"
                                   :key="value.contractId">{{value.contractName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="合作伙伴">
                <a-select placeholder="请选择合作伙伴"
                          allowClear
                          showSearch
                          :filterOption="filterOption"
                          v-model="queryParam.partnerId">
                  <a-select-option v-for="value in partnerDataMap"
                                   :key="value.partnerId">{{value.partnerName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="运输类型:">
                <a-select v-model="queryParam.transportType"
                          allowClear
                          placeholder="不限">
                  <a-select-option value="1">零担</a-select-option>
                  <a-select-option value="2">整车</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
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
            <a-button type="primary" icon="plus" @click="handleAdd">新建合同</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" bordered
               :rowKey='record => record.regionKey'
               :columns="columns"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :data="loadData">
        <a slot="contractName" @click="handleContractNameLink(record)" slot-scope="text,record">{{record.contractName
          }}</a>
        <span slot="action" slot-scope="text,record">
          <a @click="handleEdit(record)">修改<a-divider type="vertical"/></a>
          <Confirm-Info  title="确认删除这条记录么" content="删除" @onconfirm="handleDelete(record)"/>
        </span>
      </s-table>
    </a-card>

  </div>
</template>

<script>
// import { getBrandId } from '@/api/libraries'
import STable from '@/components/table'
import librariesBase from '@views/mixins/libraries_base'
// import moment from 'moment'
import { getContractRoutePrice, querylist, deleteContractRoute } from '@/api/resource/contract'
import { getAllByPrivilege } from '@/api/resource/gps'
import ConfirmInfo from '@/components/ListConfirm/ConfirmInfo'
// import { globalMap } from '@/api/global'
import contractBase from '@views/resource/contract/mixins/contract_base'

export default {
  name: 'contractList',
  mixins: [librariesBase, contractBase],
  components: {
    STable,
    ConfirmInfo
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '发货区域',
          dataIndex: 'sendRegion',
          key: 'sendRegion'
        },
        {
          title: '收货区域',
          dataIndex: 'receiveRegion',
          key: 'receiveRegion'
        },
        {
          title: '合作伙伴',
          dataIndex: 'partnerName',
          key: 'partnerName'
        },
        {
          title: '运输类型',
          dataIndex: 'transportTypeName',
          key: 'transportTypeName'
        },
        {
          title: '项目',
          dataIndex: 'projectName',
          key: 'projectName'
        },
        {
          title: '时效（小时）',
          dataIndex: 'timeLimit',
          key: 'timeLimit'
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          key: 'contractName',
          scopedSlots: { customRender: 'contractName' }
        },
        {
          title: '合同有效日期',
          dataIndex: 'effectiveDate',
          key: 'effectiveDate'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 查询参数
      queryParam: {},
      querylist,
      selectedRowKeys: [],
      regionsMap: [], // 省市区
      querylistData: [], // 合同列表
      partnerDataMap: [], // 合作伙伴
      contractMap: [], // 合同列表
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let newParams = Object.assign({}, parameter, this.queryParam)
        newParams.receiveRegion = this.queryParam.receiveRegion ? this.queryParam.receiveRegion.join(',') : ''
        newParams.sendRegion = this.queryParam.sendRegion ? this.queryParam.sendRegion.join(',') : ''
        return getContractRoutePrice(Object.assign(newParams)).then(res => {
          return res.data
        })
      }
    }
  },
  created () {
    this.getRegions()
    // 1客户  2承运商
    let P1 = getAllByPrivilege({ partnerTypes: 1, pageSize: 1000 })
    let P2 = getAllByPrivilege({ partnerTypes: 2, pageSize: 1000 })
    Promise.all([P1, P2]).then(res => {
      if (res && res.length) {
        res.forEach(arr => { this.partnerDataMap = this.partnerDataMap.concat(arr.data) })
      }
    })
    querylist({ pageSize: 1000 }).then(res => {
      let datas = []
      if (res.data && res.data.records && res.data.records.length) {
        datas = res.data.records
      }
      this.contractMap = datas
    })
  },
  computed: {

  },
  methods: {
    handleReset () {
      this.queryParam = {}
    },
    handleContractNameLink (record) {
      this.$router.push({
        name: 'ContractDetail',
        params: { id: this.getBase64IdPack(record.contractId, true, false, '') }
      })
    },
    handleAdd () {
      this.$router.push({
        name: 'ContractDetail',
        params: { id: this.getBase64IdPack('', false, false, '') }
      })
    },
    handleEdit (record) {
      this.$router.push({
        name: 'ContractDetail',
        params: { id: this.getBase64IdPack(record.contractId, true, true, record.regionKey) }
      })
    },
    handleDelete (record) {
      deleteContractRoute({ regionKey: record.regionKey }).then(res => {
        res.code === 0 && (() => {
          this.$message.success('删除成功')
          this.$refs.table.refresh()
        })()
      })
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
</style>
