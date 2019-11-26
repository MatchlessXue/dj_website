<template>
  <a-card
    :bordered="false"
    class="card-container"
  >
    <a-row :gutter="0">
      <a-col
        :md="4"
        :sm="24"
      >
        <div class="part-header">
          <span>组织机构</span>
        </div>
        <a-tree
          showLine
          :defaultExpandedKeys="['0-0-0']"
          @select="onSelect"
        >
          <a-tree-node key="0-0">
            <span
              slot="title"
              style="color: #1890ff"
            >parent 1</span>
            <a-tree-node
              title="parent 1-0"
              key="0-0-0"
            >
              <a-tree-node
                title="leaf"
                key="0-0-0-0"
              />
              <a-tree-node
                title="leaf"
                key="0-0-0-1"
              />
              <a-tree-node
                title="leaf"
                key="0-0-0-2"
              />
            </a-tree-node>
            <a-tree-node
              title="parent 1-1"
              key="0-0-1"
            >
              <a-tree-node
                title="leaf"
                key="0-0-1-0"
              />
            </a-tree-node>
            <a-tree-node
              title="parent 1-2"
              key="0-0-2"
            >
              <a-tree-node
                title="leaf"
                key="0-0-2-0"
              />
              <a-tree-node
                title="leaf"
                key="0-0-2-1"
              />
            </a-tree-node>
          </a-tree-node>
        </a-tree>
      </a-col>
      <a-col
        :md="20"
        :sm="24"
      >
        <div
          class="table-page-search-wrapper"
          style="border-bottom: 1px solid #E8E8E8"
        >
          <a-form layout="inline">
            <a-row :gutter="20">
              <a-col
                :md="7"
                :sm="24"
              >
                <a-form-item label="用户名：">
                  <a-input
                    v-model="queryParam.loginName"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :md="7"
                :sm="24"
              >
                <a-form-item label="手机号：">
                  <a-input
                    v-model="queryParam.loginMobile"
                    :maxLength="11"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :md="7"
                :sm="24"
              >
                <a-form-item label="邮箱：">
                  <a-input
                    v-model="queryParam.loginEmail"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :md="3"
                :sm="24"
              >
                <span class="table-page-search-submitButtons">
                  <a-button
                    type="primary"
                    @click="fetchTableList"
                  >查询</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table-option-wrapper">
          <a-button
            type="primary"
            @click="showAccountModal"
            icon="plus"
          >新建账号</a-button>
        </div>
        <a-table
          :rowKey='record => record.accountId'
          :rowSelection="rowSelection"
          :columns="columns"
          :dataSource="tableData"
          :loading="tableLoading"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <span
            slot="roles"
            slot-scope="roles"
          >
            <a-tag
              v-for="role in roles"
              color="blue"
              :key="role.roleId"
            >{{role.roleName}}</a-tag>
          </span>
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="$refs.accountModal.edit(record)">编辑</a>
            <!-- <a @click="$refs.modal.edit(record)">编辑</a> -->
            <a-divider type="vertical" />
            <a @click="handleAccountDelete(record)">删除</a>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <a-modal
      :title="modalTitle"
      :visible="isVisible"
      @ok="handleDepartOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form
        layout="inline"
        ref="formPart"
        :form="form"
        id="formPart"
      >
        <a-form-item label="部门名称：">
          <a-input
            type="text"
            placeholder="请输入"
            v-decorator="[
              'departmentName',
              {
                rules: [{ required: true, message: '请输入部门名称' }]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- <role-modal ref="modal" @ok="handleDepartOk"></role-modal> -->
    <account-modal ref="accountModal"></account-modal>
  </a-card>
</template>

<script>
// import RoleModal from './components/RoleModal'
import AccountModal from './components/AccountModal'

import {
  getPartList,
  getAccountList,
  addEditPartNode,
  deletePartNode,
  deleteAccountById
} from '@/api/account.js'
import { mapGetters } from 'vuex'
import { arrayToTree } from '@/utils/util'
const columns = [
  {
    title: '用户名',
    dataIndex: 'loginName'
  },
  {
    title: '手机号',
    dataIndex: 'loginMobile'
  },
  {
    title: '邮箱',
    dataIndex: 'loginEmail'
  },
  {
    title: '角色',
    dataIndex: 'roles',
    scopedSlots: { customRender: 'roles' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TableList',
  components: {
    // RoleModal,
    AccountModal
  },
  data () {
    return {
      // 部门数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      form: this.$form.createForm(this), // :autoFormCreate="(form)=>{this.form = form}",
      partNodeTemp: {}, //  部门节点缓存
      partItemTemp: {
        children: [],
        dataStatus: '',
        departmentId: '',
        departmentName: '',
        level: '',
        parentId: '',
        recTime: '',
        tenantId: ''
      }, // 部门节点数据缓存

      isVisible: false, // 部门弹框是否显示
      accountVisible: false, // 账户弹框是否显示
      modalTitle: '编辑',
      confirmLoading: false,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        departmentId: '',
        loginName: '', // 登录账号名
        loginMobile: '', // 手机号
        loginEmail: '', // 邮箱
        tenantId: '',
        page: 1,
        pageSize: 20
      },
      // 表格数据
      columns,
      tableData: [],
      pagination: {
        // showSizeChanger: true
      },
      // 模态框显示数据
      accountData: {},
      tableLoading: false,

      // selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.fetchPartList()
    this.fetchTableList()
  },
  computed: {
    ...mapGetters(['tenantId', 'companyName']),
    rowSelection () {
      // const { selectedRowKeys } = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
          )
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  methods: {
    // 请求部门数据
    fetchPartList () {
      getPartList({ tenantId: this.tenantId }).then(res => {
        console.log('------部门数据-----')
        console.log(res.data)
        console.log('------部门数据-----')
        if (res.data) {
          const tempPart = arrayToTree(res.data, 'departmentId')
          if (tempPart && tempPart.length) {
            this.treeData = tempPart
          } else {
            this.treeData = []
            let rootNode = {} // 初始化一个根节点
            rootNode.departmentName = this.companyName
            rootNode.departmentId = ''
            rootNode.parentId = ''
            rootNode.tenantId = this.tenantId
            this.treeData.push(rootNode)
          }
        }
      })
    },
    // 请求表单数据
    // 加载数据方法 必须为 Promise 对象
    fetchTableList () {
      this.tableLoading = true
      this.queryParam.tenantId = this.tenantId
      getAccountList(this.queryParam).then(res => {
        console.log('=======账户数据======')
        const data = res.data
        console.log(data)
        console.log('=======账户数据======')

        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.tableLoading = false
        this.tableData = data.records
        this.pagination = pagination
      })
    },
    handleTableChange (pagination, filters, sorter) {
      console.log('--------分页--------')
      console.log(pagination)
      console.log('--------分页--------')

      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.queryParam.page = pager.current
      this.fetchTableList()
      // this.fetch({
      //   results: pagination.pageSize,
      //   page: pagination.current,
      //   sortField: sorter.field,
      //   sortOrder: sorter.order,
      //   ...filters
      // })
    },
    // 删除账户数据
    handleAccountDelete (record) {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定要删除${record.loginName}账户吗 ?`,
        onOk () {
          return deleteAccountById({ accountId: record.accountId }).then(
            res => {
              // const parent = node.parent
              // const children = parent.data.children || parent.data
              // const index = children.findIndex(d => d.departmentId === data.departmentId)
              // children.splice(index, 1)
              that.fetchTableList() // 重新刷新表格数据
            }
          )
        }
      })
    },
    // 点击树节点
    handleNodeClick (data) {
      this.queryParam.departmentId = data.departmentId
      this.queryParam.tenantId = this.tenantId
      // this.$refs.accountTable.refresh() // 重新请求table数据
    },
    // 根据部门请求表单数据

    onEditClick (key, node, data) {
      if (key === 'modify') {
        // 编辑
        this.isVisible = true
        this.modalTitle = '编辑'
        this.partNodeTemp = Object.assign({}, node)
        this.partItemTemp = Object.assign({}, data)
      } else if (key === 'delete') {
        // 删除
        this.$confirm({
          title: '提示',
          content: `确定要删除${data.departmentName}吗 ?`,
          onOk () {
            return deletePartNode({ departmentId: data.departmentId }).then(
              res => {
                const parent = node.parent
                const children = parent.data.children || parent.data
                const index = children.findIndex(
                  d => d.departmentId === data.departmentId
                )
                children.splice(index, 1)
              }
            )
          }
        })
      }
    },
    onAddClick (key, node, data) {
      this.isVisible = true
      this.modalTitle = '新增'
      this.clearPartItemTemp()
      if (key === 'same') {
        this.partItemTemp.parentId = data.parentId
        this.partItemTemp.tenantId = data.tenantId
      } else if (key === 'next') {
        this.partItemTemp.parentId = data.departmentId
        this.partItemTemp.tenantId = data.tenantId
      }
    },
    handleDepartOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields(
        ['departmentName'],
        { force: true },
        (err, values) => {
          if (!err) {
            // 发送编辑修改请求
            this.partItemTemp.departmentName = values.departmentName
            addEditPartNode(this.partItemTemp).then(res => {
              this.fetchPartList() // 重新获取部门数据
            })
            this.isVisible = false
            this.confirmLoading = false
          }
        }
      )
    },
    clearPartItemTemp () {
      this.partItemTemp.children = []
      this.partItemTemp.dataStatus = undefined
      this.partItemTemp.departmentId = ''
      this.partItemTemp.departmentName = ''
      this.partItemTemp.level = undefined
      this.partItemTemp.parentId = ''
      this.partItemTemp.recTime = undefined
      this.partItemTemp.tenantId = ''
    },
    handleCancel () {
      this.isVisible = false
      this.confirmLoading = false
    },
    // 账户弹框显示
    showAccountModal () {
      this.accountVisible = true
    },
    onSelect (selectedKeys, info) {
      console.log('selected', selectedKeys, info)
    },
    onCheck (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
    },
    handleEdit (record) {
      this.mdl = Object.assign({}, record)

      this.mdl.permissions.forEach(permission => {
        permission.actionsOptions = permission.actionEntitySet.map(action => {
          return {
            label: action.describe,
            value: action.action,
            defaultCheck: action.defaultCheck
          }
        })
      })

      console.log(this.mdl)
      this.visible = true
    },
    handleOk () {
      // 新增/修改 成功时，重载列表
      // this.$refs.table.refresh()
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onSelectChange (selectedRowKeys, selectedRows) {
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
.part-header {
  height: 53px;
  vertical-align: middle;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
  > span {
    line-height: 53px;
    padding-left: 10px;
  }
}
.search-container {
  height: 44px;
}
.table-option-wrapper {
  padding: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 12px;
}
.card-container {
  .ant-card-body {
    padding: 0;
  }
}
</style>
