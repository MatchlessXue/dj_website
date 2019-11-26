<template>
  <div class="form-layout-body">
    <a-modal
      :visible="visible"
      :title="heading"
      @cancel="$emit('onCancel',visible)"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="back" @click="$emit('onCancel',visible)">取消</a-button>
        <a-button
          v-if="isAdd"
          key="submit"
          type="primary"
          :loading="loading"
          @click="onOkForAdd()"
        >提交
        </a-button>
        <a-button
          v-if="!isAdd"
          key="submit"
          type="primary"
          :loading="loading"
          @click="onOkForEdit()"
        >确认修改
        </a-button>
      </template>
      <a-form :form="form" class="form">
        <a-form-item>
          <a-input type="hidden" v-decorator="['driverId']"/>
        </a-form-item>
        <a-form-item label="司机姓名"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          <a-input
            v-decorator="['driverName', {rules: [{ required: true, message: '请输入司机姓名', whitespace: true }]}]"
            placeholder="请输入司机姓名"
            maxlength="10"
          />
        </a-form-item>
        <a-form-item label="手机号"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          <a-input
            type="tel"
            v-decorator="['mobile', {rules: [{ required: true, message: '请输入司机手机号'},
              {validator: validatePhoneNumber}]}]"
            placeholder="请输入司机手机号"
            maxlength="11"
          />
        </a-form-item>
        <a-form-item label="驾驶证号"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          <a-input
            v-decorator="['driverLicense', { rules: [{ validator: validateDriverLicense }]}]"
            placeholder="请输入驾驶证号"
            maxlength="18"
          />
        </a-form-item>
        <a-form-item label="准驾车型"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          <a-select placeholder="请选择车型" v-decorator="['driverRank']">
            <a-select-option
              v-for="value in truckDryTypeMap"
              :key="value.dictId"
            >{{value.dictName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>

<script>
import { validatePhoneNumber, validateDriverLicense } from '@/utils/validate'
import { mixin, mixinDevice } from '@/utils/mixin'
import librariesBase from '@views/mixins/libraries_base'
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  labelSingleCol: { span: 5 },
  wrapperSingleCol: { span: 16 }
}
export default {
  name: 'DriverFormModal',
  props: {
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
    driverRecord: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mixins: [mixin, mixinDevice, librariesBase],
  data () {
    return {
      // 校验相关
      validatePhoneNumber,
      validateDriverLicense,
      formItemLayout,
      loading: false,
      initData: {},
      submitData: {},
      form: this.$form.createForm(this),
      isSubmit: false
    }
  },
  created () {
    this.getTruckDryTypeMap() // 准驾车型
  },
  watch: {
    driverRecord: {
      deep: true,
      handler: function (val) {
        console.log('watch-val', val)
        this.$nextTick(() => {
          const { driverId, driverName, mobile, driverLicense, driverRank } = val
          this.form.setFieldsValue({ driverId, driverName, mobile, driverLicense, driverRank })
        })
      }
    }
  },
  computed: {},
  methods: {
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
    },
    onOkForAdd () {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.handleclose()
          this.$emit('onOkForAdd', values)
        }
      })
    },
    onOkForEdit () {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.handleclose()
          this.$emit('onOkForEdit', values)
        }
      })
    }/*,
      getFormData() {
        if (this.id) {
          getDriverById({driverId: this.id}).then(res => {
            this.initData = res.data
            this.$nextTick(() => {
              this.form.setFieldsValue(this.initData)
            })
          })
        }
      } *//*,
      // 提交表单
      handleSubmit(e) {
        e.preventDefault()
        if (this.isSubmit) return
        this.form.validateFields((err, values) => {
          if (!err) {
            this.formatData(values)
            console.log('subdata===', values)
            this.isSubmit = true
            saveDrivers(values)
              .then(res => {
                console.log('res', res)
                if (res.code === 0) {
                  this.$message.success(`${this.id ? '修改' : '新增'}成功`)
                  setTimeout(() => {
                    this.$router.push({name: 'driver'})
                  }, 1000 * 1)
                }
              })
              .finally(() => {
                this.isSubmit = false
              })
          } else {
            return false
          }
        })
      } */
  }
}
</script>

<style lang="less">
</style>
