<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :width="1000" :visible="visible" :maskClosable="false" @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <a-spin :spinning="confirmLoading">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :xs='8'>
              <a-form-item :label="number">{{queryParam.expenseCode}} </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="关联类型：">{{queryParam.relationTypeName}}</a-form-item>
            </a-col>
            <a-col :xs='8'>
              <a-form-item label="关联单号：">{{queryParam.codeName}}</a-form-item>
            </a-col>
            <a-col :xs="8">
              <a-form-item :label="submitter">{{queryParam.createAccountName}}</a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item :label="addtime">{{queryParam.nodeDate}} </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="信息来源：">{{queryParam.sourceType}} </a-form-item>
            </a-col>
            <a-col :xs='6' v-if="modalType === 1">
              <a-form-item label="异常单号：">{{queryParam.exceptionCode}} </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs='24'>
              <a-form-item label="备注  ：">{{queryParam.remark}} </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16" v-if="modalType === 2">
            <a-col :xs='24'>
              <a-form-item label="特殊费图片：">
                <img style="width:100px;height:100px;margin:0 15px 15px 0" v-for="(item, index) in fileList" :src="item" :key="index" alt="" @click="handlePreview(item)">
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg">
                  <img alt="example" style="width: 100%" :src="previewImage">
                </a-modal>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <h3 style="margin-top:50px;font-weight:bold">处理信息</h3>
        <a-form :form="form">
          <a-row class="form-row" :gutter="16">
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='费用类型：'>
                <a-select @change="typeChange1" v-decorator="['nodeType']">
                  <a-select-option v-for="expense in expenses" :key="expense.id">{{expense.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="费用金额：">
                <a-input-number style="width:226px" v-decorator="['price', {rules: [{ required: true, message: '费用金额不能为空' }]}]" :formatter='chknum' :parser='chknum' />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24" v-if="modalType === 2">
              <a-form-item label='运输环节：'>
                <a-select @change="typeChange4" v-decorator="['transportType']">
                  <a-select-option v-for="transport in transports" :key="transport.id">{{transport.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24" v-if="modalType === 1">
              <a-form-item label='结算类型：'>
                <a-select @change="typeChange6" v-decorator="['settlementObj']">
                  <a-select-option v-for="sType in sTypes" :key="sType.id">{{sType.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='结算对象：' v-if="modalType === 1">
                <a-select @change="typeChange3" v-decorator="['settlements']">
                  <a-select-option v-for="settlement in settlements" :key="settlement.id">{{settlement.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='结算方式：'>
                <a-select @change="typeChange2" v-decorator="['settlementType']">
                  <a-select-option v-for="transport in settlementTypes" :key="transport.id">{{transport.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='分摊方式：'>
                <a-select @change="typeChange5" v-decorator="['proportionType']">
                  <a-select-option v-for="proportion in proportionTypes" :key="proportion.id">{{proportion.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- <a-form-item label='说明：' hasFeedback >
            <a-textarea :rows="5" placeholder="最多可输入50个汉字" v-decorator="['remark']"/>
          </a-form-item> -->
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { getSettlementType } from '@/api/libraries'
import { transportationLink, conductAffairs, settlementStyle, getExpense, getSettlementObject2 } from '@/api/track/track.js'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'

const opinions = [
  { id: 1, name: '通过' },
  { id: 2, name: '驳回' }
]
export default {
  name: 'AddDamage',
  mixins: [fileBase],
  data () {
    return {
      opinions,
      modalType: '',
      number: '',
      submitter: '',
      addtime: '',
      expenses: [],
      transports: [],
      settlements: [], // 结算对象
      sTypes: [], // 结算类型
      settlementTypes: [], // 结算方式
      proportionTypes: [{ id: 1, name: '按运单' }, { id: 2, name: '按件数' }, { id: 3, name: '按重量' }, { id: 4, name: '按体积' }], // 分摊方式
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
      documentId: '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      invoiceId: '',
      imgurl: '',
      dataSource: [],
      info: {},
      defaultName: {
        price: '',
        expenses: '',
        transports: '',
        settlements: '',
        settlementType: '', // 结算方式 月结，
        settlementObj: '', // 结算类型 客户,承运商
        proportionType: ''
      },
      queryParam: {
        expenseId: '', // 事件编号
        waybillId: '',
        dispatchId: '',
        auditingType: 1,
        nodeType: '10',
        transportType: 1,
        settlementType: 1,
        settlementObj: 1,
        proportionType: 1,
        price: '',
        remark: '',
        picJson: ''
      }
    }
  },
  mounted () {
    transportationLink({}).then(res => {
      for (var i in res.data) {
        this.transports.push({ name: res.data[i], id: i })
      }
      this.defaultName.transports = this.transports[0].name
    })

    // settlementObject({}).then(res => { //结算对象
    //   for (var i in res.data) {
    //     this.settlements.push({ name: res.data[i], id: i })
    //   }
    // })

    settlementStyle({}).then(res => {
      for (var i in res.data) {
        this.settlementTypes.push({ name: res.data[i], id: i })
      }
    })
    getExpense().then(res => { // 获取费用类型
      this.expenses = res.data.map(v => {
        return {
          name: v.subDictAlias,
          id: String(v.subDictId)
        }
      })
    })

    getSettlementType().then(res => { // 获取结算类型
      // sTypes 结算类型 如果relationType=2 结算类型不能为客户
      this.sTypes = res.data.map(v => {
        return {
          name: v.dictName,
          id: v.dictId
        }
      }).splice(0, 3)
    })
  },
  computed: {
    ...mapGetters(['tenantId']),
    title () {
      return this.modalType === 1 ? `事件处理` : `特殊费处理`
    }
  },
  methods: {
    add (infor, type) {
      let dispatchId = infor.relationType === 2 ? infor.dispatchId : ''
      let waybillId = infor.relationType === 1 ? infor.waybillId : ''
      getSettlementObject2({ dispatchId: dispatchId, relationType: infor.relationType, waybillId: waybillId }).then(res => { // 结算对象-赔偿索赔专用
        console.log(res, '结算对象 根据结算类型筛选可用值')
        // this.data.forEach(v => {
        //   v.settlementObj_2 = _.cloneDeep(res.data)
        //   this.settlementObj_2 = res.data
        // })
      })

      this.modalType = type
      this.queryParam = infor
      this.queryParam.proportionType = 1
      if (type === 1) {
        this.number = '事件编号：'
        this.submitter = '事件添加人：'
        this.addtime = '添加时间：'
      } else {
        this.number = '特殊费编号：'
        this.submitter = '特殊费添加人：'
        this.addtime = '发生日期：'
      }
      let imgList = infor.picJson
      if (infor !== null) {
        imgList = JSON.parse(imgList)
        if (typeof imgList === 'string') {
          imgList = JSON.parse(imgList)
        }
        this.fileList = imgList
      }
      this.defaultName.nodeType = String(infor.nodeType) // 费用类型
      this.defaultName.price = infor.price // 费用金额
      this.defaultName.settlementObj = infor.settlementObj // 结算类型
      this.defaultName.settlementType = String(infor.settlementType) // 结算方式
      this.defaultName.proportionType = infor.equalizationMethod // 分摊方式
      setTimeout(() => {
        this.form.setFieldsValue(this.defaultName)
      }, 100)
      this.visible = true
    },
    handleCancelimg () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file
      this.previewVisible = true
    },
    typeChange (value) {
      this.queryParam.auditingType = value
    },
    typeChange1 (value) {
      this.queryParam.nodeType = value
    },
    typeChange2 (value) { // 结算方式
      this.queryParam.settlementType = value
    },
    typeChange3 (value) {
      this.queryParam.settlementObj = value
    },
    typeChange4 (value) {
      this.queryParam.transportType = value
    },
    typeChange5 (value) {
      this.queryParam.proportionType = value
    },
    typeChange6 (value) { // 结算类型
      this.queryParam.settlementObj = value
    },
    handleadd (e, isRefresh) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(this.queryParam, err)
        // const feeType = this.expenses[this.queryParam.nodeType - 1].name
        // const setObj = this.settlements[this.queryParam.settlementObj - 1].name
        // const agree = this.opinions[this.queryParam.auditingType - 1].name
        // const setType = this.settlementTypes[this.queryParam.settlementType - 1].name
        this.queryParam.price = values.price
        // values.remark = values.remark === undefined ? '' : values.remark
        // this.queryParam.remark = `处理意见：${agree}，费用金额：${values.price}元，费用类型：${feeType}，结算对象：${setObj}，结算方式：${setType}。${values.remark}`
        if (values.price === undefined) {
          this.$message.info('请输入金额')
          return false
        }
        this.confirmLoading = true
        conductAffairs(this.queryParam).then(res => {
          this.confirmLoading = false
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.$emit('hideForm', isRefresh)
          } else {
            this.$message.fail(res.message)
          }
          this.info = {}
          this.visible = false
          this.form.resetFields()
        }).catch(error => {
          this.confirmLoading = false
          this.$message.fail(error)
        })
      })
    },
    handleaddCancel (isRefresh) {
      this.info = {}
      this.visible = false
      this.form.resetFields()
      this.$emit('hideForm', isRefresh)
    },
    chknum (value) {
      const reg = /^(-)*(\d+)\.(\d\d).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) { return (parseFloat(value)).toFixed(2) }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.site-addr-form-layout {
  .get-map {
    display: inline;
    cursor: pointer;
  }
}

.ant-form-item {
  margin-bottom: 10px;
}
</style>
