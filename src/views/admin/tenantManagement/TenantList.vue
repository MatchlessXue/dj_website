<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="租户：">
                <a-auto-complete :dataSource="StenantName"
                                 v-model="queryParam.tenantName"
                                 placeholder="请输入租户名称"
                                 :filterOption="filterOption"
                                 :allowClear="true" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="超管账号：">
                <a-input v-model="queryParam.adminAccount"
                         placeholder="请输入手机号/邮箱" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary"
                          @click="handleQuery">查询</a-button>
                <a-button @click="handlecl">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false"
            style="margin-top: 10px"
            class="card-container">
      <s-table ref="table"
               size="default"
               :columns="columns"
               :data="loadData"
               :showAlertInfo="false"
               rowKey="subDictId">
        <span slot="validFlag"
              slot-scope="text,record">
          <span v-if='record.validFlag===true'>有效</span>
          <span v-if='record.validFlag!==true'>失效</span>
        </span>
        <span slot="action"
              slot-scope="text,record">
          <span>
            <a @click="handleEdittenant(record)">编辑企业信息</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">费用自定义</a>
            <a-divider type="vertical" />
            <a @click="handleCustomPageClick(record)">页面自定义</a>
            <a-divider type="vertical" />
            <a @click="handleCustomPrintClick(record)">打印自定义</a>
          </span>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import ImportExport from '@/components/ImportExport'
import { selectByPage, gettenantall } from '@/api/admin/tenantManagement/index'
// import feeBase from '@/views/admin/feeManagement/mixins/fee_base'

export default {
  name: 'TenantList',
  // mixins: [feeBase],
  components: {
    // AInput,
    // ASelect,
    STable,
    ImportExport
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '租户名称',
          // width: '50%',
          dataIndex: 'tenantName'
        },
        {
          title: '超管账号',
          // width: '50%',
          dataIndex: 'adminAccount'
        },
        {
          title: '是否有效',
          // width: '50%',
          dataIndex: 'validFlag',
          scopedSlots: { customRender: 'validFlag' },
          filters: [
            { text: '失效', value: 'false' },
            { text: '有效', value: 'true' }
          ]
        },
        {
          title: '租户过期日期',
          // width: '50%',
          dataIndex: 'expireDate'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      StenantName: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return selectByPage(Object.assign(params, this.queryParam)).then(res => {
          return res.data || []
        })
      }
    }
  },
  created () {
    gettenantall().then(res => {
      // console.log('res data==', res)
      const _this = this
      res.data.forEach(function (item, i) {
        if (item.tenantName !== '' && item.tenantName !== null) {
          _this.StenantName.push(item.tenantName)
        }
      })
      _this.StenantName = this.unique(this.StenantName)
    })
  },
  methods: {
    handleCustomPrintClick (record) {
      console.log('handleCustomPrintClick (record', record)
      // this.$router.push({ name: 'Print',
      //   params: { id: JSON.stringify({
      //     tenantId: record.tenantId,
      //     tenantName: record.tenantName
      //   }) } })
      location.href = `/manage/#/super/print?tenantId=${record.tenantId}&tenantName=${record.tenantName}`
    },
    handleCustomPageClick (record) {
      window.location.href = '/magic-form/#/?tenantId=' + record.tenantId
    },
    unique (arr) {
      return Array.from(new Set(arr))
    },
    handleEdittenant (record) {
      console.log('handleEdittenant(receiptDetail):', record)
      this.$router.push({ name: 'TenantEdit', params: { id: record.tenantId } })
      // this.$router.push({ name: 'FeeSet', params: { id: record.tenantId } })
    },
    handleEdit (record) {
      console.log('handleEdit(receiptDetail):', record)
      this.$router.push({ name: 'FeeSet', params: { id: record.tenantId } })
    },
    // 查询
    handleQuery () {
      this.$refs.table.refresh()
    },
    // 重置
    handlecl () {
      this.queryParam = {}
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
