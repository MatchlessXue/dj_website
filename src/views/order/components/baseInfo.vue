<template>
  <div>
    <a-form
      :form="form"
      :layout="formLayout"
    >
      <a-row :gutter="16">
        <a-col :xs='6'>
          <a-form-item label="订单号">
            <a-input
              v-decorator="['waybillId']"
              placeholder="请选择订单号"
              :disabled="true"
            />
          </a-form-item>
        </a-col>
        <a-col :xs='6'>
          <a-form-item label="客户名称">
            <a-auto-complete
              :dataSource="clientNameMap"
              @change="ClientNameChange"
              @select="clientSelect"
              v-decorator="['partnerName',{rules: [{ required: true, message: '请选择客户名称!' }]}]"
              placeholder="请选择客户名称"
            />
          </a-form-item>
        </a-col>
        <a-col :xs='6'>
          <a-form-item label="客户单号">
            <a-input
              v-decorator="['clientCode']"
              placeholder="请输入客户单号"
            />
          </a-form-item>
        </a-col>
        <a-col :xs='6'>
          <a-form-item label="手工单号">
            <a-input
              v-decorator="['manualCode']"
              placeholder="请输入手工单号"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :xs="6">
          <a-form-item label="运输方式">
            <a-select
              placeholder="请选择运输方式"
              v-decorator="['transportType',{initialValue:1}]"
              @change="transportWayChange"
            >
              <a-select-option
                v-for="item in transportTypeMap"
                :value="item.dictId"
                :key="item.dictId"
              >
                {{item.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
          <a-form-item label="车长">
            <a-select
              placeholder="请选择车长"
              v-decorator="['truckLength']"
              @change="CaptainChange"
            >
              <!-- <a-select-option value="请选择车长">请选择车长</a-select-option> -->
              <a-select-option
                v-for="item in truckLongsMap"
                :key="item.catalogId"
                :value="item.dictId"
              >
                {{item.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
          <a-form-item label="车辆类型">
            <a-select
              v-decorator="['truckType']"
              placeholder="请选择车辆类型"
              @change="carTypeChange"
            >
              <a-select-option
                v-for="item in truckTypeMap"
                :catid="item.catalogId"
                :key="item.dictId"
              >
                {{item.dictName}}
              </a-select-option>
            </a-select>

          </a-form-item>
        </a-col>
        <a-col :xs="6">
          <a-form-item label="载重">
            <a-input
              v-decorator="['truckLoad', ]"
              addonAfter="kg"
              :max='999999'
              :min='0'
              @change='chknum'
              placeholder="请输入载重"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>

</template>
<script>
import { mapActions } from 'vuex'
import { throttle, trim } from 'lodash'

import librariesBase from '@views/mixins/libraries_base'
import { getAllPartners } from '@/api/resource/partner.js'
import { formatValue } from '@/utils/util'
export default {
  name: 'orderbaseinfo',
  mixins: [librariesBase],
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formLayout: 'vertical',
      partnerId: '',
      partnerName: '',
      clientNameMap: [],
      clientNameList: [],
      formValue: {
        orderNumber: '',
        transportType: '',
        partnerName: '',
        truckLength: '',
        clientCode: '',
        truckType: '',
        manualCode: '',
        truckLoad: ''
      }
    }
  },
  computed: {},
  mounted () {
    this.getTransportTypeMap()
    this.getTruckLongsMap()
    this.getTruckTypeByDataStatusMap()
    this.init()
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          let aa = formatValue(val)
          console.log('baseinfo', aa)
          this.form.setFieldsValue(aa)
          this.form.setFieldsValue({ waybillId: aa.waybillCode })
          /**
           * 存储合同匹配相关信息
           */
          this.settransportWay(val.transportType)
        })
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.form.setFieldsValue({ transportType: 1 })
      this.settransportWay(1)
    })
  },
  methods: {
    ...mapActions('waybill', ['setPartnerId', 'settransportWay']),
    init () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        const datas = res.data || []
        this.clientNameList = res.data
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach(val => {
          source.push({
            value: val.partnerId,
            text: val.partnerName,
            some: val
          })
        })
        this.clientNameMap = source
      })
    },
    chknum (value) {
      var val = value.target.defaultValue
      if (
        value.type === 'change' &&
        val !== undefined &&
        value !== null &&
        value !== '' &&
        !isNaN(val) &&
        val.length > 0
      ) {
        var num = parseFloat(val).toFixed(0)
        if (num < 0) {
          num = 0
        } else if (num > 999999) {
          num = 999999
        } else {
        }
        value.target.value = num + ''
      }
    },
    ClientNameChange: throttle(async function (v) {
      console.log(v)
      /**
       * 删除了客户名称后，将客户名称的id清空
       */
      if (v === '') {
        this.init()
        return
      }
      const key = trim(v)
      // 重置表单的值
      // this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        await getAllPartners({ partnerName: key, partnerTypes: 1 }).then(
          res => {
            const datas = res.data || []
            self.clientNameList = res.data
            // 用于级联的下拉列表的显示只能是如下格式
            let source = []
            datas.forEach(val => {
              source.push({
                value: val.partnerId,
                text: val.partnerName,
                some: val
              })
            })
            self.clientNameMap = source
          }
        )
      }
    }, 500),
    // form
    transportWayChange (value) {
      console.log(value)
      /**
       * 将运输方式存储
       */
      this.settransportWay(value)
    },
    clientSelect (value, option) {
      //   console.log('......')
      console.log(option)
      console.log(value)
      console.log(option.key)
      this.partnerId = option.key
      /**
       * 存入相关的客户id
       */
      this.setPartnerId(this.partnerId)
      this.$emit('showpartnerid', option.key)
      for (let i = 0; i < this.clientNameList.length; i++) {
        if (String(value) === this.clientNameList[i].partnerId) {
          this.partnerName = this.clientNameList[i].partnerName
          console.log('11111', this.partnerName)
        }
      }
    },
    CaptainChange (value) {},
    carTypeChange (value) {},
    backPartnerId () {
      return this.partnerId
    },
    backPartnerName () {
      return this.partnerName
    }
  }
}
</script>
<style lang="less" scoped>
.fl_left {
  float: left;
  margin-right: 60px;
}
</style>
