<template>
  <a-card title="费用信息"
          :bordered="false">

    <a-form @submit="handleSubmit"
            :form="form"
            class="form">
      <a-row class="form-row"
             :gutter="60">
        <a-col :sm="6">
          <a-form-item label="计价方式">
            <div id='components-layout'
                 style="width: 100%">
              <a-layout style="width: 100%">
                <a-layout-content>
                  <a-select placeholder="请选择计价方式"
                            style="width: 100%"
                            v-decorator="['priceUnit']"
                            @change="changepriceUnit">
                    <a-select-option v-for="priceUnititem in priceUnitList"
                                      :value="priceUnititem.dictId"
                                      :key="priceUnititem.dictId"
                                     style="border-radius: 5px 0 0 5px;">{{priceUnititem.dictName}}</a-select-option>
                  </a-select>
                </a-layout-content>
                <a-layout-sider width="63">
                  <a-button type="primary"
                            style="border-radius: 0 5px 5px 0;"
                            @click="getmatchcontractprice">匹配</a-button>
                </a-layout-sider>
              </a-layout>
            </div>
          </a-form-item>
        </a-col>
        <a-col>
          <span>合同名称：</span><span>{{backContractName}}</span>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="单价">
            <a-input-number v-decorator="['unitPrice']"
                            :max='max'
                            :min='min'
                            placeholder="请输入单价"
                            @change="timeLimitcg"
                            :formatter='chknum'
                            style="width: 100%"
                            :parser='chknum' />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row"
             :gutter="60">
        <a-form-item>
          <a-table :columns="columns"
                   :dataSource="businessIncomes"
                   :pagination="false"
                   bordered>
            <template v-for="col in editColumns"
                      :slot="col"
                      slot-scope="text, record">
              <a-input-number :key="col"
                              v-if="col === 'incomeMoney'"
                              :value="record.incomeMoney"
                              style="width: 100%"
                              :placeholder="record.incomeTypeName+'金额'"
                              v-decorator="[ `${col}${record.incomeType}`]"
                              @change="e => handleChange(e, record.incomeType, col)" />
            </template>
          </a-table>
        </a-form-item>
      </a-row>
      <a-row class="form-row"
             :gutter="60">
        <a-col :sm="6">
          <a-form-item label="月结">
            <a-input-number v-decorator="['settlementMonth']"
                            :max='max'
                            :min='min'
                            placeholder="请输入月结金额"
                            :formatter='chknum'
                            style="width: 100%"
                            :parser='chknum' />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="现付">
            <a-input-number v-decorator="['settlementCurrent']"
                            :max='max'
                            :min='min'
                            placeholder="请输入现付金额"
                            style="width: 100%"
                            :formatter='chknum'
                            :parser='chknum' />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="到付">
            <a-input-number v-decorator="['settlementArrival']"
                            :max='max'
                            :min='min'
                            placeholder="请输入到付金额"
                            style="width: 100%"
                            :formatter='chknum'
                            :parser='chknum' />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
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

export default {
  name: 'CostModal',

  props: {
    costdata: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
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
      businessIncomes: [], // 费用类型列表
      editColumns: ['incomeMoney'],
      max: 999999.99,
      min: 0,
      form: this.$form.createForm(this),
      visible: false,
      backContractName: '',
      columns: [
        {
          title: '费用名称',
          dataIndex: 'incomeTypeName',
          scopedSlots: { customRender: 'incomeTypeName' }
        },
        {
          title: '费用金额',
          dataIndex: 'incomeMoney',
          scopedSlots: { customRender: 'incomeMoney' }
        }
      ],
      model: {
        businessIncomes: []
      },
      standrd: {
        'amount': 0,
        'cargoType': 1,
        'computeType': 0,
        'matchCargoVoList': [
          // {
          //   'cargoId': '',
          //   'cargoType': '',
          //   'goodsAmount': '',
          //   'goodsVolume': '',
          //   'goodsWeight': ''
          // }
        ],
        'partnerId': '',
        'priceUnit': '0',
        'rvCityRgcode': '',
        'rvDistrictRgcode': '',
        'rvProvinceRgcode': '',
        'rvStreetRgcode': '',
        'sdCityRgcode': '',
        'sdDistrictRgcode': '',
        'sdProvinceRgcode': '',
        'sdStreetRgcode': '',
        'tansportDate': '',
        'tenantId': '',
        'transportType': '1',
        'truckLength': '',
        'truckPrice': '',
        'truckType': '',
        'volume': '',
        'waybillId': '',
        'weightLoad': 1
      },
      currPrice: ''
    }
  },
  watch: {
    costdata: {
      deep: true,
      handler: function (val) {
        this.model = deepClone(val)
        console.log('cost-watch-model', this.model)
        console.log('cost-watch-model.priceUnit', this.model.priceUnit)
        // this.form.setFieldsValue(this.model)
        /**
         * 不需要做那么多设置，只需要设置到付 月付 现结
         */
        let { settlementArrival, settlementCurrent, settlementMonth } = this.model
        // console.log(11)
        // console.log(settlementArrival)
        // console.log(22)
        this.form.setFieldsValue({ settlementArrival: settlementArrival })
        this.form.setFieldsValue({ settlementCurrent: settlementCurrent })
        this.form.setFieldsValue({ settlementMonth: settlementMonth })

        if (this.model && this.model.businessIncomes && this.model.businessIncomes.length > 0) {
          this.businessIncomes = deepClone(this.model.businessIncomes)
          console.log('aa', this.businessIncomes)
          if (this.businessIncomes.filter(item => item.incomeType === 0).length <= 0) {
            this.businessIncomes.push({
              'incomeTypeName': '合计',
              'incomeType': 0,
              'incomeMoney': 0,
              'incomeId': null
            })
          }
        }
        var tempdata = this.businessIncomes
        if (this.model && this.model.businessIncomes && this.model.businessIncomes.length > 0) {
          this.model.businessIncomes.forEach(function (item) {
            var target = tempdata.filter(item2 => item2.incomeType === item.incomeType)[0]
            target.incomeAmount = item.incomeAmount
          })
          this.getSumtotal()
        }
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
      handler: function (val) {
        console.log('costmodal watch', val)
        let cargoList = []
        for (let i = 0; i < val.length; i++) {
          let params = {
            'cargoId': val[i].consignmentId,
            'cargoType': val[i].consignmentType,
            'goodsAmount': val[i].orderAmount,
            'goodsVolume': val[i].orderTargetVolume,
            'goodsWeight': val[i].orderTargetWeight
          }
          cargoList.push(params)
        }
        this.standrd.matchCargoVoList = cargoList
      }
    },
    getPartnerId: {
      handler: function (val) {
        this.standrd.partnerId = val
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
    ...mapGetters('waybill', ['getCargoInfo', 'getPartnerId', 'getTransportWay', 'getTransportDate', 'getterSendGoodAddress',
      'gettterGetGoodAddress'])
  },

  mounted () {
    this.standrd.waybillId = this.$route.params.id
    this.getIncomeTypeList()

    this.standrd.tenantId = this.$store.state.user.tenantId
    this.standrd.partnerId = this.getPartnerId
    this.standrd.tansportDate = this.getTransportDate
    // console.log('cost 大', this.$store.state.user.tenantId)
  },
  methods: {
    ...mapActions('waybill', [
      'setPrice',
      'setCargoInfo'

    ]),
    handleGetdata () { // 获取组件数据
      // console.log('businessIncomes', this.businessIncomes)
      var tempdata = {}
      this.form.validateFields((err, values) => {
        if (!err) {
          tempdata = values
        }
      })
      if (this.businessIncomes) { tempdata.businessIncomes = deepClone(this.businessIncomes) }
      return deepClone(tempdata)
    },
    // 修改计价方式
    changepriceUnit (val) {
      console.log(val)
      /**
       * 添加计价方式 1件数 2重量 3体积
       */
      this.standrd.priceUnit = val
      this.getTotalMoney(val)

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
    // 获取计价方式
    // getPriceUnitList () {
    //   // getPriceUnit().then(res => {
    //   //   this.priceUnitList = res.data
    //   // })

    //   this.priceUnitList =
    // },
    /**
     * 计算总费用
     *
     */
    getTotalMoney (param) {
      let tempCargoInfo = this.getCargoInfo
      let totalMoney = 0 // 总运费
      console.log(tempCargoInfo)

      switch (Number(param)) {
        case 1:
          let num = 0
          for (let i = 0; i < tempCargoInfo.length; i++) {
            (tempCargoInfo[i].orderAmount) ? num += tempCargoInfo[i].orderAmount : num += 0
          }
          totalMoney = Math.round(num * this.currPrice)
          break
        case 2:
          let weightNum = 0
          for (let i = 0; i < tempCargoInfo.length; i++) {
            (tempCargoInfo[i].orderTargetWeight) ? weightNum += tempCargoInfo[i].orderTargetWeight : weightNum += 0
          }
          totalMoney = Math.round(weightNum * this.currPrice)
          break
        case 3:
          let volumeNum = 0
          for (let i = 0; i < tempCargoInfo.length; i++) {
            (tempCargoInfo[i].orderTargetVolume) ? volumeNum += tempCargoInfo[i].orderTargetVolume : volumeNum += 0
          }
          totalMoney = Math.round(volumeNum * this.currPrice)
          break
      }
      // console.log(this.businessIncomes)
      this.businessIncomes[0].incomeMoney = totalMoney

      /**
       * 通过选择计价方式和单价  实现主动计算合计功能
       */
      let tempTotal = 0
      for (let i = 0; i < this.businessIncomes.length - 1; i++) {
        tempTotal += Number(this.businessIncomes[i].incomeMoney)
      }
      this.businessIncomes[5].incomeMoney = tempTotal
    },
    // 费用类型
    getIncomeTypeList () {
      // getCostTypeByDataStatus().then(res => {
      this.businessIncomes = [
        {
          'incomeType': 1,
          'incomeTypeName': '运费',
          'incomeMoney': 0,
          'incomeId': null
        },
        {
          'incomeType': 2,
          'incomeTypeName': '提货费',
          'incomeMoney': 0,
          'incomeId': null
        },
        {
          'incomeType': 3,
          'incomeTypeName': '送货费',
          'incomeMoney': 0,
          'incomeId': null
        },
        {
          'incomeType': 4,
          'incomeTypeName': '卸货费',
          'incomeMoney': 0,
          'incomeId': null
        },
        {
          'incomeType': 9,
          'incomeTypeName': '附加费',
          'incomeMoney': 0,
          'incomeId': null
        }, {
          'incomeTypeName': '合计',
          'incomeType': 0,
          'incomeMoney': 0,
          'incomeId': null
        }]
    },
    // 修改单价信息
    timeLimitcg (value) {
      console.log(value)
      /**
       * 将单价存起来方便计算
       */
      this.currPrice = value
      this.setPrice(value)
      this.getTotalMoney(this.standrd.priceUnit)
    },
    handleSubmit () {

    },
    /**
     * 匹配价格
     * by jacklin
     */
    getmatchcontractprice () {
      console.log(this.businessIncomes)
      getmatchprice(this.standrd).then(res => {
        console.log(res)
        if (res.code === 0) {
          // this.$message.success('匹配成功,合同名称:', res.data.contractName, 3)
          /**
           * @param 合同名称 res.data.contractName
           */
          this.backContractName = res.data.contractName
          let tempList = res.data.matchCargoResultVoList
          let allMoney = 0
          for (let j = 0; j < tempList.length; j++) {
            for (let m = 0; m < this.businessIncomes.length; m++) {
              if (this.businessIncomes[m].incomeType === tempList[j].chargeType) {
                this.businessIncomes[m].incomeMoney = tempList[j].totalPrice
              }
            }
            allMoney += Number(tempList[j].totalPrice)
          // this.businessIncomes[0].incomeMoney = totalPrice
          }
          this.businessIncomes[5].incomeMoney = allMoney
        }
      })
    },

    // 计算合计
    getSumtotal () {
      // console.log('getSumtotal', this.model.businessIncomes)
      // console.log('length', this.model.businessIncomes.length)
      if (this.businessIncomes && this.businessIncomes.length > 0) {
        console.log(this.businessIncomes)
        var rows = this.businessIncomes.filter(item => item.incomeType !== 0)
        var total = 0
        if (rows) {
          rows.forEach(function (item) {
            if (!item.incomeMoney) {
              item.incomeMoney = 0
            }
            total += parseFloat(item.incomeMoney)
          })
          var target = this.businessIncomes.filter(item => item.incomeType === 0)[0]
          target.incomeMoney = total
        }
      }
    },
    handleChange (value, incomeType, col) {
      // console.log('value', value)
      // console.log('incomeType', incomeType)
      // console.log('col', col)
      const target = this.businessIncomes.filter(item => incomeType === item.incomeType)[0]
      if (target) {
        value = this.chknum(value)
        target[col] = value
        // console.log('column', key, value)
        // this.calculationSub()
      }
      if (incomeType !== 0) { this.getSumtotal() }
      // console.log('businessIncomes', this.businessIncomes)
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

<style lang="less">
#components-layout .ant-layout-sider {
  background: #fff;
  // width: 60px;
}
#components-layout .ant-layout-content {
  background: #fff;
}
#components-layout .ant-select-selection {
  border-radius: 5px 0 0 5px;
}
</style>
