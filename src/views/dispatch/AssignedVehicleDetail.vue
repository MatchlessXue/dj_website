<template>
  <a-spin class="page-container new_antd new_antd_detail" :spinning="pageLoading" :delay="100">
    <back-btn title="返回上一级" v-if="!isIframe"/>
    <a-form :form="form" layout="inline" v-if="currentDispatch">
      <a-card title="基础信息" class="smallCard" :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose1=!feeClose1" ><a-icon type="down"  :class="{closeJt:feeClose1}" /></a>
        <div :class="{close: feeClose1}">
          <a-row :gutter="{md:10}">
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="调度单号:">{{currentDispatch.dispatchCode}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="状态:">{{getDispatchStatusDesc(currentDispatch.bizStatus)}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="运输方式:">{{showTransportType()}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="提货时间:">{{currentDispatch.pickupTime}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24" ><a-form-item label="送达时间:">{{currentDispatch.arrivalTime}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24" ><a-form-item label="承运商单号:">{{currentDispatch.carrierNumber}}</a-form-item></a-col>
            <a-col :xl="12" :lg="12" :md="24" ><a-form-item label="备注:">{{currentDispatch.remark}}</a-form-item></a-col>
          </a-row>
        </div>
      </a-card>

      <a-card :title="isCarrier ? '承运商信息' : '车辆信息'"  class="mt10 smallCard" :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose2=!feeClose2" ><a-icon type="down"  :class="{closeJt:feeClose2}" /></a>
        <div :class="{close: feeClose2}">
          <a-row :gutter="{md:10}">
            <a-col :xl="6" :lg="12" :md="24">
              <a-form-item label="车牌号:" v-if="!isCarrier">{{currentDispatch.plateNumber}}</a-form-item>
              <a-form-item label="承运商名称:" v-if="isCarrier">{{currentDispatch.carrierName}}</a-form-item>
            </a-col>
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="司机姓名:">{{currentDispatch.driverName}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="司机手机号:">{{currentDispatch.mobile}}</a-form-item></a-col>
          </a-row>
          <a-row :gutter="{md:10}">
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="车长（m）:">{{showTruckLength()}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24" ><a-form-item label="车辆类型:">{{showTruckType()}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24" ><a-form-item label="载重（kg）:">{{currentDispatch.weightLoad}}</a-form-item></a-col>
          </a-row>
        </div>
      </a-card>

      <a-card title="费用信息" class="mt10 smallCard"  :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose3=!feeClose3" ><a-icon type="down"  :class="{closeJt:feeClose3}" /></a>
        <div :class="{close: feeClose3}">
          <a-row :gutter="{md:10}">
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="均摊方式:">{{showCurrentType()}}</a-form-item></a-col>
          </a-row>
          <a-row :gutter="{md:10}" v-if="currentDispatch.feeList">
            <a-col :xl="6" :lg="12" :md="24"  v-for="(aVal) in currentDispatch.feeList" :key="aVal.outgoType">
              <a-form-item :label="`${aVal.outgoTypeName}（元）:`">{{aVal.outgoMoney}}</a-form-item>
            </a-col>
            <a-col :xl="6" :lg="12" :md="24" ><a-form-item label="合计:">{{currentDispatch.ksSum}}</a-form-item></a-col>
          </a-row>
        </div>
      </a-card>

      <a-card title="结算信息" class="mt10 smallCard" :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose4=!feeClose4" ><a-icon type="down"  :class="{closeJt:feeClose4}" /></a>
        <div :class="{close: feeClose4}">
          <a-row :gutter="{md:10}">
            <a-col :xl="6" :lg="12" :md="24"><a-form-item label="现付金额:">{{currentDispatch.ksSettleXfMoney}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24" ><a-form-item label="到付金额:">{{currentDispatch.ksSettleDfMoney}}</a-form-item></a-col>
            <a-col :xl="6" :lg="12" :md="24" ><a-form-item label="月结金额:">{{currentDispatch.ksSettleMonthMoney}}</a-form-item></a-col>
          </a-row>
        </div>
      </a-card>

      <a-card title="运单信息" class="mt10 smallCard noPadding" :bodyStyle="bodyStyle" >
        <a href="javascript:" slot="extra" @click="feeClose=!feeClose" ><a-icon type="down"  :class="{closeJt:feeClose}" /></a>
        <div :class="{avOrderBox:true, close:feeClose}">
          <div class="avOrderList" v-for="(order, orderIndex) in selectedRows" :key="orderIndex">
            <div class="avOrderListR">
              <div class="avOrderListTitle">
                <ul class="flex_item">
                  <li>运单号：<a href="javascript:;" @click="goDetail(order.waybillId)">{{order.waybillCode}}</a></li>
                  <li v-if="order.contractName && isAgreement">合同名称：{{order.contractName}}</li>
                  <li>项目：{{order.projectName}}</li>
                  <li>件数：{{order.amount}}</li>
                  <li>重量(kg)：{{order.weight}}</li>
                  <li>体积(m³)：{{order.volume}}</li>
                  <li v-if="isAgreement">单价：{{order.price}}</li>
                  <li>发货方地址：{{order.departAddress}}</li>
                  <li>收货方地址：{{getSiteName(order)}}</li>
                </ul>
              </div>
              <div class="avOrderListBody">
                <a-row :gutter="10">
                  <strong style="float: left;">费用信息：</strong>
                  <div class="valueList">
                    <template v-if="order.feeList && order.feeList.length">
                      <a-col :xxl="4" :xl="4" :md="8" v-for="aVal in order.feeList" :key="aVal.outgoType">
                          <span class="flex">
                            <label>{{aVal.outgoTypeName}}：</label>{{aVal.outgoMoney}}
                          </span>
                      </a-col>
                    </template>
                    <a-col :xxl="4" :xl="4" :md="8"><strong class="flex"><label>合计：</label>{{order.ksSum}}</strong></a-col>
                  </div>
                </a-row>
                <a-row :gutter="10" class="">
                  <strong style="float: left;">结算信息：</strong>
                  <div class="valueList">
                    <a-col :xxl="4" :xl="4" :md="8">
                    <span class="flex">
                      <label>现付：</label>{{order.ksSettleXfMoney}}
                    </span>
                    </a-col>
                    <a-col :xxl="4" :xl="4" :md="8">
                    <span class="flex">
                      <label>到付：</label>{{order.ksSettleDfMoney}}
                    </span>
                    </a-col>
                    <a-col :xxl="4" :xl="4" :md="8">
                    <span class="flex">
                      <label>月结：</label>{{order.ksSettleMonthMoney}}
                    </span>
                    </a-col>
                  </div>
                </a-row>
              </div>
            </div>
          </div>

        </div>

        <div class="bottomTotalInfo">
          <a-row :gutter="10">
            <a-col :md="12" :sm="24">合计：￥{{sumMoney}}</a-col>
            <a-col :md="12" :sm="24" style="text-align: right">
              总件数：<strong>{{totalAmount}}</strong> 总重量：<strong>{{totalWeight}}kg</strong> 总体积：<strong>{{totalVolume}}m³</strong>
            </a-col>
          </a-row>
        </div>

      </a-card>

    </a-form>
    <print-dialog ref="PrintDialogRef" :store="$store" title="调度单打印" @success="printLoading=false" :printmenuId="2"></print-dialog>
    <footer-tool-bar align="center" v-if="!isIframe">
      <a-button @click="cancelSubmit">返回</a-button> &nbsp;&nbsp;
      &nbsp;&nbsp;<a-button type="primary" v-if="dispatchId" @click="printDialogShow">打印</a-button>
    </footer-tool-bar>
  </a-spin>
</template>

<script>
import { validatePhoneNumber, validMaxNumber, validatePhoneNumberNoRequired, validMaxNumberSix } from '@/utils/validate'
import FooterToolBar from '@/components/FooterToolbar'
import BackBtn from '@/components/BackBtn'
import moment from 'moment'
// import SelectAutoComplete from './components/SelectAutoComplete'
import { queryAllTruckDrivers } from '@/api/resource/truck'
import { getTruckLongs, getTruckTypeByDataStatus, getSubDictionaryById } from '@/api/libraries'
import { queryDrivers } from '@/api/resource/driver'
import wmath from '@utils/wmath'
import { createDispatchWaybill, getdetails, getAllDispatchStatus } from '@/api/dispatch/dispatch'
import { selectAll } from '@/api/resource/siteAddress'
import dictionaryBase from '@/views/dispatch/DispatchList/mixins/dictionary_base'
import { getAllPartners } from '@/api/resource/partner'
import { mapGetters } from 'vuex'
import librariesBase from '@views/mixins/libraries_base'
import assignedVehicleBase from './mixins/assigned_vehicle_base'
import { PrintDialog } from 'dj_print'
export default {
  name: 'assignedVehicle',
  mixins: [dictionaryBase, librariesBase, assignedVehicleBase],
  components: {
    FooterToolBar,
    // SelectAutoComplete,
    PrintDialog,
    BackBtn
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: this.$form.createForm(this),
      loading: false,
      moment,
      validatePhoneNumber,
      validatePhoneNumberNoRequired,
      validMaxNumber,
      validMaxNumberSix,
      feeClose1: false,
      feeClose2: false,
      feeClose3: false,
      feeClose4: false,
      // 费用展开
      feeClose: false,
      bodyStyle: {
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px'
      },
      otherBodyStyle: {
        paddingLeft: '17px',
        paddingRight: '17px'
      },
      plateNumberData: [],

      truckLongsMap: [],
      truckTypeMap: [],

      allDrivers: [],

      currentCostType: '4',

      selectedRows: [],
      max: 99999999.99,
      min: 0,

      updateTimer: null,

      // 动态字段
      computeTotalArr: [],
      // computeTotalArr: ['ksTranMoney', 'ksThMoney', 'ksShMoney', 'ksXhMoney', 'ksOtherMoney'],
      sites: [],

      pageLoading: false,
      currentDispatch: {},
      allStatusList: [],

      selectOrderVisible: false,
      sumMoney: 0,
      typeOptions: [
        { value: 1, label: '按合同计费' },
        { value: 2, label: '按手工计费' }
      ],
      currentType: 1,
      // 运输类型默认值
      currentTransportType: '',

      allCarriersList: [],
      // 调度人手机号验证规则。  承运商不必选   司机必选
      phoneRules: [{ validator: validatePhoneNumberNoRequired }],

      modalKey: new Date().getTime(),
      // 编辑的时候  缓存运单id
      catchIds: []
    }
  },
  created () {
    console.log('查看userinfo', this.userInfo)
    this.initPage()
  },
  mounted () {
  },
  methods: {
    async initPage () {
      this.pageLoading = true
      // 司机的时候
      if (!this.isCarrier) {
        // 调度人手机非必选
        this.phoneRules = [
          { required: true, message: '请输入手机号' },
          { validator: this.validatePhoneNumberNoRequired }
        ]

        // 所有司机共用费用来源
        // this.loadFeeList({
        //   expenseType: 'DRIVER',
        //   typePartId: '司机'
        // })
      }

      // 创建的时候
      if (!this.dispatchId) {
        // 先初始化  selectedRows
        this.createSelectedRows()
        this.pageLoading = false
      }

      if (this.dispatchId) {
        getAllDispatchStatus().then(res => {
          this.allStatusList = res.data
        })
        getdetails({ dispatchId: this.dispatchId }).then(res => {
          this.setPageDatas(res.data)
          this.pageLoading = false
          // console.log('res515111', res)

          // 若是承运商，则获取该承运商下的费用列表
          // res.data && res.data.carrierId && this.loadFeeList({
          //   expenseType: 'NOVCC',
          //   typePartId: res.data.carrierId
          // })
        }).catch(() => {
          this.pageLoading = false
        })
      }
      selectAll().then(res => {
        this.sites = res.data || []
      })
      this.getAllPlateNumber()
      // 获取运输类型
      this.getTransportTypeMap().then(res => {
        this.currentTransportType = this.transportTypeMap[0].dictId
      })
      getTruckLongs().then((res) => {
        this.truckLongsMap = res.data
      })
      getTruckTypeByDataStatus().then((res) => {
        this.truckTypeMap = res.data
      })
      this.getAllDriver()
      if (this.isCarrier) {
        this.getAllCarriersList()
      }
    },
    range (start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    // 日期限制
    disabledStartDateTime (current) {
      let values = this.form.getFieldsValue()
      if (values.arrivalTime) {
        let selectDay = moment(values.arrivalTime).format('YYYY-MM-DD')
        let currentDay = moment(current).format('YYYY-MM-DD')
        let arrivalTime = moment(values.arrivalTime).format('HH:mm:ss')
        console.log('selectDay', selectDay, 'currentDay', currentDay)
        if (arrivalTime && selectDay === currentDay) {
          arrivalTime = arrivalTime.split(':')
          arrivalTime = arrivalTime.map(val => parseFloat(val))
          let h = this.range(arrivalTime[0], 24)
          let m = this.range(arrivalTime[1], 60)
          let s = this.range(arrivalTime[2], 60)
          return {
            disabledHours: () => h,
            disabledMinutes: () => m,
            disabledSeconds: () => s
          }
        }
      }
    },
    disabledStartDate (current) {
      let values = this.form.getFieldsValue()
      if (values.arrivalTime) return current && current >= moment(values.arrivalTime).endOf('day')
    },
    disabledEndDateTime (current) {
      let values = this.form.getFieldsValue()
      if (values.pickupTime) {
        let selectDay = moment(values.pickupTime).format('YYYY-MM-DD')
        let currentDay = moment(current).format('YYYY-MM-DD')
        let pickupTime = moment(values.pickupTime).format('HH:mm:ss')
        if (pickupTime && selectDay === currentDay) {
          pickupTime = pickupTime.split(':')
          pickupTime = pickupTime.map(val => parseFloat(val))
          let h = this.range(0, pickupTime[0])
          let m = this.range(0, pickupTime[1])
          let s = this.range(0, pickupTime[2])
          return {
            disabledHours: () => h,
            disabledMinutes: () => m,
            disabledSeconds: () => s
          }
        }
      }
    },
    disabledEndDate (current) {
      let values = this.form.getFieldsValue()
      if (values.pickupTime) return current && current <= moment(values.pickupTime).subtract(1, 'days').endOf('day')
    },
    // 获取承运方列表
    getAllCarriersList () {
      getAllPartners({ partnerTypes: 2 }).then(res => {
        let arr = []
        if (res.data && res.data.length) {
          res.data.forEach((item, index) => {
            arr.push({
              ...item,
              value: item.partnerId,
              text: item.partnerName
            })
          })
        }
        this.allCarriersList = arr
      })
    },
    // 车牌
    getAllPlateNumber () {
      queryAllTruckDrivers().then(res => {
        let arr = []
        if (res.data && res.data.length) {
          res.data.forEach((item, index) => {
            arr.push({
              ...item,
              value: item.truckId,
              text: item.plateNumber
            })
          })
        }
        this.plateNumberData = arr
      })
    },
    // 司机
    getAllDriver () {
      queryDrivers({ pageSize: 10000, page: 1 }).then(res => {
        let arr = []
        if (res.data && res.data.records.length) {
          res.data.records.forEach(item => {
            arr.push({
              ...item,
              value: item.driverId,
              text: item.driverName
            })
          })
        }
        this.allDrivers = arr
      })
    },
    showTransportType () {
      let find = this.transportTypeMap.find(item => item.dictId === this.currentDispatch.transportType)
      if (find) return find.dictName
      return ''
    },
    showCurrentType () {
      console.log('this.currentDispatch515', this.currentDispatch.equalizationMethod)
      const equalizationMethodObj = {
        1: '按件数',
        2: '按重量',
        3: '按体积',
        4: '按运单数'
      }
      return equalizationMethodObj[this.currentDispatch.equalizationMethod]
    },
    showTruckType () {
      let find = this.truckTypeMap.find(item => item.dictId === this.currentDispatch.truckType)
      if (find) return find.dictName
      return ''
    },
    showTruckLength () {
      let find = this.truckLongsMap.find(item => item.dictId === this.currentDispatch.truckLength)
      if (find) return find.dictName
      return ''
    },
    // 编辑回填数据
    setPageDatas (dataItem) {
      if (dataItem && dataItem.dispatchId) {
        this.currentDispatch = dataItem
        let fields = {
          transportType: dataItem.transportType,
          // 联系人去掉了
          // contact: dataItem.contact,
          // contactMobile: dataItem.contactMobile,
          remark: dataItem.remark,
          plateNumber: dataItem.plateNumber,
          driverName: dataItem.driverName,
          mobile: dataItem.mobile,
          truckLength: dataItem.truckLength,
          truckType: dataItem.truckType,
          weightLoad: dataItem.weightLoad,
          costType: dataItem.equalizationMethod + '',
          ksTranMoney: dataItem.transportFee,
          ksThMoney: dataItem.pickupFee,
          ksShMoney: dataItem.deliveryFee,
          ksXhMoney: dataItem.dischargeFee,
          ksOtherMoney: dataItem.otherFee,
          ksSettleXfMoney: dataItem.settlementCurrent,
          ksSettleDfMoney: dataItem.settlementArrival,
          ksSettleMonthMoney: dataItem.settlementMonth,
          carrier: dataItem.carrierId
        }
        if (dataItem.pickupTime) {
          fields.pickupTime = dataItem.pickupTime ? moment(dataItem.pickupTime) : undefined
        }
        console.log('查看arrivalTime', dataItem.arrivalTime)
        if (dataItem.arrivalTime) {
          fields.arrivalTime = dataItem.arrivalTime ? moment(dataItem.arrivalTime) : undefined
        }

        if (dataItem.costInformationType) {
          this.currentType = dataItem.costInformationType
        }
        // this.form.setFieldsValue({ ksSum: sum })
        this.editSelectedRows(dataItem.waybills)
      }
    },
    // 清空所有的费用和合同数据
    clearFeeData () {
      let feeList = {}
      this.computeTotalArr.forEach(field => {
        feeList[field] = ''
      })
      // this.form.setFieldsValue({
      //   'ksSum': 0,
      //   ...feeList
      // })
      this.selectedRows.forEach(row => {
        row.contractName = ''
      })
      this.$nextTick(() => {
        this.updatePageNumbers()
      })
    },
    getSiteName (order) {
      let find = this.sites.find(item => item.siteId === order.station)
      if (find) return find.address
      return order.arrivalAddress
    },
    // 打印
    printDialogShow () {
      this.printLoading = true
      this.$refs.PrintDialogRef.print([this.currentDispatch])
    },
    // 过滤
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    createSelectedRows (datas) {
      var rows = this.$ls.get('AssignedVehicle') || []
      if (datas && datas.length) rows = datas
      if (rows.length) {
        rows.forEach((row, index) => {
          this.computeTotalArr.forEach(field => {
            row[field] = ''
          })
          row.ksSum = ''
          row.ksSettleXfMoney = ''
          row.ksSettleDfMoney = ''
          row.ksSettleMonthMoney = ''
        })
      }
      this.selectedRows = rows
    },
    // 编辑的时候row赋值
    editSelectedRows (rows) {
      this.selectedRows = []
      this.catchIds = []
      if (rows && rows.length) {
        rows.forEach(row => {
          this.catchIds.push({
            routeId: row.routeId,
            waybillId: row.waybillId
          })
          // 匹配自定义的费用
          this.computeTotalArr.forEach(field => {
            this.$set(row, field, '')
            if (row.feeList && row.feeList.length) {
              row.feeList.forEach(list => {
                let subDictId = this.getModelKeyId(field)
                if (subDictId === list.outgoType) {
                  this.$set(row, field, list.outgoMoney || '')
                }
              })
            }
          })

          this.$set(row, 'ksSettleXfMoney', row.settlementCurrent || '')
          this.$set(row, 'ksSettleDfMoney', row.settlementArrival || '')
          this.$set(row, 'ksSettleMonthMoney', row.settlementMonth || '')
          this.$set(row, 'contractName', row.contractName || '')
          this.$set(row, 'contractId', row.contractId || '')
          this.updateRowSum(row)
        })
        this.selectedRows = rows
        console.log('编辑查看rows列表')
        console.log(this.selectedRows)
        this.updateBaseMoney()
        this.updateSumMoney()
      }
    },
    cancelSubmit () {
      this.$router.go(-1)
    },

    clearPageAllFee () {
      this.clearFeeData()
      // this.form.setFieldsValue({
      //   'ksSettleXfMoney': '',
      //   'ksSettleDfMoney': '',
      //   'ksSettleMonthMoney': '',
      //   'ksSum': ''
      // })
    },
    removeOrder (order, index) {
      this.selectedRows.splice(index, 1)
      this.clearPageAllFee()
      // this.updatePageNumbers()
    },
    getWaybills () {
      var res = []
      console.log('获取fee字段')
      console.log(this.selectedRows)
      this.selectedRows.forEach(item => {
        var list = {
          feeList: this.getRowValues(item),
          routeId: item.routeId,
          settlementArrival: item.ksSettleDfMoney,
          settlementCurrent: item.ksSettleXfMoney,
          settlementMonth: item.ksSettleMonthMoney,
          siteId: item.station,
          waybillCode: item.waybillCode,
          waybillId: item.waybillId
        }
        // 如果是合同模式  要带上合同ID和名称
        if (this.isAgreement) {
          list.contractId = item.contractId
          list.contractName = item.contractName
        }
        res.push(list)
      })
      return res
    },
    // 根据modelKey 获取费用类型id
    getModelKeyId (modelKey) {
      if (!modelKey) return ''
      if (modelKey.includes('key_')) {
        let id = modelKey.replace('key_', '')
        return parseFloat(id)
      }
      return modelKey
    },
    // 获取row动态费用
    getRowValues (row) {
      let result = []
      this.computeTotalArr.forEach(field => {
        let fieldVal = row[field]
        if (fieldVal) {
          let findVal = this.allValues.find(item => item.modelKey === field)
          if (findVal) {
            result.push({
              outgoMoney: fieldVal,
              outgoType: findVal.subDictId
            })
          }
        }
      })
      return result
    },
    costTypeChange (val) {
      this.currentCostType = val
      this.updatePageNumbers()
    },
    chknum (value) {
      const reg = /^(-)*(\d+)\.(\d+).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) { return (parseFloat(value)).toFixed(4) }
      }
    },
    // 根据输入的值计算row的值。默认计算所有的值，也可以传指定的field，只计算这一列
    updatePageNumbers (currentField) {
      console.log('开始计算值')
      return false
      console.log(this.selectedRows)
      // 设置一个定时器，避免快速输入的时候浪费内存
      clearTimeout(this.updateTimer)
      this.updateTimer = null
      // 运单数
      const orderCount = this.selectedRows.length

      // 用于计算 输入框 的合计
      var sum = 0

      this.updateTimer = setTimeout(() => {
        var fields = this.form.getFieldsValue()
        for (var field in fields) {
          // 当前字段值
          const val = fields[field]
          // 当前字段值（数字类型）
          var total = parseFloat(val) // 输入的总值

          // 是正确的值的时候，计算合计
          if (!isNaN(total)) {
            // 计算输入行的合计
            if (this.computeTotalArr.includes(field)) {
              sum = wmath.add(sum, total)
            }
          }

          var summation = 0 // 假如有3条订单，这里面存前2条总和，最后一单 = 总数-前面总和 。 如100/3
          this.selectedRows.forEach((row, rowIndex) => {
            if (row.hasOwnProperty(field)) {
              if (!isNaN(total)) {
                // 每个订单分担的值
                let itemVal = 0
                // 按运单
                if (this.currentCostType === '4') {
                  console.log(total, orderCount)
                  itemVal = parseFloat(wmath.div(total, orderCount).toFixed(4))
                }
                // 按件数
                if (this.currentCostType === '1') {
                  itemVal = parseFloat(wmath.div(total, this.totalAmount).toFixed(4))
                  itemVal = wmath.mul(itemVal, row.totalAmount)
                }

                // 按重量
                if (this.currentCostType === '2') {
                  itemVal = parseFloat(wmath.div(total, this.totalWeight).toFixed(4))
                  itemVal = wmath.mul(itemVal, row.totalWeight)
                }

                // 按体积
                if (this.currentCostType === '3') {
                  itemVal = parseFloat(wmath.div(total, this.totalVolume).toFixed(4))
                  itemVal = wmath.mul(itemVal, row.totalVolume)
                }

                // 最后一个值单独处理
                if (rowIndex === orderCount - 1) {
                  itemVal = wmath.sub(total, summation)
                }

                // 设置显示字段值
                if (currentField) {
                  if (field === currentField) {
                    row[currentField] = itemVal
                  }
                } else {
                  row[field] = itemVal
                }

                // 累加之前的值，为了计算最后一个值使用
                summation += itemVal
              } else {
                row[field] = ''
              }
              this.updateRowSum(row)
            }
          })
        }
        this.updateSumMoney()
      }, 300)
    },
    // isUse  是否计算上面输入框的值
    triggerRowSum (row, isUse = false) {
      this.updateRowSum(row)
      this.updateSumMoney()
      // 合同模式的话，根据底部的运费反推出值
      if (this.isAgreement && isUse) {
        this.updateBaseMoney()
      }
    },
    // 计算row的合计值
    updateRowSum (row) {
      row['ksSum'] = row.feeList.reduce((res, list) => {
        if (list.outgoType) {
          res = wmath.add(res, list.outgoMoney)
        }
        return res
      }, 0)
    },
    // 根据row的值计算输入框的值
    updateBaseMoney () {
      setTimeout(() => {
        let ksSettleXfMoney = 0
        let ksSettleDfMoney = 0
        let ksSettleMonthMoney = 0
        let ksSum = 0
        let feeList = {}
        this.selectedRows.forEach(row => {
          ksSettleXfMoney = wmath.add(ksSettleXfMoney, row.ksSettleXfMoney || 0)
          ksSettleDfMoney = wmath.add(ksSettleDfMoney, row.ksSettleDfMoney || 0)
          ksSettleMonthMoney = wmath.add(ksSettleMonthMoney, row.ksSettleMonthMoney || 0)
          ksSum = wmath.add(ksSum, row.ksSum || 0)
          this.computeTotalArr.forEach(field => {
            if (row[field]) {
              if (!feeList[field]) feeList[field] = 0
              feeList[field] = wmath.add(feeList[field], row[field] || 0)
              this.$set(this.currentDispatch, field, feeList[field])
            }
          })
        })
        this.$set(this.currentDispatch, 'ksSettleXfMoney', ksSettleXfMoney || '')
        this.$set(this.currentDispatch, 'ksSettleDfMoney', ksSettleDfMoney || '')
        this.$set(this.currentDispatch, 'ksSettleMonthMoney', ksSettleMonthMoney || '')
        this.$set(this.currentDispatch, 'ksSum', ksSum || '')
      }, 310)
    },
    // 更新总额
    updateSumMoney () {
      this.sumMoney = this.selectedRows.reduce((res, item) => {
        res = wmath.add(res, item.ksSum || 0)
        return res
      }, 0)
      console.log('查看总额')
      console.log(this.sumMoney)
    },

    lineListLoad (vm) {
      let ids = this.selectedRows.map(item => item.routeId)
      vm.setSelectedRows(ids)
      console.log('设置ids', ids)
    },
    selectOrderShow () {
      this.selectOrderVisible = true
    },
    selectOrderCancel () {
      this.selectOrderVisible = false
      if (this.$refs.roadList) {
        this.modalKey = new Date().getTime()
      }
    },
    selectOrderOk () {
      if (this.$refs.roadList) {
        this.$confirm({
          // title: 'Do you want to delete these items?',
          content: '所有费用和结算金额将被清空',
          onOk: () => {
            let rows = this.$refs.roadList.getSelectedRows()
            if (rows.length) {
              rows.forEach(row => {
                let find = this.selectedRows.find(item => item.routeId === row.routeId)
                if (!find) this.selectedRows.push(row)
              })
              this.createSelectedRows(this.selectedRows)
              this.$nextTick(() => {
                // this.updatePageNumbers()
                this.clearPageAllFee()
                this.selectOrderCancel()
              })
            }
          }
        })
        return false
      }
      this.$message.error('请选择数据')
    },
    // 清空页面数据
    clearPageData () {
      this.loading = false
      this.currentCostType = '1'
      this.selectedRows = []
      this.updateTimer = null
      this.computeTotalArr = []
      this.pageLoading = false
      this.currentDispatch = {}
      this.selectOrderVisible = false
      this.sumMoney = 0
      this.currentType = 1
      var fields = this.form.getFieldsValue()
      for (let prop in fields) {
        fields[prop] = undefined
      }
      fields.arrivalTime = undefined
      fields.pickupTime = undefined
      fields.costType = this.currentCostType
      console.log(fields)
      // this.form.setFieldsValue(fields)
    },
    // 运单详情页
    goDetail (id) {
      window.location.href = `/waybill/#/waybill/detail/${id}`
      // this.$router.push({
      //   name: 'WaybillDetail',
      //   params: { id: id }
      // })
    }
  },
  activated () {
    // this.initPage()
  },
  beforeRouteLeave (to, from, next) {
    console.log('离开了')
    if (to.name === 'DispatchList' || to.name === 'RoadLineList') {
      this.$ls.set('pageCatch', true)
    }
    this.clearPageData()
    next()
  },
  watch: {
  },
  computed: {
    // 是否在ifrmae中
    isIframe () {
      return this.$route.query.isIframe === '1'
    },
    ...mapGetters([
      'userInfo'
    ]),
    // 总件数
    totalAmount () {
      return this.selectedRows.reduce((res, item) => {
        res = wmath.add(res, item.amount || 0)
        return res
      }, 0)
    },
    // 总重量
    totalWeight () {
      return this.selectedRows.reduce((res, item) => {
        res = wmath.add(res, item.weight || 0)
        return res
      }, 0)
    },
    // 总体积
    totalVolume () {
      return this.selectedRows.reduce((res, item) => {
        res = wmath.add(res, item.volume || 0)
        return res
      }, 0)
    },
    // 有记录代表编辑
    dispatchId () { return this.$route.params.dispatchId },
    selectOrderWidth () { return document.documentElement.clientWidth * 0.8 },
    // 是合同吗？
    isAgreement () { return this.currentType === 1 && this.isCarrier },
    // 是否承运商模式
    isCarrier () { return this.$route.name === 'assignedShop' || this.$route.name === 'shopDetail' },
    // 是否是查看详情模式
    isDetail () { return this.$route.name === 'dispatchDetail' || this.$route.name === 'shopDetail' }
  }

}
</script>

<style lang="less" scoped>
  .mb10{margin-bottom: 10px}
  .mt10{margin-top: 10px}
  .flex{
    display: -webkit-flex;
    display: flex;
    label{
      width: 80px;
      text-align: right;
      -webkit-flex: none;
      flex: none;
    }
  }
  .closeJt{
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }
  .avOrderBox{
    font-size: 12px;
    display: block;
    overflow: hidden;
    .avOrderListTitle , .avOrderListBody{
      padding: 0 10px;
      border-bottom:1px solid rgba(232,232,232,1);
    }
    .avOrderListBody {
      padding: 5px 15px;
    }
    .avOrderList{
      display: -webkit-flex;
      display: flex;
    }
    .avOrderListL{
      flex: none;
      -webkit-flex: none;
      width: 60px;
      -webkit-align-items: center;
      align-items: center;
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: center;
      justify-content: center;
      border-right: 1px solid rgba(232,232,232,1);
      border-bottom: 1px solid rgba(232,232,232,1);
    }
    .avOrderList:last-child .avOrderListL{
      border-bottom: 0
    }
    .avOrderListR{
      flex: 1;
      -webkit-flex: 1;
    }
    .avOrderListTitle{
      // height:88px;
      background:rgba(250,250,250,1);
      border-radius:4px 4px 0px 0px;
      overflow: hidden;
      // padding-top: 20px;
    }
  }
  .valueList {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    // .flex{
    //   // margin-bottom: 10px;margin-top: -10px;
    // }
  }
  .noPadding {
    .avOrderBox{
      padding: 0;
      margin: -5px -11px;
      border: 1px solid rgba(232,232,232,1);
      .avOrderList:last-child{
        .avOrderListBody{border-bottom: 0;}
      }
    }
  }
  .bottomTotalInfo{
    background: #fafafa;
    padding: 10px;
    margin: 0 -10px;
    position: relative;
    top: 5px;
  }

  .flex_item {
    list-style: none;padding: 0;margin: 0;
    li {
      display: inline-block;margin-right: 60px;
    }
  }
  .close{
    display: none;
  }
</style>
