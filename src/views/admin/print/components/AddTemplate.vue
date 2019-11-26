<template>
  <a-modal
    :title="showTitle"
    :visible="visible"
    :width="width"
    @ok="_handleOk"
    :confirmLoading="confirmLoading"
    @cancel="_handleCancel">
    <a-form :form="form">
      <a-form-item label="模板名称：" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input placeholder="请输入模板名称"
                 v-decorator="['printtemplateName',{rules: [
                  { required: true, message: '请输入模板名称' },
                  { max: 20, message: '最多只能输入20个字符' },
                ]}]"></a-input>
      </a-form-item>
      <a-form-item label="所属功能："  :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select
          :allowClear="true"
          :disabled="currentRow ? true:false"
          placeholder="请选择所属功能"
          v-decorator="['printmenuId', {rules:[
            { required: true, message: '请选择所属功能' }
          ]}]">
          <a-select-option
            v-for="menu in menuList"
            :key="menu.printmenuId">{{menu.printmenuName}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="打印模式：" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select
          :allowClear="true"
          placeholder="请选择打印模式"
          v-decorator="['printtemplateMode',{initialValue:2, rules:[
            { required: true, message: '请选择打印模式' }
          ]}]">
          <a-select-option
            v-for="menu in modes"
            :key="menu.value">{{menu.label}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="权限分配：" >
        <a-table
          bordered
          :dataSource="roles"
          :pagination="false"
          :rowKey="record => record.roleId"
          :columns="columns">
          <div slot="use" slot-scope="text,record" >
            <a-checkbox :checked="record.use" @change="checkedChange($event, record)"></a-checkbox>
          </div>
        </a-table>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { addprinttemplate } from '@/api/platform/platform'
import { getPrintModes } from '../status'
import { getRoleListAll } from '@/api/role'
export default {
  name: 'AddTemplate.vue',
  components: {},
  props: {
    title: {
      default: '添加模板',
      type: String
    },
    width: {
      default: 450,
      type: Number
    },
    menus: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      menuList: this.menus,
      currentRow: null,
      isClone: false,
      roles: [],
      tenantId: '',
      showTitle: this.title,
      modes: getPrintModes(),
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 表头
      columns: [
        {
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '是否可用',
          dataIndex: 'use',
          scopedSlots: { customRender: 'use' }
        }
      ]
    }
  },
  created () {

  },
  methods: {
    // 有row就是编辑 isClone=true  就是复制
    show (tenantId, row, isClone) {
      this.showTitle = '添加模板'
      if (row) {
        this.currentRow = row
        this.showTitle = '修改模板'
      }
      if (isClone) {
        this.isClone = isClone
        this.showTitle = '复制模板'
      }
      this.tenantId = tenantId
      getRoleListAll({ tenantId: this.tenantId }).then(res => {
        res.data.forEach(item => {
          item.use = false
          if (row && row.printtemplateRoles && row.printtemplateRoles.length) {
            if (row.printtemplateRoles.some(role => role.roleId === item.roleId)) {
              item.use = true
            }
          }
        })
        this.roles = res.data
      })
      this.visible = true
      if (row) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            printtemplateName: row.printtemplateName,
            printtemplateMode: row.printtemplateMode,
            printmenuId: row.printmenuId
          })
        })
      }
    },
    close () {
      this.visible = false
      this.isClone = false
      this.currentRow = null
      this.form.setFieldsValue({
        printtemplateName: undefined,
        printtemplateMode: 2,
        printmenuId: undefined
      })
    },
    _handleCancel () {
      this.close()
    },
    _handleOk () {
      this.form.validateFields((err, values) => {
        if (err) return false
        let userinfo = this.$store.getters.userInfo || {}
        let roles = this.roles.reduce((res, item) => {
          if (item.use) res.push({ roleId: item.roleId, roleName: item.roleName })
          return res
        }, [])
        let params = {
          printmenuId: values.printmenuId,
          accountId: userinfo.accountId,
          printtemplateName: values.printtemplateName,
          tenantId: this.tenantId,
          printtemplateMode: values.printtemplateMode
        }
        let msg = '添加成功'
        if (roles.length) params.printtemplateRoles = roles
        if (this.currentRow) {
          params.printtemplateConfig = this.currentRow.printtemplateConfig
        }
        if (this.currentRow && !this.isClone) {
          params.printtemplateId = this.currentRow.printtemplateId
          if (params.printtemplateRoles && params.printtemplateRoles.length) {
            params.printtemplateRoles.forEach(role => {
              role.printtemplateId = params.printtemplateId
            })
          }
          msg = '编辑成功'
        }
        if (this.isClone) msg = '复制成功'
        console.log('params', params)
        this.confirmLoading = true
        addprinttemplate(params).then(res => {
          this.$message.success(msg)
          this.$emit('success')
          this.close()
        }).finally(() => {
          this.confirmLoading = false
        })
      })
    },
    checkedChange (e, record) {
      record.use = e.target.checked
    }
  },
  watch: {
    menus (newval) {
      this.menuList = newval
    }
  }
}
</script>

<style lang="less" scoped>
</style>
