<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="角色名称">
                <a-input v-model="queryParam.roleName"
                         placeholder="请输入角色名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button @click="$refs.roleTable.refresh()"
                          type="primary">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
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
        <a-button icon="plus"
                  @click="$refs.roleModal.add()"
                  type="primary">新增</a-button>
        <!-- <a-button
          icon="edit"
          type="primary"
          style="margin-left:10px;"
        >修改</a-button> -->
      </div>
      <s-table ref="roleTable"
               size="default"
               :columns="columns"
               :data="loadData"
               :rowKey='record => record.roleId'>
        <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
        <span slot="status">
          <a-badge status="success" />启用
        </span>
        <span slot="action"
              slot-scope="text, record">
          <a @click="$refs.roleModal.edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="$refs.partModal.edit(record)">数据权限</a>
          <a-divider type="vertical" />
          <a @click="handleRoleDelete(record)">删除</a>
        </span>
      </s-table>

      <role-modal ref="roleModal"
                  @ok="handleOk"></role-modal>
      <part-modal ref="partModal"
                  @ok="handleOk"></part-modal>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import RoleModal from './components/RoleModal'
import PartModal from './components/PartModal'

import { getRoleListByPage, deleteRoleById } from '@/api/role.js'
import { mapGetters } from 'vuex'
// import { all } from 'bluebird'
export default {
  name: 'TableList',
  components: {
    STable,
    RoleModal,
    PartModal
  },
  data () {
    return {
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,

      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        roleName: ''
      },
      // 表头
      columns: [
        {
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '状态',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        // {
        //   title: '排序',
        //   key: 'sort',
        //   scopedSlots: { customRender: 'sort' }
        // },
        {
          title: '创建时间',
          dataIndex: 'recTime',
          sorter: true
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象

      loadData: params => {
        // console.log(parameter, 'queryParam=', this.queryParam)
        this.queryParam.tenantId = this.tenantId
        return getRoleListByPage(Object.assign(params, this.queryParam)).then(
          res => {
            console.log('res data==', res)
            return res.data
          }
        )
      },
      // selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    handleReset () {
      this.queryParam = {}
    },
    // onSelectChange (selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
    handleRoleDelete (record) {
      const that = this
      this.$confirm({
        title: `确认要删除“${record.roleName}”角色吗 ?`,
        // content: `确认要删除“${record.roleName}”角色吗 ?`,
        okType: 'danger',
        iconType: 'close-circle',
        onOk () {
          return deleteRoleById({ roleId: record.roleId }).then(res => {
            // const parent = node.parent
            // const children = parent.data.children || parent.data
            // const index = children.findIndex(d => d.departmentId === data.departmentId)
            // children.splice(index, 1)
            that.$refs.roleTable.refresh()
          })
        }
      })
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
      this.$refs.roleTable.refresh()
    },
    // onChange (selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
<style lang="less">
.ant-modal-confirm-confirm .ant-modal-confirm-body > .anticon {
  color: #f5222d;
}
</style>
