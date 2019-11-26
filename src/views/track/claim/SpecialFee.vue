<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal title="事件处理" :width="1000" :visible="visible" :maskClosable="false" @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
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
              <a-form-item label="信息来源：">{{queryParam.sourceTypeName}} </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs='24'>
              <a-form-item label="备注  ：">{{queryParam.remark}} </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs='24'>
              <a-form-item label="图片：">
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
              <a-form-item label='结算类型：'>
                <a-select @change="typeChange6" v-decorator="['settlementObj']">
                  <a-select-option v-for="sType in sTypes" :key="sType.id">{{sType.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='结算对象：'>
                <a-select @change="handleSettleObjChange" v-decorator="['settlementObjId']" >
                  <a-select-option v-for=" (settlement,indx) in settlements[queryParam.settlementObj]" :key="settlement.dispatchId" :value='(settlement.dispatchId || "")+"-"+indx'>{{settlement.settlementName || '' }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='费用类型：'>
                <a-select @change="handleNodeTypeChange" v-decorator="['nodeType']">
                  <a-select-option v-for="expense in expenses" :key="JSON.stringify(expense)">{{expense.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="费用金额：">
                <a-input-number style="width:226px" v-decorator="['price', {rules: [{ required: true, message: '费用金额不能为空' }]}]" :min="0.01" :formatter='chknum' :parser='chknum' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='结算方式：'>
                <a-select @change="typeChange2" v-decorator="['settlementType']" >
                  <a-select-option v-for="transport in settlementTypes" :key="transport.id">{{transport.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='分摊方式：'>
                <a-select @change="typeChange5" v-decorator="['equalizationMethod']">
                  <a-select-option v-for="proportion in proportionTypes" :key="proportion.id">{{proportion.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { getSettlementType, getFeeList } from '@/api/libraries'
import { transportationLink, conductAffairs, settlementStyle, getSettlementObject2 } from '@/api/track/track.js'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'

const opinions = [
  { id: 1, name: '通过' },
  { id: 2, name: '驳回' }
]
export default {
  name: 'AddDamage',
  mixins: [fileBase],
  props: {
    trackData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      opinions,
      number: '',
      submitter: '',
      addtime: '',
      expenses: [],
      transports: [],
      settlements: [], // 结算对象
      sTypes: [], // 结算类型
      sTypes1: [], // 结算类型记忆
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
      settleValue: '',
      defaultName: {
        price: '',
        expenses: '',
        transports: '',
        settlements: '',
        settlementType: '', // 结算方式 月结，
        settlementObj: '', // 结算类型 客户,承运商
        equalizationMethod: ''
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
        equalizationMethod: 1,
        price: '',
        remark: '',
        handUrlJson: ''
      }
    }
  },
  mounted () {
    this.initFeeTypeList()

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
        const name = res.data[i]
        name !== '到付' && this.settlementTypes.push({ name: name, id: i })
      }
    })

    getSettlementType().then(res => { // 获取结算类型 // sTypes 结算类型 如果relationType=2 结算类型不能为客户
      this.sTypes1 = res.data.map(v => {
        return {
          name: v.dictName,
          id: v.dictId
        }
      }).splice(0, 3)
    })
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    initFeeTypeList () {
      let userinfo = this.$store.getters.userInfo || {}
      getFeeList({
        expenseType: 'EXCEPTION',
        notToList: [0],
        typePartId: 'EXCEPTION',
        tenantId: userinfo.tenantId
      }).then(res => {
        console.log('getFeeList>res', res)
        this.expenses = res.data.map(v => {
          return {
            name: v.expenseSelfName,
            id: v.tanantNumberId
          }
        })
      })
    },
    add (infor, type) {
      this.sTypes = infor.relationType === 1 ? this.sTypes1 : [this.sTypes1[1], this.sTypes1[2]]
      let val = infor
      let reqData = {
        relationType: val.relationType
      }
      console.log('cols515', this.columns, this.cols, val)
      if (val.relationType === 2) {
        reqData.dispatchId = val.dispatchId
      } else if (val.relationType === 1) {
        reqData.waybillId = val.waybillId
      }

      // 获取结算对象
      getSettlementObject2(reqData).then(res => {
        this.settlements = res.data
        console.log('this.form.getFieldValue(settlementObj', this.form.getFieldValue('settlementObj'))

        this.queryParam = infor
        // this.queryParam.equalizationMethod = 1
        if (type === 1) {
          this.number = '事件编号：'
          this.submitter = '事件添加人：'
          this.addtime = '添加时间：'
        } else {
          this.number = '特殊费编号：'
          this.submitter = '特殊费添加人：'
          this.addtime = '发生日期：'
        }
        let imgList = infor.handUrlJson
        if (infor !== null) {
          imgList = JSON.parse(imgList)
          if (typeof imgList === 'string') {
            imgList = JSON.parse(imgList)
          }
          this.fileList = imgList
        }
        // this.defaultName.nodeType = JSON.stringify(this.expenses.filter(expense => expense.id === infor.nodeType)) // 费用类型
        this.defaultName.price = infor.price // 费用金额
        this.defaultName.settlementObj = infor.settlementObj // 结算类型
        this.defaultName.settlementType = String(infor.settlementType) // 结算方式
        this.defaultName.equalizationMethod = infor.equalizationMethod // 分摊方式
        setTimeout(() => {
          this.form.setFieldsValue(this.defaultName)
          let settle = this.form.getFieldValue('settlementObj')
          let settleValue = this.settlements[settle]

          settleValue && setTimeout(() => {
            const nodeTypeObj = this.expenses.filter(expense => expense.id === Number(infor.nodeType))[0]
            console.log('this.expenses515', this.expenses, nodeTypeObj, infor.nodeType)
            this.form.setFieldsValue({
              settlementObjId: settleValue.length === 1 ? (settleValue[0].dispatchId || '') + '-0' : '',
              nodeType: JSON.stringify(nodeTypeObj) // 费用类型
            })
          }, 0)
        }, 100)
        this.visible = true
      })
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
    handleNodeTypeChange (value) {
      this.queryParam.nodeType = value
    },
    typeChange2 (value) { // 结算方式
      this.queryParam.settlementType = value
    },
    handleSettleObjChange (value) {
      this.queryParam.settlementObjId = value
      // this.settleValue = value
    },
    typeChange4 (value) {
      this.queryParam.transportType = value
    },
    typeChange5 (value) {
      this.queryParam.equalizationMethod = value
    },
    typeChange6 (value) { // 结算类型
      console.log(this.settlements)
      let that = this
      setTimeout(() => {
        that.form.setFieldsValue({
          'settlementObjId': that.settlements[value].length === 1 ? (this.settlements[value][0].dispatchId || '') + '-0' : ''
        })
      }, 0)
      this.queryParam.settlementObj = value
    },
    handleadd (e, isRefresh) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log('$$$$$', this.queryParam, err)
        console.log('-----', this.queryParam.settlementObjId)
        if (this.queryParam.settlementObjId.indexOf('-') !== -1) {
          this.queryParam.settlementObjId = this.queryParam.settlementObjId.split('-')[0]
        }
        console.log('=====', this.queryParam.settlementObjId)
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
        const nodeTypeObj = this.queryParam.nodeType ? JSON.parse(this.queryParam.nodeType) : {}
        this.queryParam.nodeType = nodeTypeObj.id
        this.queryParam.nodeTypeName = nodeTypeObj.name
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
