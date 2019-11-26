<template>
  <a-card
    title="时间信息"
    :bordered="false"
  >
    <a-form
      @submit="handleSubmit"
      :form="form"
      class="form"
    >
      <a-row
        class="form-row"
        :gutter="60"
      >
        <a-col :sm="6">
          <a-form-item label="要求提货时间">
            <a-date-picker
              v-decorator="['reqDeliveryDate']"
              :format="'YYYY-MM-DD HH:mm'"
              :showTime="true"
              @change="reqDeliveryDatecg"
              placeholder="请选择要求提货时间"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="时效(小时)">
            <a-input-number
              v-decorator="['timeLimit']"
              :max='999999.99'
              :min='0'
              placeholder="请输入时效(小时)"
              @blur="timeLimitcg"
              :formatter='chknum'
              style="width: 100%"
              :parser='chknum'
            />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="要求送货时间">
            <a-date-picker
              v-decorator="['reqArrivalDate']"
              :format="'YYYY-MM-DD HH:mm'"
              :showTime="true"
              @change="reqArrivalDatecg"
              placeholder="请选择要求送货时间"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="托运日期">
            <!-- <a-date-picker v-decorator="['transportDate',{ initialValue: moment(this.getToday(), 'YYYY-MM-DD').format('YYYY-MM-DD')}]" -->
            <a-date-picker
              v-decorator="['transportDate',{ initialValue: moment(this.getToday(), 'YYYY-MM-DD')}]"
              :format="'YYYY-MM-DD'"
              placeholder="请选择托运日期"
              @change="timeChange"
              :showTime="false"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import moment from 'moment'
import { deepClone } from '@/utils/util'
import { mapActions } from 'vuex'
export default {
  name: 'TimeModal',
  props: {
    timedata: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    timedata: {
      deep: true,
      handler: function (val) {
        this.model = deepClone(val)
        // this.model = JSON.parse(JSON.stringify(val))
        if (this.model) {
          if (this.model.reqDeliveryDate) {
            this.model.reqDeliveryDate = moment(this.model.reqDeliveryDate)
          }
          if (this.model.reqArrivalDate) {
            this.model.reqArrivalDate = moment(this.model.reqArrivalDate)
          }
          if (this.model.transportDate) {
            this.model.transportDate = moment(this.model.transportDate)
          }
        }
        // console.log('model', this.model)
        // console.log('this.model2', this.model)
        this.form.setFieldsValue(this.model)

        /**
         * 修改的时候存 时间
         */
        // console.log(moment(this.model.transportDate, 'YYYY-MM-DD'))
        // console.log(this.model.transportDate._i)
        this.settransportDate(this.model.transportDate._i)
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      model: {}
    }
  },
  methods: {
    moment,
    ...mapActions('waybill', ['settransportDate']),
    getToday () {
      let DD = new Date()
      DD.setTime(DD.getTime())
      let TT = DD.getMonth() + 1
      let AA = DD.getDate()

      if (TT < 10) {
        TT = '0' + TT
      }
      if (AA < 10) {
        AA = '0' + AA
      }
      let s2 = DD.getFullYear() + '-' + TT + '-' + AA
      console.log(s2)
      return s2
    },
    handleSubmit () {},
    /**
     * 托运日期
     */
    timeChange (val, options) {
      console.log(val)
      console.log(options)
      // 存时间
      this.settransportDate(options)
    },
    handleGetdata () {
      // 获取组件数据
      var tempdata = {}
      this.form.validateFields((err, values) => {
        // console.log('values', values)
        if (!err) {
          tempdata = deepClone(values)
          if (values.reqDeliveryDate) {
            // console.log('发送', values.reqDeliveryDate)
            tempdata.reqDeliveryDate = values.reqDeliveryDate.format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (values.reqArrivalDate) {
            // console.log('时间', values.reqArrivalDate)
            tempdata.reqArrivalDate = values.reqArrivalDate.format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          if (values.transportDate) {
            tempdata.transportDate = values.transportDate.format('YYYY-MM-DD')
          }
        }
      })
      console.log('ddd', tempdata)
      // return deepClone(this.model)
      return tempdata
    },
    chknum (value) {
      const reg = /^(-)*(\d+)\.(\d\d).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) {
          return parseFloat(value).toFixed(2)
        }
      }
    },
    reqDeliveryDatecg (mom, dateString) {
      console.log('time', dateString)
      var timeLimitval = this.form.getFieldValue('timeLimit')
      var reqArrivalDateval = this.form.getFieldValue('reqArrivalDate')
      // 如果要求提货时间为空 则不做处理
      if (
        dateString === undefined ||
        dateString === null ||
        dateString === ''
      ) {
        return
      }
      // 如果时效不为空则修改要求送货时间
      if (
        timeLimitval !== undefined &&
        timeLimitval !== null &&
        timeLimitval !== ''
      ) {
        this.form.setFieldsValue({
          reqArrivalDate: moment(mom).add(timeLimitval, 'hours')
        })
        return
      }
      // 如果要求送货时间不为空则修改时效
      if (
        reqArrivalDateval !== undefined &&
        reqArrivalDateval !== null &&
        reqArrivalDateval !== ''
      ) {
        var hours = reqArrivalDateval.diff(mom, 'hours')
        if (hours < 0) {
          this.form.setFieldsValue({ reqArrivalDate: mom })
          this.form.setFieldsValue({ timeLimit: 0 })
        } else {
          this.form.setFieldsValue({ timeLimit: hours })
        }
      }
    },
    timeLimitcg () {
      var reqDeliveryDateval = this.form.getFieldValue('reqDeliveryDate')
      var reqArrivalDateval = this.form.getFieldValue('reqArrivalDate')
      var timeLimitval = this.form.getFieldValue('timeLimit')
      // var timeLimitval = this.form.getFieldValue('timeLimit')
      // var timeLimitval = value
      // 如果时效为空 则不做处理
      if (
        timeLimitval === undefined ||
        timeLimitval === null ||
        timeLimitval === ''
      ) {
        return
      }
      // console.log('reqDeliveryDateval', reqDeliveryDateval)
      // 如果要求提货时间不为空则修改要求送货时间
      if (
        reqDeliveryDateval !== undefined &&
        reqDeliveryDateval !== null &&
        reqDeliveryDateval !== ''
      ) {
        this.form.setFieldsValue({
          reqArrivalDate: moment(reqDeliveryDateval).add(timeLimitval, 'hours')
        })
        return
      }
      // console.log('reqArrivalDateval', reqArrivalDateval)
      // 如果要求送货时间不为空则修改时效
      if (
        reqArrivalDateval !== undefined &&
        reqArrivalDateval !== null &&
        reqArrivalDateval !== ''
      ) {
        // console.log('reqDeliveryDateval--', moment(reqArrivalDateval).subtract(timeLimitval, 'hours'))
        this.form.setFieldsValue({
          reqDeliveryDate: moment(reqArrivalDateval).subtract(
            timeLimitval,
            'hours'
          )
        })
      }
    },
    reqArrivalDatecg (mom, dateString) {
      var reqDeliveryDateval = this.form.getFieldValue('reqDeliveryDate')
      var timeLimitval = this.form.getFieldValue('timeLimit')
      // 如果要求送货时间为空 则不做处理
      if (dateString === null || dateString === '') {
        return
      }
      // 如果时效不为空则修改要求提货时间
      if (
        timeLimitval !== undefined &&
        timeLimitval !== null &&
        timeLimitval !== ''
      ) {
        this.form.setFieldsValue({
          reqDeliveryDate: moment(mom).subtract(timeLimitval, 'hours')
        })
        return
      }
      // 如果要求提货时间不为空则修改时效
      if (
        reqDeliveryDateval !== undefined &&
        reqDeliveryDateval !== null &&
        reqDeliveryDateval !== ''
      ) {
        var hours = mom.diff(reqDeliveryDateval, 'hours')
        if (hours < 0) {
          this.form.setFieldsValue({ reqDeliveryDate: mom })
          this.form.setFieldsValue({ timeLimit: 0 })
        } else {
          this.form.setFieldsValue({ timeLimit: hours })
        }
      }
    }
  }
}
</script>
