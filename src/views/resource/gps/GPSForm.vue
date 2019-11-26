<template>
  <a-form @submit="handleSubmit"
          :form="form"
          class="form">
    <a-form-item>
      <a-input type="hidden"
               v-decorator="['deviceId']"></a-input>
    </a-form-item>
    <a-form-item label="GPS设备号"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-input v-decorator="['deviceNumber',{
            rules: [{ required: true, message: '请输入GPS设备号!' }]}]"
               maxlength="15"
               placeholder="请输入GPS设备号" />
    </a-form-item>
    <a-form-item label="类型"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-select placeholder="请选择类型" allowClear
                v-decorator="['deviceType',{
            rules: [{ required: true, message: '请选择类型!' }]}]">
        <a-select-option v-for="value in deviceTypeData"
                         :key="value.value">{{value.text}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="厂商"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-select placeholder="请选择厂商" allowClear
                v-decorator="['brand',{ rules: [{ required: true, message: '请选择厂商!' }]}]">
        <a-select-option v-for="value in brandDataList" :key="value.value">{{value.text}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="所属公司类型"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-select placeholder="请选择所属公司类型" allowClear
                v-decorator="['partnerType',{ rules: [{ required: true, message: '请选择所属公司类型!' }]}]"
                @change="changepartnerType">
        <a-select-option v-for="value in componeyType"
                         :key="value.value">{{value.text}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="所属伙伴"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-select placeholder="请选择所属伙伴" allowClear
                v-decorator="['partnerId',{
            rules: [{ required: true, message: '请选择所属伙伴!' }]}]"
                :disabled="comdisabled">
        <a-select-option v-for="value in partnerDataMap"
                         :key="value.partnerId">{{value.partnerName}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="状态"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-radio-group v-decorator="['bizStatus',{
            rules: [{ required: true, message: '请选择状态!' }]}]">
        <a-radio v-for="value in allStatus"
                 :key="value.code"
                 :value='value.code'>{{value.name}}</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="公钥"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-input v-decorator="['publicKey']"
               placeholder="请输入公钥" />
    </a-form-item>
    <a-form-item label="秘钥"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-input v-decorator="['privateKey']"
               placeholder="请输入秘钥" />
    </a-form-item>
    <a-form-item label="URL"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-input v-decorator="['gpsApi']"
               placeholder="请输入URL" />
    </a-form-item>
    <a-form-item label="备注"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      <a-textarea v-decorator="['remark', { rules: [{ message: `最多可输入50个字符`, whitespace: true, max: 50}]}]"
                  placeholder="最多可输入50个字符"
                  maxlength="50"
                  :rows="3" />
    </a-form-item>
  </a-form>
</template>

<script>
// import { getInvoiceWithLike } from '@/api/resource/partner'
import { getAllByPrivilege, addorupd } from '@/api/resource/gps'
import { getInfo } from '@/api/login'
// import { throttle, trim, pick } from 'lodash'
// import gpsBase from '@views/mixins/gps_base'

export default {
  name: 'GPSForm',
  // mixins: [gpsBase],
  props: {
    gpsData: {
      type: Object,
      default () {
        return {}
      }
    },
    componeyType: {
      type: Array,
      default () {
        return []
      }
    },
    deviceTypeData: {
      type: Array,
      default () {
        return []
      }
    },
    allStatus: {
      type: Array,
      default () {
        return []
      }
    },
    brandDataList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      partnerDataMap: [],
      componeyList: [],
      dataSource: [],
      userinfo: {},
      comdisabled: false,
      addres: {},
      deviceNumber: '',
      form: this.$form.createForm(this),
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 }
    }
  },
  watch: {
    gpsData: {
      deep: true,
      handler: function (val) {
        const brand = val.brand && `${val.brand}`
        this.$nextTick(() => {
          // this.form.setFieldsValue(val)
          this.changepartnerType(val.partnerType)
          this.form.setFieldsValue({ ...val, brand: brand })
        })
      }
    }
  },
  created () {
    // 获取用户信息
    this.getInfoMap()
    console.log('brandDataList515', this.brandDataList)
    console.log('partnerDataMap', this.partnerDataMap)
  },
  mounted () {
    // this.form.setFieldsValue(this.gpsData)
  },
  methods: {
    // 切换类型
    changepartnerType (value, isFirstLoad = false) {
      console.log('changepartnerType (value:', value)
      if (value === undefined) {
        return
      }
      if (value === 0) {
        this.comdisabled = true
        this.partnerDataMap = [{ partnerId: this.userinfo.tenantId, partnerName: this.userinfo.companyName }]
        this.form.setFieldsValue({ partnerId: this.userinfo.tenantId })
      } else {
        this.form.setFieldsValue({ partnerId: undefined })
        this.getAllByPrivilegeMap(value)
        this.comdisabled = false
      }
    },
    // 窗口打开
    handleopen (type) {
      // 控制是否显示
      if (type && type === 2) {
        if (this.gpsData && this.gpsData.deviceNumber) {
          this.changepartnerType(this.gpsData.partnerType, true)
        }
      }
    },
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
    },
    // 提交
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.tenantId = this.userinfo.tenantId
        values.departId = this.userinfo.departmentId
        if (!err) {
          this.Doaddorupd(values).then(res => {
            if (this.addres.code === 0) {
              this.$message.success('保存成功')
              this.form.resetFields()
              this.$emit('handlerefresh')
            } else {
              this.$message.success('保存失败')
            }
          })
        }
      })
    },
    /**
     * 获取合作伙伴-客户名称列表
     */
    getAllByPrivilegeMap (value) {
      if (!value || value === '') {
        return []
      }
      return getAllByPrivilege({ partnerTypes: value }).then(res => {
        this.partnerDataMap = res.data
      })
    },
    Doaddorupd (value) {
      return addorupd(value).then(res => {
        this.addres = res
      })
    },
    /**
     * 获取用户信息
     */
    getInfoMap () {
      return getInfo().then(res => {
        this.userinfo = res.data
      })
    }
  }
}
</script>

<style>
</style>
