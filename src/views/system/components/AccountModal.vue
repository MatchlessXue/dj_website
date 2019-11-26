<template>
  <a-modal :title="headingTitle"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleOk"
           :maskClosable="false"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label='昵称'
                     help="2-20个汉字，字母，数字，下划线，减号，不区分大小写"
                     hasFeedback>
          <a-input placeholder='请输入昵称'
                   v-decorator="[ 'accountName', {rules: [{ required: true, message: '用户名不能为空',
          validator: validateNickName }]} ]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label='用户名'
                     help="6-20个字符，数字，下划线，减号，不区分大小写"
                     hasFeedback>
          <a-input placeholder='用户名'
                   v-decorator="[ 'loginName', {rules: [{ required: true, message: '用户名不能为空',
          validator: validatePWD }]} ]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label='手机号'
                     hasFeedback>
          <a-input placeholder='手机号'
                   :maxLength="11"
                   @change="handleMobileChange"
                   v-decorator="[ 'loginMobile', {rules: [{required: mobilerequired, message: `手机号不能为空`,
          validator: validatePhoneNumberNoRequired, message: `请输入正确的手机号`}]} ]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label='邮箱'
                     hasFeedback>
          <a-input placeholder='邮箱'
                   @change="handleEmailChange"
                   v-decorator="[ 'loginEmail', {rules: [{ required: emailrequired , message: '邮箱不能为空' },
                   {validator:validateEmailNoRequired}] }]" />
        </a-form-item>
        <a-form-item v-show="isRequiredForPwd"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label='登录密码'
                     help="6-20个字符，数字，下划线，减号，区分大小写"
                     hasFeedback>
          <a-input placeholder='登录密码'
                   v-decorator="[ 'loginPwd', {rules: [{ required: isRequiredForPwd, message:
          '密码不能为空',
          validator: isRequiredForPwd ? validatePWD : validatePWDOptional }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label='所属部门'
                     hasFeedback>
          <a-tree-select :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                         :treeData="simpleTreeData"
                         treeDataSimpleMode
                         treeDefaultExpandAll
                         @change="handleLocalPartChange"
                         placeholder='所属部门'
                         v-decorator="[ 'departmentId', {rules: [{ required: true, message: '所属部门不能为空' }] }]">
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
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label='分配角色'
                     hasFeedback>
          <a-select mode="multiple"
                    placeholder="请选择角色"
                    @change="handleRoleChange"
                    v-decorator="[ 'roleList', {rules: [{ type: 'array', required: true, message: '角色不能为空' }] }]">
            <a-select-option v-for="role in roleList"
                             :key="role.roleId">
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
import { validatePhoneNumber, validatePWD, validatePWDOptional, validateNickName, validatePhoneNumberNoRequired, validateEmailNoRequired } from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  name: 'RoleModal',
  props: {
    selectedId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      validatePWD,
      validateNickName,
      validatePWDOptional,
      validatePhoneNumber,
      validatePhoneNumberNoRequired,
      validateEmailNoRequired,
      headingTitle: '操作',
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
      mobilerequired: true,
      emailrequired: true,
      visible: false,
      confirmLoading: false,
      tmpRecord: {},
      roleList: [],
      form: this.$form.createForm(this)
      // permissions: []
    }
  },
  computed: {
    ...mapGetters(['tenantId']),
    isRequiredForPwd () {
      console.log('this.headingTitle', 123, this.headingTitle)
      let values = this.form.getFieldsValue()
      console.log('isRequiredForPwd-values', values)
      return this.headingTitle === '新增'
    }
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
      this.headingTitle = '新增'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          roleList: undefined,
          accountName: '',
          loginName: '',
          loginMobile: '',
          loginEmail: '',
          loginPwd: '',
          departmentId: this.selectedId })
      })
      this.tmpRecord = {}
    },
    // 编辑表单
    edit (record) {
      this.headingTitle = '编辑'
      this.tmpRecord = Object.assign({}, record)
      this.visible = true
      let roles = []
      if (record.loginEmail !== undefined && record.loginEmail !== null && record.loginEmail !== '') { this.mobilerequired = false } else { this.mobilerequired = true }
      if (record.loginMobile !== undefined && record.loginMobile !== null && record.loginMobile !== '') { this.emailrequired = false } else { this.emailrequired = true }
      for (const role of record.roles) {
        roles.push(role.roleId)
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ roleList: roles })
      })
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.tmpRecord, 'accountName', 'loginName', 'loginMobile', 'loginEmail',
          'loginPwd', 'departmentId'))
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
          // tmpValues.accountName = this.tmpRecord.accountName
          tmpValues.loginPwd = this.isRequiredForPwd ? md5(values.loginPwd) : undefined
          addEditAccount(tmpValues).then(res => {
            // Do something
            _this.$message.success('保存成功')
            _this.$emit('ok') // 弹框操作完成的回调
            _this.close()
          }).catch(() => {
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
            // _this.close()
          })
        }
      })
    },
    handleCancel () {
      console.log('handleCancel')
      this.close()
    },
    handleEmailChange () {
      this.$nextTick(() => {
        let values = this.form.getFieldsValue()
        var loginEmail = values.loginEmail
        if (loginEmail !== undefined && loginEmail !== null && loginEmail !== '') { this.mobilerequired = false } else { this.mobilerequired = true }
      })
    },
    handleMobileChange () {
      this.$nextTick(() => {
        let values = this.form.getFieldsValue()
        var loginMobile = values.loginMobile
        if (loginMobile !== undefined && loginMobile !== null && loginMobile !== '') { this.emailrequired = false } else { this.emailrequired = true }
      })
    }
  }
}
</script>

<style scoped>
</style>
