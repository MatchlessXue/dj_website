<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container">
      <a-row>
        <a-col :md="6"
               :sm="24">
          <div class="part-header">
            <span style="font-size:16px;font-weight:bold;">部门</span>
          </div>
          <el-tree :data="treeData"
                   :props="defaultProps"
                   node-key='departmentId'
                   default-expand-all
                   :expand-on-click-node="false">
            <span class="custom-tree-node"
                  slot-scope="{ node, data }">
              <span @click="showinfo(node)">{{ node.label }}</span>
              <span>
                <a-dropdown small="small"
                            v-if="data.parentId">
                  <span class="ant-dropdown-link">
                    <a-icon type="ellipsis" />
                  </span>
                  <a-menu slot="overlay"
                          @click="onEditClick($event.key, node, data)">
                    <a-menu-item key="modify">修改</a-menu-item>
                    <a-menu-item key="delete">删除</a-menu-item>
                  </a-menu>
                </a-dropdown>
                <a-dropdown style="margin-left: 8px">
                  <span class="ant-dropdown-link">
                    <a-icon type="plus" />
                  </span>
                  <a-menu slot="overlay"
                          @click="onAddClick($event.key, node, data)">
                    <a-menu-item key="same"
                                 v-if="data.parentId">新增同级</a-menu-item>
                    <a-menu-item key="next">新增下级</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </span>
          </el-tree>
        </a-col>
        <a-col :md="18"
               :sm="24">
          <div class="table-page-search-wrapper"
               style="border-bottom: 1px solid #E8E8E8">
            <a-form layout="inline">
              <a-row :gutter="20">
                <a-col :lg="6"
                       :md="12"
                       :sm="24">
                  <a-form-item label="用户名：">
                    <a-input v-model="queryParam.loginName"
                             placeholder="请输入用户名" />
                  </a-form-item>
                </a-col>
                <a-col :lg="6"
                       :md="12"
                       :sm="24">
                  <a-form-item label="手机号：">
                    <a-input v-model="queryParam.loginMobile"
                             placeholder="请输入手机号" />
                  </a-form-item>
                </a-col>
                <a-col :lg="6"
                       :md="12"
                       :sm="24">
                  <a-form-item label="邮箱：">
                    <a-input v-model="queryParam.loginEmail"
                             placeholder="请输入邮箱" />
                  </a-form-item>
                </a-col>
                <a-col :md="6"
                       :sm="12">
                  <a-form-item label="">
                    <span>
                      <a-button type="primary"
                                @click="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                      <a-button @click="handleReset">重置</a-button>
                    </span>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="table-option-wrapper">
            <a-tooltip placement="right">
              <template slot="title">
                <span>添加前请确认已有部门和角色信息</span>
              </template>
              <a-button type="primary"
                        @click="$refs.accountModal.add()"
                        icon="plus">新建账号</a-button>
            </a-tooltip>
          </div>
          <s-table :columns="columns"
                   ref="table"
                   size="default"
                   :data="loadData"
                   @onSelect="handleTableChange"
                   bordered>
            <span slot="roles"
                  slot-scope="roles">
              <a-tag v-for="role in roles"
                     color="blue"
                     :key="role.roleId">{{role.roleName}}</a-tag>
            </span>
            <span slot="action"
                  slot-scope="text, record">
              <a @click="$refs.accountModal.edit(record)">编辑</a>
              <!-- <a @click="$refs.modal.edit(record)">编辑</a> -->
              <a-divider v-if="record.isadmin!=true"
                         type="vertical" />
              <a v-if="record.isadmin!=true"
                 @click="handleAccountDelete(record)">删除</a>
              <a-divider type="vertical" />
              <a @click="handleUpdatePWD(record)">重置密码</a>
            </span>
          </s-table>
        </a-col>
      </a-row>
      <a-modal :title="modalTitle"
               :visible="isVisible"
               @ok="handleDepartOk"
               :maskClosable="false"
               :confirmLoading="confirmLoading"
               @cancel="handleCancel">
        <a-form layout="inline"
                ref="formPart"
                :form="form"
                id="formPart">
          <a-form-item label="部门名称：">
            <a-input type="text"
                     placeholder="请输入"
                     v-decorator="['departmentName',{  rules: [{ required: true, message: '请输入部门名称' }]}            ]" />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- <role-modal ref="modal" @ok="handleDepartOk"></role-modal> -->
      <account-modal ref="accountModal"
                     :selectedId="queryParam.departmentId"
                     @ok="handleAccountOk"></account-modal>
      <a-modal title="重置密码"
               :visible="resetPasswordVisible"
               @ok="handlePasswordOk"
               :maskClosable="false"
               :confirmLoading="confirmLoading"
               @cancel="handlePasswordCancel">
        <a-form ref="formreset"
                :form="form2"
                id="formreset">
          <a-form-item label="新密码："
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol">
            <a-input type="password"
                     placeholder="请输入新密码："
                     v-decorator="['newPaw',{  rules: [{ required: true, message: '请输入新密码'},{required: false,
          validator: validatePWDOptional }]}]" />
          </a-form-item>
          <a-form-item label="确认密码"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol">
            <a-input type="password"
                     placeholder="请再次输入密码"
                     v-decorator="['conPwd',{rules:[{ required: true, message: '请再次输入密码'},{required: false,
          validator: validatePWDOptional }]}]" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
// import RoleModal from './components/RoleModal'
import AccountModal from './components/AccountModal'
import STable from '@/components/table/'
import { validatePWDOptional } from '@/utils/validate'
import {
  getPartList,
  getAccountList,
  addEditPartNode,
  deletePartNode,
  deleteAccountById,
  resetPasswordsById
} from '@/api/account.js'
import { mapGetters } from 'vuex'
import { arrayToTree } from '@/utils/util'
import md5 from 'md5'
export default {
  name: 'TableList',
  components: {
    // RoleModal,
    AccountModal,
    STable
  },
  data () {
    return {
      validatePWDOptional,
      // 部门数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      form: this.$form.createForm(this), // :autoFormCreate="(form)=>{this.form = form}",
      form2: this.$form.createForm(this),
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

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      accountId: '',
      isVisible: false, // 部门弹框是否显示
      accountVisible: false, // 账户弹框是否显示
      resetPasswordVisible: false, // 重置密码是否显示
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
        tenantId: ''
        // page: 1,
        // pageSize: 10
      },
      // 表格数据
      columns: [
        {
          title: '昵称',
          dataIndex: 'accountName'
        },
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
      ],
      pagination: {
        // showSizeChanger: true
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        this.tableLoading = true
        this.queryParam.tenantId = this.tenantId
        console.log('queryParam:', Object.assign(params, this.queryParam))
        return getAccountList(Object.assign(params, this.queryParam)).then(res => {
          if (res.code === 0 && res.data && res.data.records) {
            res.data.records.forEach((val) => {
              val.roles.forEach((val2) => {
                if (val2.roleId === '22222222') {
                  val.isadmin = true
                }
              })
            })
          }
          console.log('data', res.data)
          return res.data
        })
      },
      // 模态框显示数据
      accountData: {},
      tableLoading: false,

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  mounted () {
    this.fetchPartList()
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
    handleReset () {
      this.queryParam = { ...this.pagination }
    },
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
        console.log('treeData', this.treeData)
      })
    },
    showinfo (node) {
      console.log('node', node)
      this.queryParam.departmentId = node.key
      this.$refs.table.refresh()
    },
    handleAccountOk () {
      this.$refs.table.refresh()
    },
    handleTableChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows
    },
    // 删除账户数据
    handleAccountDelete (record) {
      const that = this
      this.$confirm({
        title: (<p>确定要删除账户 <span style={{ color: 'red' }}>{record.loginName}</span> 吗 ?</p>),
        content: (<span style={{ color: 'red' }}>删除账号后，该账号将无法登录操作</span>),
        okType: 'danger',
        iconType: 'close-circle',
        onOk () {
          return deleteAccountById({ accountId: record.accountId }).then(
            res => {
              that.$refs.table.refresh()
            }
          )
        }
      })
    },
    // 修改密码
    handleUpdatePWD (record) {
      // console.log(record.accountId)
      this.resetPasswordVisible = true
      this.accountId = record.accountId
      // this.$nextTick(() => {
      //   this.form2.setFieldsValue({
      //     accountId: record.accountId
      //   })
      // })
    },
    handlePasswordOk (e) {
      e.preventDefault()
      this.form2.validateFields((err, values) => {
        if (!err) {
          let partItem = {}
          partItem.accountId = this.accountId
          partItem.newPaw = md5(values.newPaw)
          partItem.conPwd = md5(values.conPwd)
          console.log(partItem)
          resetPasswordsById(partItem).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.form2.resetFields()
              this.resetPasswordVisible = false
              this.$refs.table.refresh()
            } else {
              this.$message.fail('操作失败')
            }
          })
        }
      })
    },
    handlePasswordCancel (e) {
      e.preventDefault()
      this.form2.resetFields()
      this.resetPasswordVisible = false
    },
    // 根据部门请求表单数据

    onEditClick (key, node, data) {
      if (key === 'modify') {
        // 编辑
        console.log(node, data)
        this.isVisible = true
        this.modalTitle = '编辑'
        this.partNodeTemp = Object.assign({}, node)
        this.partItemTemp = Object.assign({}, data)
        this.$nextTick(() => {
          this.form.setFieldsValue({ departmentName: data.departmentName })
        })
      } else if (key === 'delete') {
        // 删除
        this.$confirm({
          title: `确定要删除“${data.departmentName}”账号吗 ?`,
          // content: `确定要删除“${data.departmentName}”账号吗 ?`,
          okType: 'danger',
          iconType: 'close-circle',
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
      this.$refs.accountModal.fetchPartList()
    },
    onAddClick (key, node, data) {
      this.isVisible = true
      this.modalTitle = '新增'
      this.clearPartItemTemp()
      this.$nextTick(() => {
        this.form.setFieldsValue({ departmentName: '' })
      })
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
              this.$refs.accountModal.fetchPartList()
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
</style>
<style lang="less">
.el-tree-node {
  padding: 7px 0;
}
:root .ant-dropdown-trigger > .anticon:not(.anticon-ellipsis),
:root .ant-dropdown-link > .anticon:not(.anticon-ellipsis) {
  font-size: 22px;
}
.anticon-ellipsis {
  font-size: 22px;
}
.ant-modal-confirm-confirm .ant-modal-confirm-body > .anticon {
  color: #f5222d;
}
</style>
