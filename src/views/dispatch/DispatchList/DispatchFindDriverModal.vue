<template>
  <div class="form-layout-body">
    <a-modal :visible="myVisible" :title="heading" :maskClosable="false"
             @cancel="handleclose">
      <template slot="footer">
        <a-button key="back" @click="handleclose">取消</a-button>

        <Confirm-Info
          :title="'请确认司机信息，保存后无法修改'"
          :isForList="false"
          :content="'确认'"
          @onconfirm="onOkForAdd"
        ></Confirm-Info>
      </template>
      <a-form :form="form">
        <a-form-item>
          <a-input type="hidden"  v-decorator="['driverId']"/>
        </a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="司机姓名"
        >
          <a-auto-complete
            @search="handleDriverNameSearch"
            @change="handleDriverNameChange"
            placeholder="请输入司机姓名"
            v-decorator="['driverName',
            {rules: [{ required: true, message: '司机姓名不能为空' }]}]"
            :filterOption="true"
          >
            <template slot="dataSource">
              <a-select-option v-for="d in allDrivers"  :key="JSON.stringify(d)">
                <!--{{d.driverName}}-{{d.mobile}}-->
                <a-row>
                  <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.driverName}}</a-col>
                  <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.mobile}}</a-col>
                </a-row>
              </a-select-option>
            </template>
          </a-auto-complete>
          <!--<a-select-->
            <!--:value="selectedDriver.driverName"-->
            <!--showSearch-->
            <!--:defaultActiveFirstOption="false"-->
            <!--:showArrow="false"-->
            <!--:filterOption="filterOption"-->
            <!--@search="handleSearch"-->
            <!--@change="handleChange"-->
            <!--notFoundContent="暂无司机信息"-->
            <!--v-decorator="['driverName',-->
          <!--{rules: [{ required: true, message: '司机姓名不能为空' }]}]"-->
            <!--placeholder="请输入司机姓名"-->
          <!--&gt;-->
            <!--<a-select-option-->
              <!--v-for="d in allDrivers"-->
              <!--:key="JSON.stringify(d)"-->
            <!--&gt;{{d.driverName}}&nbsp;&nbsp;{{d.mobile}}</a-select-option>-->
          <!--</a-select>-->
        </a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="司机手机号"
        >
          <a-auto-complete
            @search="handleMobileSearch"
            @change="handleMobileChange"
            placeholder="请输入司机手机号"
            v-decorator="['mobile',
          {rules: [{ required: true, message: '司机手机号不能为空' }]}]"
            :filterOption="true"
          >
            <template slot="dataSource">
              <a-select-option v-for="d in allDrivers"  :key="JSON.stringify(d)">
                <!--{{d.driverName}}-{{d.mobile}}-->
                <a-row>
                  <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.driverName}}</a-col>
                  <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.mobile}}</a-col>
                </a-row>
              </a-select-option>
            </template>
          </a-auto-complete>
          <!--<a-select-->
            <!--:value="selectedDriver.mobile"-->
            <!--showSearch-->
            <!--:defaultActiveFirstOption="false"-->
            <!--:showArrow="false"-->
            <!--:filterOption="filterOption"-->
            <!--@search="handleSearch"-->
            <!--@change="handleChange"-->
            <!--notFoundContent="暂无司机信息"-->
            <!--v-decorator="['mobile',-->
          <!--{rules: [{ required: true, message: '司机手机号不能为空' }]}]"-->
            <!--placeholder="请输入司机手机号"-->
          <!--&gt;-->
            <!--<a-select-option-->
              <!--v-for="d in allDrivers"-->
              <!--:key="JSON.stringify(d)"-->
            <!--&gt;{{d.driverName}}&nbsp;&nbsp;{{d.mobile}}</a-select-option>-->
          <!--</a-select>-->
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
import ConfirmInfo from '@/components/ConfirmInfo/ConfirmInfo'
import driverListBase from '@/views/dispatch/DispatchList/mixins/driver_list_base'
import { lookdriver } from '@/api/dispatch/dispatch'
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  labelSingleCol: { span: 5 },
  wrapperSingleCol: { span: 16 }
}
export default {
  name: 'DispatchFindDriverModal',
  mixins: [driverListBase],
  components: {
    ConfirmInfo
  },
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
    dispatchId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      myVisible: this.visible,
      formItemLayout,
      form: this.$form.createForm(this),
      queryParam: {} // 查询参数
    }
  },
  watch: {
    visible (val) {
      console.log('visible', val)
      this.myVisible = val
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
    },
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
      this.$emit('onFindDriverCancel')
    },
    onOkForAdd () {
      console.log('dispatchId', this.dispatchId)
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          this.fetchData(this, { driverName: values.driverName, mobile: values.mobile }, (context, res) => {
            console.log('getAllDrivers(...values)', res)
            if (res.data.length === 0) {
              context.form.setFieldsValue({ driverId: '' })
            }
            lookdriver({ dispatchId: context.dispatchId, ...values }).then(res => {
              context.handleclose()
              context.$emit('onOkForAdd', context.dispatchId, values)
              context.$message.success('找司机成功')
            })
          })
        }
      })
    }
  }
}
</script>
