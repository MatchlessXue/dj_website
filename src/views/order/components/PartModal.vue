<template>
  <a-modal
    title="操作"
    :width="800"
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
          label='角色名称'
          hasFeedback >
          <a-input disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='权限字符'
          hasFeedback >
          <a-input disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='部门权限'
          hasFeedback
        >
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="simpleTreeData"
            treeDataSimpleMode
            allowClear
            treeCheckable
            @change="handleLocalPartChange"
            placeholder='选择部门'
            v-decorator="[ 'departments', {rules: [{ required: true, message: '所属部门不能为空' }] }]"
          >
          </a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addEditRoleDepartment } from '@/api/role.js'
import { getPartList } from '@/api/account.js'
import { arrayToTreeNode } from '@/utils/util'
// import pick from 'lodash.pick'
import { mapGetters } from 'vuex'

export default {
  name: 'RoleModal',
  data () {
    return {
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
      mdl: {},
      form: this.$form.createForm(this),
      permissions: [],
      simpleTreeData: [],
      partValues: [],
      tmpRecord: {}
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  created () {
    this.fetchPartList()
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
    handleLocalPartChange (value) {
      this.partValues = value
      console.log('======所属部门======')
      console.log(value)
      console.log('======所属部门======')
    },
    add () {
      this.edit({ id: 0 })
    },
    edit (record) {
      this.tmpRecord = Object.assign({}, record)
      console.log('=====tmpRecord=====')
      console.log(this.tmpRecord)
      console.log('=====tmpRecord=====')
      this.visible = true

      let departments = []
      for (const item of record.departmentList) {
        departments.push(item.departmentId)
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({ departments: departments })
      })
      //   this.$nextTick(() => {
      //     this.form.setFieldsValue(pick(this.tmpRecord, 'roleName', 'name', 'status', 'describe'))
      //   })
      console.log('this.mdl', this.mdl)
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          let tmpValues = Object.assign({}, values)
          tmpValues.roleId = this.tmpRecord.roleId
          console.log(tmpValues)
          addEditRoleDepartment(tmpValues).then(res => {
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
