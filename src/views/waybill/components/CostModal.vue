<template>
  <a-card title="费用信息" :bordered="false">
    <a-form @submit="handleSubmit" :form="form" class="form">
      <a-radio-group
        :options="radioOptions"
        @change="radioChange"
        class="mb10"
        v-model="selectTypeValue"
      />
      <a-row class="form-row" :gutter="60">
        <a-col :sm="6">
          <a-form-item label="计费方式">
            <div id="components-layout" style="width: 100%">
              <a-layout style="width: 100%" class="wa_paytype_choose">
                <a-select
                  placeholder="请选择计费方式"
                  :class="`${isaAgreementType ? 'has-btn' : ''}`"
                  v-decorator="['priceUnit']"
                  @change="changepriceUnit"
                >
                  <a-select-option
                    v-for="priceUnititem in priceUnitList"
                    :key="priceUnititem.dictId"
                  >{{priceUnititem.dictName}}</a-select-option>
                </a-select>
                <a-button
                  type="primary"
                  v-if="isaAgreementType"
                  style="border-radius: 0 5px 5px 0;"
                  class="pipei_btn"
                  :loading="loading"
                  @click="getmatchcontractprice"
                >匹配合同</a-button>
              </a-layout>
            </div>
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="单价（元）">
            <a-input-number
              :max="max"
              :min="min"
              v-decorator="['unitPrice']"
              :disabled="isaAgreementType"
              placeholder="请输入单价"
              @change="timeLimitcg"
              :formatter="chknum"
              style="width: 100%"
              :parser="chknum"
            />
          </a-form-item>
        </a-col>
        <a-col :sm="6" v-if="isaAgreementType">
          <a-form-item label="合同名称">
            <a-input :disabled="true" v-decorator="['contractName']" placeholder="请匹配合同"/>
          </a-form-item>
          <a-form-item style="margin-bottom: 0px;">
            <a-input v-decorator="['contractId']" :hidden="true"/>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 动态渲染费用信息 -->
      <a-row class="form-row" :gutter="60">
        <a-col :sm="6" v-for="cost in allCostTypeList" :key="cost.subDictId">
          <a-form-item :label="cost.subDictAlias || cost.subDictName + '（元）'">
            <a-input-number
              :max="max"
              :min="min"
              v-model="cost.incomeMoney"
              :disabled="isaAgreementType"
              :placeholder="'请输入' + (cost.subDictAlias || cost.subDictName)"
              :formatter="chknum"
              @change="e => handleChange(e, cost.subDictId)"
              style="width: 100%"
              :parser="chknum"
            />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="费用合计">
            <a-input-number
              :disabled="true"
              v-decorator="['totalMoney',{initialValue:0}]"
              :formatter="chknum"
              style="width: 100%"
              :parser="chknum"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-modal
      title="合同列表"
      v-model="visibleData"
      @ok="contractSubmit"
      okText="确认"
      cancelText="取消"
      width="950px"
    >
      <div class="contract">
        <a-radio-group @change="onChange" v-model="redioVal">
          <div class="item" v-for="(items, index) in contractList" :key="items.contractId">
            <div class="check-box">
              <a-radio :value="index"></a-radio>
            </div>
            <a-card>
              <table class="table">
                <tr>
                  <td>合同名称：{{items.contractName}}</td>
                  <td>客户名称：{{items.partnerName}}</td>
                  <td>计费方式：{{items.priceUnitName}}</td>
                  <td>费用总计：{{items.sumCharge}}</td>
                </tr>
              </table>
              <a-card-grid class="ant-card-box" style="width:16.66%;">单价：{{items.price}}</a-card-grid>
              <a-card-grid
                class="ant-card-box"
                v-for="obj in items.matchCargoResultVoList"
                :key="obj.chargeType"
                style="width:16.66%;"
              >{{obj.chargeName}}：{{obj.totalPrice}}</a-card-grid>
            </a-card>
          </div>
        </a-radio-group>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import {
//   getPriceUnit
//   getCostTypeByDataStatus
// } from '@/api/libraries'
import { deepClone } from '@/utils/util'
/**
 * getOrderPrice 获取价格匹配
 *
 */

// import { getOrderPrice } from '@/api/waybill/waybill'
import { getmatchprice } from '@/api/resource/contract'
import { getSubCostTypeListByDataStatus } from '@/api/libraries'
import wmath from '../../../utils/wmath'

export default {
  name: 'CostModal',
  props: {
    costdata: {
      type: Object,
      default () {
        return {}
      }
    },
    currentId: {
      type: String,
      default () {
        return {}
      }
    },
    projectId: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      priceUnitList: [
        {
          dictId: 1,
          dictName: '件数'
        },
        {
          dictId: 2,
          dictName: '重量'
        },
        {
          dictId: 3,
          dictName: '体积'
        }
      ], // 计费方式列表
      allCostTypeList: [], // 费用类型列表
      selectTypeValue: 1,
      loading: false,
      isaAgreementType: true,
      radioOptions: [
        { label: '按合同计费', value: 1 },
        { label: '按手工计费', value: 2 }
      ],
      max: 999999.99,
      min: 0,
      visible: false,
      standrd: {
        amount: 0,
        cargoType: 1,
        computeType: 0,
        matchCargoVoList: [
          // {
          //   'cargoId': '',
          //   'cargoType': '',
          //   'goodsAmount': '',
          //   'goodsVolume': '',
          //   'goodsWeight': ''
          // }
        ],
        partnerId: '',
        projectId: '',
        priceUnit: '0',
        rvCityRgcode: '',
        rvDistrictRgcode: '',
        rvProvinceRgcode: '',
        rvStreetRgcode: '',
        sdCityRgcode: '',
        sdDistrictRgcode: '',
        sdProvinceRgcode: '',
        sdStreetRgcode: '',
        tansportDate: '',
        tenantId: '',
        transportType: '1',
        truckLength: '',
        truckPrice: '',
        truckType: '',
        volume: '',
        waybillId: '',
        weightLoad: 1
      },
      currPrice: '',
      visibleData: false, // 合同列表弹框
      contractList: [], // 获取到的全部合同列表
      redioVal: 0
    }
  },
  watch: {
    costdata: {
      deep: true,
      handler: function (val) {
        var list = []
        var totalPrice = 0
        var model = deepClone(val)
        this.selectTypeValue = model.calculateType
        model.businessIncomes.forEach(function (item) {
          list.push({
            incomeMoney: Number(item.incomeMoney),
            incomeTypeName: item.incomeTypeName,
            subDictId: item.incomeType,
            subDictName: item.incomeTypeName,
            consignmentId: item.consignmentId
          })
          totalPrice += item.incomeMoney
        })
        model.totalMoney = totalPrice
        if (this.selectTypeValue === 1) {
          this.isaAgreementType = true
        } else {
          this.isaAgreementType = false
        }
        this.allCostTypeList = list
        this.standrd.priceUnit = val.priceUnit
        const {
          priceUnit,
          unitPrice,
          contractName,
          totalMoney,
          contractId
        } = model
        // 填入计费方式、单价、合同名称、全部金额、合同id 四个字段
        this.form.setFieldsValue({
          priceUnit,
          unitPrice,
          contractName,
          totalMoney,
          contractId
        })
        // 赋值给standrd 用于合同匹配
        this.standrd.truckLength = val.truckLength
        this.standrd.truckType = val.truckType
        console.log('cost-watch-model', model)
      }
    },
    tenantId: {
      handler: function (val) {
        console.log('watch tenantId', val)
        this.standrd.tenantId = val
      },
      deep: true
    },
    getCargoInfo: {
      deep: true,
      handler: function (val) {
        console.log('costmodal watch', val)
        let cargoList = []
        let tempVal = val.filter(goodInfo => goodInfo.key !== 'sumRow')
        for (let i = 0; i < tempVal.length; i++) {
          let params = {
            cargoId: tempVal[i].consignmentId,
            cargoType: tempVal[i].consignmentType,
            goodsAmount: tempVal[i].orderAmount,
            goodsVolume: tempVal[i].orderTargetVolume,
            goodsWeight: tempVal[i].orderTargetWeight
          }
          cargoList.push(params)
        }
        this.standrd.matchCargoVoList = cargoList
      }
    },
    currentId: {
      handler: function (val) {
        this.standrd.partnerId = val
      }
    },
    projectId: {
      handler: function (val) {
        this.standrd.projectId = val
      }
    },
    getterTruckLength: {
      handler: function (val) {
        console.log('watch>truckLength', val)
        this.standrd.truckLength = val
      }
    },
    getTransportWay: {
      handler: function (val) {
        console.log('watch', val)
        this.standrd.transportType = val
      }
    },
    getTransportDate: {
      handler: function (val) {
        console.log('watch', val)
        this.standrd.tansportDate = val
      }
    },
    getterSendGoodAddress: {
      handler: function (val) {
        this.standrd.sdProvinceRgcode = val[0] || ''
        this.standrd.sdCityRgcode = val[1] || ''
        this.standrd.sdDistrictRgcode = val[2] || ''
        this.standrd.sdStreetRgcode = val[3] || ''
      }
    },
    gettterGetGoodAddress: {
      handler: function (val) {
        this.standrd.rvProvinceRgcode = val[0] || ''
        this.standrd.rvCityRgcode = val[1] || ''
        this.standrd.rvDistrictRgcode = val[2] || ''
        this.standrd.rvStreetRgcode = val[3] || ''
      }
    }
  },
  computed: {
    ...mapGetters(['tenantId']),
    ...mapGetters('waybill', [
      'getCargoInfo',
      'getPartnerId',
      'getTransportWay',
      'getTransportDate',
      'getterSendGoodAddress',
      'gettterGetGoodAddress',
      'getterTruckLength'
    ])
  },
  mounted () {
    this.standrd.waybillId = this.$route.params.id
    // 此处父组件没有传递参数过来 自己取一下
    if (!this.$route.params.id) {
      this.getCostTypeList()
    }
    this.standrd.tenantId = this.$store.state.user.tenantId
    this.standrd.partnerId = this.getPartnerId
    this.standrd.tansportDate = this.getTransportDate
    this.standrd.truckLength = this.getterTruckLength
    // console.log('cost 大', this.$store.state.user.tenantId)
  },
  methods: {
    ...mapActions('waybill', ['setPrice', 'setCargoInfo']),
    handleGetdata () {
      // 获取组件数据
      var tempdata = {}
      this.form.validateFields((err, values) => {
        if (!err) {
          tempdata = values
        }
      })
      tempdata.calculateType = this.selectTypeValue
      var temp = []
      if (this.allCostTypeList) {
        this.allCostTypeList.forEach(function (item, i) {
          temp.push({
            incomeType: item.subDictId,
            incomeMoney: item.incomeMoney ? item.incomeMoney : 0,
            currency: 'CNY'
          })
        })
      }
      tempdata.businessIncomes = temp
      return deepClone(tempdata)
    },
    // 修改计价方式
    changepriceUnit (val) {
      /**
       * 添加计价方式 1件数 2重量 3体积
       */
      this.standrd.priceUnit = val
      // 合同计费1-true/手工计费2-false
      if (!this.isaAgreementType) {
        this.getTotalMoney(val)
      }
      // console.log('changepriceUnit')

      /**
       *  产品变更需求，改变计价方式后，无需改变货物相关数据
       * 暂时停用相关父子组件传值，后期准备弃用，改用vuex
       */
      // this.$emit('changepriceUnit', val)

      // this.form.validateFields((err, values) => {
      //   if (!err) {
      //     // console.log('priceUnit', values.priceUnit)
      //   }
      // })
    },
    /**
     * 计算总费用
     */
    getTotalMoney (param) {
      let tempCargoInfo = this.getCargoInfo.filter(
        goodInfo => goodInfo.key !== 'sumRow'
      )
      let totalMoney = 0 // 总运费
      console.log('515', tempCargoInfo)
      // 新增时候 进来是空的
      if (!tempCargoInfo.length) return
      // hm 优化
      function getTotalMoneys (key) {
        let tick = 0
        for (let item of tempCargoInfo) {
          item[key] && (tick += Number(item[key]))
        }
        return tick * this.currPrice
      }
      let objKey = ''
      switch (Number(param)) {
        case 1:
          // let num = 0
          // for (let i = 0; i < tempCargoInfo.length; i++) {
          //   (tempCargoInfo[i].orderAmount) ? num += tempCargoInfo[i].orderAmount : num += 0
          // }
          // // totalMoney = num * this.currPrice
          objKey = 'orderAmount'
          break
        case 2:
          // let weightNum = 0
          // for (let i = 0; i < tempCargoInfo.length; i++) {
          //   (tempCargoInfo[i].orderTargetWeight) ? weightNum += tempCargoInfo[i].orderTargetWeight : weightNum += 0
          // }
          // totalMoney = weightNum * this.currPrice
          objKey = 'orderTargetWeight'
          break
        case 3:
          // let volumeNum = 0
          // for (let i = 0; i < tempCargoInfo.length; i++) {
          //   (tempCargoInfo[i].orderTargetVolume) ? volumeNum += tempCargoInfo[i].orderTargetVolume : volumeNum += 0
          // }
          // totalMoney = volumeNum * this.currPrice
          objKey = 'orderTargetVolume'
          break
      }
      if (objKey) totalMoney = getTotalMoneys.call(this, objKey)
      /**
       * 通过选择计价方式和单价  实现主动计算合计功能
       */
      // 从后台获取的费用内容为空（allCostTypeList），此处会报错！hm
      if (!this.allCostTypeList.length) {
        throw new Error('费用信息allCostTypeList不能为空数组！')
      }
      this.getSumtotal(totalMoney, this.allCostTypeList[0]['subDictId'])
    },
    // 修改单价信息
    timeLimitcg (value) {
      // console.log(value)
      /**
       * 将单价存起来方便计算
       */
      this.currPrice = value
      this.setPrice(value)
      this.getTotalMoney(this.standrd.priceUnit)
    },
    handleSubmit () { },
    /**
     * @Description: 匹配合同-获取合同列表
     * @param : null
     * @return: null
     */
    getmatchcontractprice () {
      this.loading = true
      // console.log('this.standrd', this.standrd)
      getmatchprice(this.standrd)
        .then(res => {
          if (res.code === 0) {
            this.contractList = res.data
            // 默认radio选中 把第一条数据存储
            this.visibleData = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * @Description: 根据选中的合同行，填入合同名称、合同id、单价-N个、全部金额 四个字段
     * @param : null
     * @return: null
     */
    matchingContract (obj) {
      // 计费方式
      this.form.setFieldsValue({ priceUnit: obj.priceUnit })
      // 合同名称字段
      this.form.setFieldsValue({ contractName: obj.contractName })
      // 合同id字段 hidden
      this.form.setFieldsValue({ contractId: obj.contractId })
      // 单价
      this.form.setFieldsValue({ unitPrice: obj.price })
      // 全部金额
      this.form.setFieldsValue({ totalMoney: obj.sumCharge })
      // 循环获取金额填入渲染对象中(allCostTypeList)
      let tempList = obj.matchCargoResultVoList
      // 循环allCostTypeList 拿新获取的金额 赋值到allCostTypeList中
      let newAllCostTypeList = []
      for (let item of this.allCostTypeList) {
        for (let temp of tempList) {
          // id匹配了
          if (item.subDictId === temp.chargeType) {
            // 修改内容
            item.incomeMoney = temp.totalPrice
            break
          }
        }
        newAllCostTypeList.push(item)
      }
      // 改变原来的内容
      this.allCostTypeList = newAllCostTypeList
    },
    // 计算费用合计 id匹配上了 用新传入的金额，把数组全部金额加一起返回
    getSumtotal (value, subDictId) {
      if (this.allCostTypeList && this.allCostTypeList.length) {
        var total = 0
        this.allCostTypeList.forEach(function (item) {
          if (item.subDictId === subDictId && value > 0) {
            item.incomeMoney = value
          }
          if (item.incomeMoney) {
            total += parseFloat(item.incomeMoney)
          }
        })
        this.form.setFieldsValue({ totalMoney: total })
      }
    },
    // 循环获取金额输入框，修改内容的时候 从新计算总金额
    handleChange (value, subDictId) {
      const target = this.allCostTypeList.filter(
        item => subDictId === item.subDictId
      )[0]
      if (target) {
        value = this.chknum(value)
      }
      this.getSumtotal(value, subDictId)
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
    getCostTypeList () {
      getSubCostTypeListByDataStatus('1,2').then(res => {
        this.allCostTypeList = res.data || []
      })
    },
    radioChange () {
      // this.form.resetFields()
      // this.allCostTypeList.forEach(function (item) {
      //   if (item.incomeMoney) {
      //     item.incomeMoney = ''
      //   }
      // })
      // console.log('radioChange>this.allCostTypeList', this.allCostTypeList)
      // 判断是按照 合同计费1/手工计费2
      if (this.selectTypeValue === 1) {
        this.isaAgreementType = true
      } else {
        this.isaAgreementType = false
      }
    },
    /**
     * @Description: 弹框确定-合同模板确定
     * @param : null
     * @return: null
     */
    contractSubmit () {
      // 根据redioVal判断选中的是第几行数据 确定行数据对象
      let obj = this.contractList[this.redioVal]
      // 获取当合同前行数据，数据处理
      this.matchingContract(obj)
      this.visibleData = false
    },
    /**
     * @Description: radio选中事件
     * @param : null
     * @return: null
     */
    onChange (e) {
      // console.log(e)
    }
  }
}
</script>

<style lang="less" scope>
#components-layout {
  position: relative;
  .has-btn {
    width: calc(100% - 88px);
    .ant-select-selection {
      border-radius: 5px 0 0 5px;
    }
  }
  .pipei_btn {
    position: absolute;
    right: 0;
    top: 0;
  }
}
// .ant-modal-body {
//   padding: 20px 0 0 0;
// }
.ant-modal-footer {
  border: none;
}
.ant-card-contain-grid:not(.ant-card-loading) .ant-card-body {
  margin: -1px 0 -1px -1px;
}
.contract {
  .ant-radio-group {
    width: 100%;
  }
  .item {
    height: 110px;
    overflow: hidden;
    border-top: 1px solid #e8e8e8;
    .check-box {
      width: 66px;
      height: 100%;
      padding-top: 44px;
      text-align: center;
      text-align: center;
      float: left;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
    .ant-card {
      float: left;
      width: calc(100% - 66px);
      .ant-card-item {
        overflow: hidden;
      }
    }
    .table {
      width: 100%;background: #fafafa;margin-left: 1px;
      td {
        vertical-align: middle;height: 54px;border: solid #e8e8e8;border-width: 0 1px 1px 0;
      }
    }
    .ant-card-bordered {
      border-left: none;
      // border-top: 1px solid #e8e8e8;
      // border-bottom: 1px solid #e8e8e8;
      .ant-card-grid {
        height: 54px;
        line-height: 54px;
        padding: 0 0 0 20px;
      }
      .ant-card-box {
        box-shadow: 0 0 0 0 #e8e8e8, 0 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8,
          0 0 0 0 #e8e8e8 inset, 0 0 0 0 #e8e8e8 inset;
        -webkit-box-shadow: 0 0 0 0 #e8e8e8, 0 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8,
          0 0 0 0 #e8e8e8 inset, 0 0 0 0 #e8e8e8 inset;
      }
      .ant-card-item {
        background: #fafafa;
      }
      // .ant-card-body {
      //   margin: -1px 0 0 0px;
      // }
    }
  }
}
</style>
