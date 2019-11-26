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
          <a-input placeholder='请输入角色名称' v-decorator="[ 'roleName', {rules: [{ required: true, message: '角色名称不能为空' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='权限字符'
          hasFeedback >
          <a-input placeholder='请输入权限字符'/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='状态'
          hasFeedback >
          <a-select v-decorator="[ 'status', {rules: []} ]">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='排序'
          hasFeedback >
          <a-input placeholder='请输入排序'/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='描述'
          hasFeedback
        >
          <a-textarea :rows="5" placeholder="描述信息" />
        </a-form-item>

        <a-divider/>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label='菜单权限'
          hasFeedback
        >
          <a-tree
          checkable
          showLine
          :autoExpandParent="true"
          v-model="checkedKeys"
          @select="onSelect"
          @check="onCheck"
          :treeData="treeData"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getMenuList } from '@/api/menu'
import { addEditRoleMenuList } from '@/api/role'
import { mapGetters } from 'vuex'
import { menuToTreeNode } from '@/utils/util'
import pick from 'lodash.pick'
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
      checkedKeys: [], // 选中的keys
      halfCheckedKeys: [], // 半选的keys
      treeData: [],
      tmpRecord: {
        departments: null,
        menuList: [],
        menus: null,
        roleId: '',
        roleName: '',
        tenantId: ''
      }
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  created () {
    this.loadMenuList()
  },
  methods: {
    onCheck (checkedKeys, e) {
      console.log('============checks==========')
      console.log('onCheck', checkedKeys, e)
      console.log('============checks==========')
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = e.halfCheckedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    clearTempRecord () {
      this.tmpRecord.departments = []
      this.tmpRecord.roleId = ''
      this.tmpRecord.roleName = ''
    },
    add () {
      this.visible = true
      this.clearTempRecord()
      this.checkedKeys = []
      this.halfCheckedKeys = []
      this.$nextTick(() => {
        this.form.setFieldsValue({ roleName: '' })
      })
    },
    edit (record) {
      console.log('record', record)
      this.tmpRecord = Object.assign({}, record)
      this.visible = true
      let tmpChecked = []
      let len = record.menuList.length
      for (let i = 0; i < len; i++) {
        let itemTmp = record.menuList[i]
        for (let j = i + 1; j < len; j++) {
          let jtemTmp = record.menuList[j]
          if (itemTmp.menuId === jtemTmp.parentId) {
            itemTmp.isHalf = true
            break
          }
          if (itemTmp.parentId === jtemTmp.menuId) {
            jtemTmp.isHalf = true
          }
        }
      }
      for (let item of record.menuList) {
        if (!item.isHalf) {
          tmpChecked.push(item.menuId)
        }
      }
      console.log('=======tmpChecked======')
      console.log(record.menuList)
      console.log(tmpChecked)
      console.log('=======tmpChecked======')

      this.checkedKeys = tmpChecked
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.tmpRecord, 'roleName'))
      })
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
          console.log('form values', values)
          let tmpValues = Object.assign({}, values)
          tmpValues.roleId = this.tmpRecord.roleId
          tmpValues.menus = [...this.checkedKeys, ...this.halfCheckedKeys]
          console.log('===========menus=========')
          console.log(tmpValues.menus)
          console.log('===========menus=========')
          tmpValues.tenantId = this.tenantId
          console.log('===========roleMenu========')
          console.log(tmpValues)
          console.log('===========roleMenu========')
          addEditRoleMenuList(tmpValues).then(res => {
            // Do something
            _this.$message.success('保存成功')
            _this.$emit('ok') // 弹框操作完成的回调
          }).catch(() => {
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
            _this.close()
          })
          _this.confirmLoading = true
        }
      })
    },
    handleCancel () {
      this.close()
    },
    loadMenuList () {
      getMenuList({ tenantId: this.tenantId }).then(res => {
        let treeTemp = menuToTreeNode(res.data, 'menuId')
        console.log('========菜单列表=======')
        console.log(res.data)
        this.treeData = treeTemp
        console.log('========菜单列表=======')
      })
    }

  }
}
</script>

<style scoped>

</style>
