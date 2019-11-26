// 1线路数据
<template>
  <div class="add-line-price-form-layout form-layout-body">
    <a-modal
      class="add-line-price-modal"
      title="添加线路及费用"
      :visible="visible"
      :maskClosable="false"
      width="90%"
      @ok="handleadd"
      @cancel="handleaddCancel"
    >
      <a-form :form="form" layout="inline" class="add-line-price-form">
        <div class="contract-route-item">
        <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['contractId', { initialValue: contractTerm.contractId }]"/></a-form-item>
        <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['termId', { initialValue: contractTerm.termId }]"/></a-form-item>
        <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['routeId', { initialValue: contractTerm.routeId }]"/></a-form-item>
        <a-row>
          <a-col :md="6" :sm="12" >
            <a-form-item label="发货区域">
              <a-cascader
                changeOnSelect
                :options="inheritedRegionsMap"
                expandTrigger="hover"
                placeholder="请选择发货区域"
                v-decorator="['sendRegion', {rules: [{required: true, message: '请选择发货区域'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12" >
            <a-form-item label="收货区域">
              <a-cascader
                changeOnSelect
                :options="inheritedRegionsMap"
                expandTrigger="hover"
                placeholder="请选择收货区域"
                v-decorator="['receiveRegion', {rules: [{required: true, message: '请选择收货区域'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12" >
            <a-form-item label="时效">
              <a-input-number :min="1"
                 v-decorator="['timeLimit']"
                placeholder="请输入时效" maxLength="9"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12" v-if="!isShowTruckCostForm">
            <a-form-item label="最低收费">
              <a-input-number :min="1"
                v-decorator="['initPrice']"
                placeholder="请输入最低收费" maxLength="9"/>
            </a-form-item>
          </a-col>
        </a-row>
        </div>
        <div class="truck-list-layout" v-if="isShowTruckCostForm">
          <truck-cost-form
            :ref="`truckCostForm${key}`"
            v-for="(item, key) in truckCostList"
            :key="key"
            :info="item"
            :isShowAdd="key === truckCostList.length - 1"
            @addNew="addNewTruckCost"
            @delete="deleteTruckCost(item)"
          />
        </div>
        <contract-filter-form
          :ref="`filterForm${key}`"
          v-for="(item, key) in contractFilterList"
          :key="key"
          :info="item"
          @delete="deleteLine(item)"
        />
      </a-form>

      <a-button :loading="loading" style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newLine">添加费用明细</a-button>

    </a-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { saveContractRoute, getContractRouteDetail } from '@/api/resource/price'
import librariesBase from '@views/mixins/libraries_base'
import { strToArrayInt } from '@/utils/util'
import ContractFilterForm from './ContractFilterForm'
import TruckCostForm from '../../price/components/TruckCostForm'
import { globalMap } from '@/api/global'

export default {
  name: 'AddLineAndPriceForm',
  mixins: [librariesBase],
  components: {
    ContractFilterForm,
    TruckCostForm
  },
  props: {
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    inheritedRegionsMap: {
      type: Array,
      default () {
        return []
      }
    },
    // contractTerm: {
    //   type: Object,
    //   default () {
    //     return {}
    //   }
    // },
    routeId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      visible: this.isShow,
      form: this.$form.createForm(this),
      isSubmit: false,
      isShowMap: false,
      allData: null,
      truckCostList: [],
      contractFilterList: [],

      key: 0,
      truckkey: 0
    }
  },
  created () {
    console.log('created...')
    this.initAllMap()
    this.$nextTick(() => {
      this.truckCostList = this.info.truckCostList || []
      this.contractFilterList = this.info.contractFilterList || []
    })
  },
  mounted () {
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        console.log('info change...')
        this.$nextTick(() => {
          const info = [...val]
          info.sendRegion && (info.sendRegion = strToArrayInt(info.sendRegion))
          info.receiveRegion && (info.receiveRegion = strToArrayInt(info.receiveRegion))

          this.allData = info
          this.form.setFieldsValue(val)
        })
      }
    },
    isShow (val) {
      console.log('isShow....', this.routeId)
      this.truckCostList = []
      this.contractFilterList = []
      this.visible = val
      if (val) {
        this.form.resetFields()
        if (this.routeId) {
          console.log('this.routeId', this.routeId)
          this.getContractRouteDetailInfo()
        } else {
          this.allData = {}
          console.log('........')
        }
      }
    },
    allData: {
      deep: true,
      handler: function (val) {
        console.log('allData........', val)
        this.truckCostList = val.truckCostList || []
        this.contractFilterList = val.contractFilterSaveVoList || []

        if (this.isShowTruckCostForm && !this.truckCostList.length) {
          this.addNewTruckCost()
        }
      }
    }
  },
  computed: {
    ...mapGetters('price', [
      'contractTerm'
    ]),
    isShowTruckCostForm () {
      // 2: 整车
      return this.contractTerm.transportType === globalMap.transportType_zc
    },
    costTypeMapUsed () {
      return this.costTypeMap && this.isShowTruckCostForm ? this.costTypeMap.filter(costType => costType.dictId !==
        1 /* 排除运费 */) : this.costTypeMap
    }
  },
  methods: {
    ...mapActions('price', ['initAllMap']),
    // 新增浮层确认事件
    handleadd (e) {
      if (this.isSubmit) return
      e.preventDefault()

      let subData = {}
      let isRight = true

      // 组装contractRoute
      this.form.validateFields((err, values) => {
        console.log(err, values)
        if (!err) {
          const data = Object.assign({}, values)
          data.sendRegion && (data.sendRegion = data.sendRegion.join(','))
          data.receiveRegion && (data.receiveRegion = data.receiveRegion.join(','))
          subData.contractRoute = data
        } else {
          isRight = false
        }
      })
      // 组装contractFilterSaveVoList
      for (let i = 0; i < this.contractFilterList.length; i++) {
        const refForm = this.$refs[`filterForm${i}`]
        if (!refForm) continue
        const filterList = refForm[0].getAllData()
        if (filterList === false) {
          isRight = false
        } else {
          if (!subData.contractFilterSaveVoList) subData.contractFilterSaveVoList = []
          subData.contractFilterSaveVoList.push(filterList)
        }
      }
      // 组装truckCostList
      for (let i = 0; i < this.truckCostList.length; i++) {
        const refForm = this.$refs[`truckCostForm${i}`]
        if (!refForm) continue
        const filterList = refForm[0].getAllData()
        if (filterList === false) {
          isRight = false
        } else {
          if (!subData.truckCostList) subData.truckCostList = []
          subData.truckCostList.push(filterList)
        }
      }

      // 校验数据正确性
      const isCorrect = this.checkData(subData)
      if (!isCorrect) return

      console.log('subdata===', subData)
      if (isRight) {
        this.save(subData)
      }
    },
    // 数据校验
    checkData (data) {
      // 合同价格文件规则：
      // 线路 货物类型+收货方名称+费用类型校验唯一不可重复
      // 区间校验不可重叠
      const { contractFilterSaveVoList = [], truckCostList = [] } = data || {}

      let errs = {}
      // 线路 货物类型+收货方名称+费用类型校验唯一不可重复
      const filterMap = {}
      for (let i = 0; i < contractFilterSaveVoList.length; i++) {
        const val = contractFilterSaveVoList[i]
        const contractFilter = val.contractFilter
        const key = `${contractFilter.cargoType}${contractFilter.siteId}${contractFilter.priceType}`
        if (filterMap[key]) {
          errs.filterErr = '线路添加重复'
          break
        } else {
          filterMap[key] = key
        }
        // 区间校验不可重叠
        const priceList = val.contractPriceList
        this.checkPriceRepeat(priceList, errs)
      }

      // 整车
      // 当前线路 车长+载重+车辆类型校验唯一不可重复
      // 当前线路 货物类型校验唯一不可重复
      this.checkPriceRepeat(truckCostList, errs)

      console.log('errs.....', errs)

      if (Object.keys(errs).length) {
        for (let err in errs) {
          this.$message.error(errs[err])
        }
      }

      return !Object.keys(errs).length
    },
    // 区间校验不可重叠
    checkPriceRepeat (priceList, errs) {
      if (priceList.length > 1) {
        let { upperLimit, lowerLimit } = priceList[0]
        upperLimit = Number(upperLimit)
        lowerLimit = Number(lowerLimit)

        if (lowerLimit < 0) {
          errs.priceUpperNullErr = '请输入上限'
        }
        // 上限小于下限
        if (lowerLimit > upperLimit) {
          errs.priceErr = `区间错误${lowerLimit} ${upperLimit}`
        }
        for (let j = 1; j < priceList.length; j++) {
          const price = priceList[j]
          price.upperLimit = Number(price.upperLimit)
          price.lowerLimit = Number(price.lowerLimit)

          if (price.lowerLimit < 0) {
            errs.priceUpperNullErr = '请输入上限'
          }
          // 上限小于下限
          if (price.upperLimit < price.lowerLimit) {
            errs.priceErr = `区间错误:${price.lowerLimit} ${price.upperLimit}`
          }
          // 区间重复
          if (price.lowerLimit < upperLimit) {
            errs.priceRepeatErr = `区间重复${price.lowerLimit} ${upperLimit}`
          }
          upperLimit = price.upperLimit
          lowerLimit = price.lowerLimit
        }
      }
    },
    save (data) {
      this.isSubmit = true
      saveContractRoute(data).then(res => {
        if (res.code === 0) {
          this.$message.success('保存成功')
          this.$emit('handlerefresh')
          this.handleaddCancel(true)
        } else {
          this.$message.success('保存失败')
        }
      }).finally(() => {
        this.isSubmit = false
      })
    },
    // 根据Id获取详情
    getContractRouteDetailInfo () {
      const { routeId } = this
      getContractRouteDetail({ routeId }).then((res) => {
        this.$nextTick(() => {
          const allData = Object.assign({}, res.data)
          const { contractRoute } = allData
          const { sendRegion, receiveRegion } = contractRoute
          sendRegion && (contractRoute.sendRegion = strToArrayInt(sendRegion))
          receiveRegion && (contractRoute.receiveRegion = strToArrayInt(receiveRegion))
          this.allData = allData
          console.log('contractRoute', contractRoute)

          this.form.setFieldsValue(contractRoute)
        })
      })
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', isRefresh)
    },
    // 新增费用明细
    newLine () {
      const contractFilter = {
        contractFilter: {
          filterId: this.key--,
          cargoType: undefined,
          priceType: undefined,
          priceUnit: undefined,
          siteId: undefined
        },
        contractPriceList: [{
          priceId: 0,
          upperLimit: undefined,
          lowerLimit: undefined,
          intervalType: undefined,
          price: undefined
        }]
      }
      this.contractFilterList.push(contractFilter)
      console.log('111', this.contractFilterList)
    },
    // 删除价格区间
    deleteLine (item) {
      const { contractFilter: { filterId } } = item
      const list = this.contractFilterList.filter(val => {
        const { contractFilter } = val
        return (contractFilter.filterId !== filterId)
      })
      this.contractFilterList = [...list]
    },
    // 添加整车价格
    addNewTruckCost () {
      const truckCost = {
        filterId: this.truckkey--,
        truckLength: undefined,
        truckType: undefined,
        priceType: undefined,
        weightLoad: undefined,
        price: undefined
      }
      this.truckCostList.push(truckCost)
    },
    // 删除整车价格
    deleteTruckCost ({ filterId }) {
      const list = this.truckCostList.filter(val => val.filterId !== filterId)
      this.truckCostList = list
    },
    handleRegionChange () {

    }
  }
}
</script>
<style lang="less">
  .add-line-price-modal {
    .ant-modal-body {
      padding: 0px 24px;
    }
  }
  .truck-list-layout {
    margin-bottom: 10px;
  }
  .add-line-price-form {
    height: 100%;
    overflow: hidden;
    .contract-route-item {
      padding-bottom: 10px;
    }
    .price-type-item {
      background: #FAFAFA;
      border: 1px solid #E8E8E8;
      .ant-row {
        padding: 0 18px;
      }
    }
    .price-item {
      background: #fff;
      border-top: 1px solid #E8E8E8;
    }
    // .options-col {
    //   .option-col{
    //     height: 102px;
    //     line-height: 102px;
    //     margin-right: 5px;
    //   }
    // }
  }

  .hide-form-item {
    margin: 0;
    height: 0;
    display: block !important;
  }
</style>
