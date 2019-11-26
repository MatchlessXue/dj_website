<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form  layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="租户：">
                <a-select
                  showSearch
                  :allowClear="true"
                  placeholder="请选择租户"
                  v-model="currentTenant.tenantName"
                  @change="handleTenantChange"
                  :filterOption="filterOption">
                  <a-select-option
                    v-for="tenant in allTenantList"
                    :key="tenantKey(tenant)">{{tenant.tenantName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="所属功能：">
                <a-select
                  showSearch
                  :allowClear="true"
                  placeholder="请选择所属功能"
                  v-model="queryParam.printmenuId"
                  :filterOption="filterOption">
                  <a-select-option
                    v-for="menu in menus"
                    :key="menu.printmenuId">{{menu.printmenuName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="模板名称：">
                <a-input placeholder="请输入模板名称" v-model="queryParam.printtemplateName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button type="primary" @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card
      v-if="currentTenant.tenantId"
      class="card-container" :bordered="false" style="margin-top:10px;">
      <!-- TABLE OPTIONS -->
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-button type="primary" @click="add">添加模板</a-button>
            <a-button style="margin-left: 15px" type="primary" @click="remove">删除模板</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table
        ref="table"
        :data="loadData"
        bordered
        :columns="columns"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :rowKey='record => record.printtemplateId'>
        <span slot="action" slot-scope="text,record">
          <a href="javascript:" @click="clone(record)">复制</a><a-divider type="vertical"/>
          <a href="javascript:" @click="print(record)">编辑</a>
        </span>
        <span slot="roles" slot-scope="text,record">{{showRoles(record.printtemplateRoles)}}</span>
        <a slot="printtemplateName" slot-scope="text,record" @click="edit(record)">{{record.printtemplateName}}</a>
        <span slot="departName" slot-scope="text,record">{{showPrintmenuName(record.printmenuId)}}</span>
        <span slot="printtemplateMode" slot-scope="text,record">{{getPrintMode(record.printtemplateMode).label}}</span>
      </s-table>
    </a-card>
    <add-template ref="AddTemplateRef" @success="AddTemplateSuccess" :menus="menus"></add-template>
  </div>
</template>

<script>
import STable from '@/components/table/'
import AddTemplate from './components/AddTemplate'
import { gettenantall, getprintmenu, getprinttemplate, deleteByIds } from '@/api/platform/platform'
import { getPrintMode } from './status'

export default {
  name: 'PrintIndex',
  components: {
    STable,
    AddTemplate
  },
  data () {
    const { id } = this.$route.params
    console.log('id515', id)
    return {
      id,
      selectedRowKeys: [],
      selectedRows: [],
      menus: [],
      allTenantList: [], // 租户列表
      queryForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      currentTenant: {},
      getPrintMode,
      // 表头
      columns: [
        {
          title: '模板编号',
          dataIndex: 'printtemplateCode'
        },
        {
          title: '模板名称',
          dataIndex: 'printtemplateName',
          scopedSlots: { customRender: 'printtemplateName' }
        },
        {
          title: '所属功能',
          dataIndex: 'departName',
          scopedSlots: { customRender: 'departName' }
        },
        {
          title: '所属角色',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' }
        },
        {
          title: '打印模式',
          dataIndex: 'printtemplateMode',
          scopedSlots: { customRender: 'printtemplateMode' }
        },
        {
          title: '创建人',
          dataIndex: 'accountName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 150,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: param => {
        return getprinttemplate(Object.assign(this.queryParam, param)).then(res => {
          return res.data
        })
      },
      pagination: {}

    }
  },
  created () {
    this.getAllTenantList().then(res => {
      console.log('res515', res, this.id, res.length)
      this.id && res.length && this.$nextTick(() => {
        this.handleTenantChange(this.id)
      })
    })
    getprintmenu().then(res => {
      this.menus = res.data
    })
  },
  computed: {
  },
  methods: {
    handleTenantChange (val) {
      console.log('handleTenantChange (val515', val)
      this.currentTenant = (val && JSON.parse(val)) || {}
      this.queryParam.tenantId = this.currentTenant.tenantId
    },
    tenantKey (tenant) {
      return JSON.stringify({
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName
      })
    },
    getAllTenantList () {
      return gettenantall().then(res => {
        this.allTenantList = res.data || []
        return res.data
      })
    },
    updateTable () {
      this.$refs.table && this.$refs.table.refresh()
    },
    handleQuery () {
      if (!this.currentTenant.tenantId) {
        this.$message.error('请先选择租户')
        return false
      }
      this.updateTable()
    },
    handleReset () {
      this.handleTenantChange(undefined)
      this.queryParam.printmenuId = undefined
      this.queryParam.printtemplateName = undefined
      // this.updateTable()
    },
    add () {
      this.currentTenant.tenantId && this.$refs.AddTemplateRef.show(this.currentTenant.tenantId)
    },
    edit (row) {
      this.currentTenant.tenantId && this.$refs.AddTemplateRef.show(this.currentTenant.tenantId, row)
    },
    clone (row) {
      this.currentTenant.tenantId && this.$refs.AddTemplateRef.show(this.currentTenant.tenantId, row, true)
    },
    print (row) {
      this.$router.push({
        name: 'PrintDetail',
        params: { printtemplateId: row.printtemplateId }
      })
    },
    remove () {
      if (this.selectedRowKeys.length) {
        this.$confirm({
          title: '系统提示',
          content: '您确定要删除模板吗',
          onOk: () => {
            deleteByIds({ printtemplateIds: this.selectedRowKeys }).then(res => {
              this.$message.success('删除成功')
              this.updateTable()
            })
          }
        })
      } else {
        this.$message.error('请选择数据')
      }
    },

    AddTemplateSuccess () {
      this.updateTable()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    showPrintmenuName (printmenuId) {
      let find = this.menus.find(item => item.printmenuId === printmenuId)
      if (find) return find.printmenuName
      return ''
    },
    showRoles (roles) {
      if (roles && roles.length) {
        return roles.map(item => item.roleName).join(',')
      }
      return ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
