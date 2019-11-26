<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal title="特殊费处理" :width="1000" :visible="visible" :maskClosable="false" @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
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
              <a-form-item label="备注  ：">{{queryParam.nodeContent}}</a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
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
              <a-form-item label='结算对象：'>
                <a-select :dropdownStyle="{ minWidth: '260px' }" @change="handleSettlementObjIdChange" v-decorator="['settlementObj']">
                  <a-select-option v-for="sType in settlements" :key="sType.id">{{sType.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='费用类型：'>
                <a-select @change="typeChange1" v-decorator="['nodeType']">
                  <a-select-option v-for="expense in expenses" :key="JSON.stringify(expense)">{{expense.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="费用金额：">
                <a-input-number style="width:226px" v-decorator="['price', {rules: [{ required: true, message: '费用金额不能为空' }]}]" :min="0.01" :formatter='chknum' :parser='chknum' />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label='运输环节：'>
                <a-select @change="typeChange4" v-decorator="['transportType']">
                  <a-select-option v-for="transport in transports" :key="transport.id">{{transport.name }}</a-select-option>
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
                <a-select :disabled="queryParam.relationType === 1" @change="typeChange5" v-decorator="['proportionType']">
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
// import { getSettlementType } from '@/api/libraries'
import { transportationLink, conductAffairs, settlementStyle, getSettlementObject } from '@/api/track/track.js'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'
import trackBase from '@views/track/mixins/trackBase'

const opinions = [
  { id: 1, name: '通过' },
  { id: 2, name: '驳回' }
]
export default {
  name: 'AddDamage',
  mixins: [fileBase, trackBase],
  data () {
    return {
      opinions,
      number: '',
      submitter: '',
      addtime: '',
      // expenses: [],
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
      },
      queryParam: {
      }
    }
  },
  mounted () {
    transportationLink({}).then(res => {
      for (var i in res.data) {
        this.transports.push({ name: res.data[i], id: i })
      }
      console.log(this.transports)
    })

    settlementStyle({}).then(res => {
      for (var i in res.data) {
        this.settlementTypes.push({ name: res.data[i], id: i })
      }
    })
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    getRequestDataOnSettleObj () {
      return this.queryParam.waybillId ? { waybillId: this.queryParam.waybillId } : this.queryParam.dispatchId ? { dispatchId: this.queryParam.dispatchId } : undefined
    },
    add (infor, type) {
      this.queryParam = infor

      // 获取结算对象数据源
      const reqData = this.getRequestDataOnSettleObj()
      if (reqData) {
        reqData.expenseId = this.queryParam.expenseId
        getSettlementObject(reqData).then(res => {
          this.settlements = []
          for (var i in res.data) {
            this.settlements.push({
              name: this.getSettlementObjectDesc(res.data[i]),
              id: this.getSettlementObjectId(res.data[i])
            })
          }
          // 处理费用类型

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
          this.defaultName.nodeType = Number(infor.nodeType) // 费用类型
          this.defaultName.price = infor.price // 费用金额

          this.defaultName.settlementType = String(infor.settlementType) // 结算方式
          this.defaultName.proportionType = infor.equalizationMethod // 分摊方式
          if (infor.transportType === null || infor.transportType === 'null') {
            this.defaultName.transportType = undefined
          } else {
            this.defaultName.transportType = String(infor.transportType)// 运输类型
          }
          setTimeout(() => {
            console.log('settlementObj515', this.settlements)
            this.settlements.forEach(s => {
              const settleIdObj = JSON.parse(s.id)
              if (settleIdObj.dispatchCode === this.queryParam.dispatchCode) {
                this.defaultName.settlementObj = s.id
                this.handleSettlementObjIdChange(s.id)
              }
            })
            console.log('this.defaultName515', this.defaultName)
            this.form.setFieldsValue(this.defaultName)
          }, 100)
          this.visible = true
        })
      }
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
    typeChange4 (value) {
      this.queryParam.transportType = value
    },
    typeChange5 (value) {
      this.queryParam.proportionType = value
    },
    handleSettlementObjIdChange (value) { // 结算对象
      if (value) {
        const settlementObjIdObj = JSON.parse(value)
        let partParams = {}
        if (settlementObjIdObj.settleTypeNmae.indexOf('司机') >= 0) {
          partParams = { expenseType: 'DRIVER', typePartId: '司机' }
        } else if (settlementObjIdObj.settleTypeNmae.indexOf('承运商') >= 0) {
          partParams = { expenseType: 'NOVCC', typePartId: settlementObjIdObj.settleId }
        } else if (settlementObjIdObj.settleTypeNmae.indexOf('客户') >= 0) {
          partParams = { expenseType: 'PROJECT', typePartId: settlementObjIdObj.projectId }
        }
        this.initFeeTypeList(() => partParams).then(res => {
          const nodeTypeObj = this.expenses.filter(expense => expense.id === this.defaultName.nodeType)[0]
          console.log('this.expenses515', this.expenses, nodeTypeObj, this.defaultName.nodeType, this.form)
          this.defaultName.nodeType = JSON.stringify(nodeTypeObj)
          this.form.setFieldsValue({ nodeType: this.defaultName.nodeType })
        })
      } else {
        this.expenses = []
        this.typeChange1('')
      }
    },
    handleadd (e, isRefresh) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(this.queryParam, err)
        this.queryParam.price = values.price
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
