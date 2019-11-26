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
        >提交</a-button>
        <a-button
          v-if="!isAdd"
          key="submit"
          type="primary"
          :loading="loading"
          @click="onOkForEdit()"
        >确认修改</a-button>
      </template>
      <a-form :form="form">
        <a-form-item>
          <a-input type="hidden" v-decorator="['cargoId']" />
        </a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="客户名称"
        >
          <a-select
            showSearch
            allowClear
            placeholder="请选择客户名称"
            optionFilterProp="children"
            @focus="handleFocus"
            @change="handleChange"
            :filterOption="filterOption"
            :disabled="!isAdd"
            v-decorator="[
          'partnerId',
          {rules: [{ required: true, message: '客户名称不能为空' }]}
        ]"
          >
            <a-select-option
              v-for="partner in allPartnerList"
              :key="partner.partnerId"
            >{{partner.partnerName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物名称"
        >
          <a-input
            :maxLength="30"
            v-decorator="['cargoName',
          {rules: [{ required: true, message: '货物名称不能为空' }]}]"
            placeholder="请输入货物名称"
          />
        </a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物代码"
        >
          <a-input :maxLength="30" placeholder="请输入货物代码" v-decorator="['cargoCode']" />
        </a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物规格"
        >
          <a-input :maxLength="30" placeholder="请输入货物规格" v-decorator="['cargoSpecifications']" />
        </a-form-item>
        <!--<a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="外部编码"
        >
          <a-input placeholder="请输入外部编码" v-decorator="['externalCode']"/>
        </a-form-item>-->
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物类型"
        >
          <a-select
            showSearch
            allowClear
            placeholder="请选择货物类型"
            optionFilterProp="children"
            :filterOption="filterOption"
            v-decorator="['cargoType']"
          >
            <a-select-option
              v-for="cargoType in cargoTypeList"
              :key="cargoType.dictId"
            >{{cargoType.dictName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物包装"
        >
          <a-select
            showSearch
            allowClear
            placeholder="请选择货物包装"
            optionFilterProp="children"
            :filterOption="filterOption"
            v-decorator="['packageType']"
          >
            <a-select-option
              v-for="packageType in packageTypeList"
              :key="packageType.dictId"
            >{{packageType.dictName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="长(m)"
            >
              <a-input-number
                :min="0"
                :max="99.999"
                :step="0.1"
                :initialValue="0"
                @change="onLengthChange"
                v-decorator="['lengthCustom']"
              />
            </a-form-item>
          </a-col>

          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="宽(m)"
            >
              <a-input-number
                :min="0"
                :max="99.999"
                :step="0.1"
                :initialValue="0"
                @change="onWidthChange"
                v-decorator="['widthCustom']"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="高(m)"
            >
              <a-input-number
                :min="0"
                :max="99.999"
                :step="0.1"
                :initialValue="0"
                @change="onHeightChange"
                v-decorator="['heightCustom']"
              />
            </a-form-item>
          </a-col>

          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="单件货值"
            >
              <a-input-number
                :min="0"
                :max="999999.9999"
                :step="0.1"
                :initialValue="0"
                @change="onworthChange"
                v-decorator="['worth']"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="单件重量(kg)"
            >
              <a-input-number
                :min="0"
                :max="999999.999"
                :step="0.1"
                :initialValue="0"
                @change="onweightCustomChange"
                v-decorator="['weightCustom']"
              />
            </a-form-item>
          </a-col>

          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="单件体积(m³)"
            >
              <a-input-number
                :min="0"
                :max="999.9999"
                :step="0.1"
                :initialValue="0"
                @change="onvolumeCustomChange"
                v-decorator="['volumeCustom']"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="备注"
        >
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入备注"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

  <!-- <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24"></a-col>

          <a-col :lg="12" :md="12" :sm="24"></a-col>
  </a-row>-->
</template>
<script>
import {
  getPackageTypeByDataStatus,
  getCargoTypeByDataStatus
} from '@/api/libraries'
import { getAllPartners } from '@/api/resource/partner'
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  labelSingleCol: { span: 5 },
  wrapperSingleCol: { span: 16 }
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
    cargoRecord: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      myVisible: this.visible,
      checkNick: false,
      formItemLayout,
      form: this.$form.createForm(this),
      queryParam: {}, // 查询参数
      allPartnerList: [], // 客户名称列表
      packageTypeList: [],
      cargoTypeList: []
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    cargoRecord: {
      deep: true,
      handler: function (val) {
        console.log('watch-val', val)
        this.handleclose()
        this.$nextTick(() => {
          setTimeout(() => {
            this.form.setFieldsValue(val)
          }, 0)
        })
      }
    }
  },
  methods: {
    init () {
      this.getAllPartnerList()
      this.getCargoTypeList()
      this.getPackageTypeList()
    },
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
    },
    onOkForAdd () {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.$emit('onOkForAdd', values)
        }
      })
    },
    onOkForEdit () {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.$emit('onOkForEdit', values)
        }
      })
    },
    onChange (value) {
      console.log('changed', value)
    },
    getFloat (newValue, Precision) {
      if (!newValue || newValue === '') {
        newValue = 0
        return newValue
      }
      try {
        if ((newValue + '').indexOf('.') > -1) {
          newValue = parseFloat(newValue).toFixed(Precision + 1)
          newValue = newValue.substring(0, newValue.length - 1)
          let tempval = (newValue + '').split('.')
          let tfen = tempval[1]
          if (tempval.length > 1 && tfen.length > 0) {
            for (let i = 0; i < Precision; i++) {
              if (tfen.substring(tfen.length - 1) === '0') {
                tfen = tfen.substring(0, tfen.length - 1)
              }
            }
          }
          newValue = tempval[0] + '.' + tfen
        } else {
          newValue = parseInt(newValue)
        }
      } catch (e) {
        newValue = 0
      }
      return newValue
    },
    onLengthChange (newValue) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ lengthCustom: this.getFloat(newValue, 3) })
      })
    },
    onWidthChange (newValue) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ widthCustom: this.getFloat(newValue, 3) })
      })
    },
    onHeightChange (newValue) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ heightCustom: this.getFloat(newValue, 3) })
      })
    },
    onworthChange (newValue) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ worth: this.getFloat(newValue, 2) })
      })
    },
    onweightCustomChange (newValue) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ weightCustom: this.getFloat(newValue, 6) })
      })
    },
    onvolumeCustomChange (newValue) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ volumeCustom: this.getFloat(newValue, 6) })
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    processVolumeVal (newValue, setNewValueFn) {
      // return realVal
      // this.form.validateFields((err, values) => {
      // if (!err) {
      let values = this.form.getFieldsValue()
      console.log('values', values)
      setNewValueFn(values)
      // this.$emit('onLengthChange', values, newValue)
      // }
      // })
    },
    // 客户名称选择框事件处理方法
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleFocus () {
      console.log('focus')
    },
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    },
    getCargoTypeList () {
      getCargoTypeByDataStatus().then(res => {
        console.log('getCargoTypeByDataStatus', res.data)
        this.cargoTypeList = [...res.data]
      })
    },
    getPackageTypeList () {
      getPackageTypeByDataStatus().then(res => {
        console.log('getPackageTypeByDataStatus', res.data)
        this.packageTypeList = [...res.data, { dictId: 0, dictName: '无' }]
      })
    }
  }
}
</script>
