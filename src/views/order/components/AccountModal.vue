<template>
  <a-modal
    title="操作"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='用户名'
          help="6-20个字符，数字，下划线，减号，不区分大小写"
          hasFeedback
        >
          <a-input placeholder='用户名'  v-decorator="[ 'loginName', {rules: [{ required: true, message: '用户名不能为空' }]} ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='手机号'
          hasFeedback >
          <a-input placeholder='用户名'  v-decorator="[ 'loginMobile', {rules: [{ required: true, message: '手机号不能为空' }]} ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='邮箱'
          help="6-30个字符，可使用字母，数字，下划线，需以字母开头，不区分大小写"
          hasFeedback >
          <a-input placeholder='邮箱' v-decorator="[ 'loginEmail', {rules: [{ required: true, message: '邮箱不能为空' }] }]" />
        </a-form-item>
        <a-form-item
         :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='登录密码'
          help="6-20个字符，数字，下划线，减号，区分大小写"
          hasFeedback >
          <a-input placeholder='登录密码' v-decorator="[ 'loginPwd', {rules: [{ required: true, message: '密码不能为空' }] }]" />
        </a-form-item>
        <a-form-item
         :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='所属部门'
          hasFeedback >
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="simpleTreeData"
            treeDataSimpleMode
            treeDefaultExpandAll
            @change="handleLocalPartChange"
            placeholder='所属部门'
            v-decorator="[ 'departmentId', {rules: [{ required: true, message: '所属部门不能为空' }] }]"
          >
          </a-tree-select>
        </a-form-item>
        <!-- <a-form-item
         :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='可查看部门'
          hasFeedback >
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="simpleTreeData"
            treeDataSimpleMode
            multiple
            treeDefaultExpandAll
            placeholder='可查看部门'
            v-decorator="[ 'departments', {rules: [{ required: true, message: '可查看部门不能为空' }] }]"
          >
          </a-tree-select>
        </a-form-item> -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='分配角色'
          hasFeedback >
          <a-select
            mode="multiple"
            placeholder="Please select"
            @change="handleRoleChange"
            v-decorator="[ 'roleList', {rules: [{ type: 'array', required: true, message: '角色不能为空' }] }]"
            >
            <a-select-option v-for="role in roleList" :key="role.roleId">
              {{role.roleName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { getRoleListAll } from '@/api/role.js'
import { getPartList, addEditAccount } from '@/api/account.js'
import { arrayToTreeNode } from '@/utils/util'
import md5 from 'md5'

import { mapGetters } from 'vuex'

export default {
  name: 'RoleModal',
  data () {
    return {
      partValues: undefined,
      value: undefined,
      simpleTreeData: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      tmpRecord: {},
      roleList: [],
      form: this.$form.createForm(this)
      // permissions: []
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  created () {
    this.fetchPartList()
    this.fetchRoleList()
  },
  methods: {
    // 请求部门数据
    fetchPartList () {
      getPartList({ tenantId: this.tenantId }).then(res => {
        this.simpleTreeData = arrayToTreeNode(res.data)
        console.log('------部门Modal数据-----')
        console.log(this.simpleTreeData)
        console.log('------部门Modal数据-----')
      })
    },
    fetchRoleList () {
      getRoleListAll({ tenantId: this.tenantId }).then(res => {
        console.log('========RoleListAll==========')
        if (res.data.length) {
          this.roleList = res.data
          console.log(this.roleList)
        }
        console.log('========RoleListAll==========')
      })
    },
    handleLocalPartChange (value) {
      this.partValues = value
      console.log('======所属部门======')
      console.log(value)
      console.log('======所属部门======')
    },
    handleRoleChange (value) {
      console.log('=======roleValue======')
      console.log(value)
      console.log('=======roleValue======')
    },
    add () {
      // this.edit({ id: 0 })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ roleList: undefined, loginName: '', loginMobile: '', loginEmail: '', loginPwd: '', departmentId: '' })
      })
    },
    // 编辑表单
    edit (record) {
      this.tmpRecord = Object.assign({}, record)
      this.visible = true
      let roles = []
      for (const role of record.roles) {
        roles.push(role.roleId)
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ roleList: roles })
      })
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.tmpRecord, 'loginName', 'loginMobile', 'loginEmail', 'loginPwd', 'departmentId'))
      })
    },
    close () {
      this.$emit('close') // 关闭弹框的回调
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('form values', values)
          _this.confirmLoading = true
          let tmpValues = Object.assign({}, values)
          tmpValues.accountId = this.tmpRecord.accountId
          tmpValues.tenantId = this.tenantId
          tmpValues.accountName = this.tmpRecord.accountName
          tmpValues.loginPwd = md5(values.loginPwd)
          addEditAccount(tmpValues).then(res => {
            // Do something
            _this.$message.success('保存成功')
            _this.$emit('ok') // 弹框操作完成的回调
          }).catch(() => {
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
            _this.close()
          })
        }
      })
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
