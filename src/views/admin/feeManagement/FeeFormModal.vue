<template>
  <div class="form-layout-body">
    <a-modal :visible="visible" :title="heading" @cancel="$emit('onCancel',visible)" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="$emit('onCancel',visible)">取消</a-button>
        <a-button v-if="isAdd" key="submit" type="primary" :loading="loading" @click="onOkForAdd()">确认</a-button>
        <a-button v-if="!isAdd" key="submit" type="primary" :loading="loading" @click="onOkForEdit()">确认</a-button>
      </template>
      <a-form v-if="isAdd">
        <a-row :form="form" v-for="(fee, feeIndex) in feeList" :key="fee.driverId">
          <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <a-form-item :labelCol="formItemLayout.labelSingleCol" :wrapperCol="formItemLayout.wrapperSingleCol"
            :label="'费用'+ (feeIndex + 1)">
                <a-input maxlength="10" v-model="fee.addExpenseName" placeholder="请输入费用名称" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <div style="margin-top: 7px">
              <span class="driverInfoDelete" v-if="feeIndex !== 0"
                    @click="handleDriverInfoDelete(fee, feeIndex)"><a-icon type="minus-circle" :style="{ fontSize: '26px' }"/></span>
              <span class="driverInfoAdd" v-if="isAdd"
                    @click="handleDriverInfoAdd(fee, feeIndex)" ><a-icon type="plus-circle" :style="{ fontSize: '26px' }"/></span>
            </div>
          </a-col>
       </a-row>
      </a-form>
      <a-form v-if="!isAdd" :form="form">
        <a-row :form="form" v-for="(fee) in feeList" :key="fee.driverId">
          <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <a-form-item :labelCol="formItemLayout.labelSingleCol" :wrapperCol="formItemLayout.wrapperSingleCol" label="费用名称">
              <a-input v-decorator="['expenseSysName',
                {rules: [{ required: true, message: '费用名称不能为空' },
                { required: true, max: 10, message: '最大支持10个汉字' }]}]"
                  placeholder="请输入费用名称" />
            </a-form-item>
          </a-col>
       </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import feeBase from '@/views/admin/feeManagement/mixins/fee_base'

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  labelSingleCol: { span: 6 },
  wrapperSingleCol: { span: 17 }
}
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    heading: {
      type: String,
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    feeRecord: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mixins: [feeBase],
  data () {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      feeList: [{ checkLock: 2, checkStatus: 2, addExpenseName: undefined }],
      queryParam: {} // 查询参数
    }
  },
  watch: {
    feeRecord: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          if (val.expenseId) {
            this.feeList = [{ expenseId: val.expenseId, checkLock: val.checkLock, checkStatus: val.checkStatus }]
            this.form.setFieldsValue(val)
          } else {
            this.feeList = [{ checkLock: 2, checkStatus: 2, addExpenseName: undefined }]
          }
        })
      }
    }
  },
  computed: {
    myAllCostTypeList () {
      return this.isAdd ? this.allCostTypeList.filter(costType => costType.dictId !== 1)
        : this.allCostTypeList
    }
  },
  methods: {
    handleDriverInfoDelete (fee, feeIndex) {
      this.feeList.splice(feeIndex, 1)
    },
    handleDriverInfoAdd (fee, feeIndex) {
      console.log(fee.addExpenseName)
      if (!fee.addExpenseName) {
        this.$message.warning('请输入费用名称！')
        return
      } else {
        const reg = /^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/
        if (!reg.test(fee.addExpenseName)) {
          this.$message.warning('请输入正确的费用名称！')
          return
        }
      }
      this.feeList.push({
        checkLock: 2,
        checkStatus: 2,
        addExpenseName: undefined
      })
    },
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
    },
    onOkForAdd () {
      const feeName = this.feeList[this.feeList.length - 1].addExpenseName
      if (!feeName) {
        this.$message.warning('请输入费用名称！')
        return
      } else {
        const reg = /^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/
        if (!reg.test(feeName)) {
          this.$message.warning('请输入正确的费用名称！')
          return
        }
      }
      this.$emit('onOkForAdd', this.feeList)
    },
    onOkForEdit () {
      this.form.validateFields((err, values) => {
        this.feeList[0].newName = values.expenseSysName
        if (!err) {
          this.$emit('onOkForEdit', this.feeList[0])
        }
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    onChange (value) {
      console.log('changed', value)
    },
    // 客户名称选择框事件处理方法
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleFocus () {
      console.log('focus')
    }
  }
}
</script>
<style scoped>
  .driverInfoDelete,.driverInfoAdd {
    width: 23px;
    height: 23px;
    fontSize: 26px;
    cursor: pointer;
  }

  .driverInfoDelete {
    color: #FF3535;
    margin-right: 10px;
  }

  .driverInfoAdd {
    color: #2797FF;
  }

</style>
