<template>
  <a-spin class="page-container new_antd" :spinning="pageLoading" :delay="100">
    <back-btn title="返回上一级"/>
    <a-form :form="form" layout="vertical">
      <a-card title="基础信息" class="smallCard" :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose1=!feeClose1" ><a-icon type="down"  :class="{closeJt:feeClose1}" /></a>
        <div :class="{close: feeClose1}">
          <template v-if="!dispatchId" >
            <a-row :gutter="{md:10}">
              <a-col :md="6" :sm="24">
                <a-form-item label="运输方式" class="mb10">
                  <a-select v-decorator="['transportType',{initialValue:currentTransportType, rules: [{ required: true, message: '请选择运输方式' }]}]"
                            placeholder="请选择运输方式" allowClear>
                    <a-select-option v-for="value in transportTypeMap"
                                     :key="value.dictId">{{value.dictName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="提货时间" class="mb10">
                  <!--                {rules: [{ required: true, message: '请选择提货时间' }-->
                  <a-date-picker
                    v-decorator="['pickupTime']"
                    :format="'YYYY-MM-DD HH:mm:ss'"
                    placeholder="请选择提货时间"
                    :disabledDate="disabledStartDate"
                    :disabledTime="disabledStartDateTime"
                    :showTime="{ defaultValue: moment() }"
                    style="width: 100%"/>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24" >
                <a-form-item label="送达时间" class="mb10">
                  <a-date-picker
                    v-decorator="['arrivalTime']"
                    :format="'YYYY-MM-DD HH:mm:ss'"
                    :showTime="{ defaultValue: moment() }"
                    placeholder="请选择送达时间"
                    :disabledDate="disabledEndDate"
                    :disabledTime="disabledEndDateTime"
                    style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-if="isCarrier">
                <a-form-item label="承运商单号" class="mb10">
                  <a-input v-decorator="['carrierNumber', {rules:[{ max: 31, message: '最多输入30个字符' }]}]"
                           placeholder="请输入承运商单号"></a-input>
                </a-form-item>
              </a-col>

            </a-row>

            <a-row :gutter="{md:10}">
              <a-col :md="12" :sm="24">
                <a-form-item label="备注" class="mb10">
                  <a-textarea  v-decorator="['remark', { rules: [{ message: `最多可输入100个字符`, whitespace: true, max: 101}]}]"
                               :autosize="{ minRows: 1, maxRows: 3 }"
                               placeholder="最多可输入100个字符"/>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
          <template v-if="dispatchId" >
            <a-row :gutter="{md:10}">
              <a-col :md="6" :sm="24">
                <a-form-item label="调度单号" class="mb10">
                  <a-input v-model="currentDispatch.dispatchCode" :disabled="true"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="状态" class="mb10">
                  <a-input :disabled="true" :value="getDispatchStatusDesc(currentDispatch.bizStatus)"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="运输方式" class="mb10">
                  <a-select v-decorator="['transportType',{rules: [{ required: true, message: '请选择运输方式' }]}]"
                            :disabled="true"
                            placeholder="请选择运输方式">
                    <a-select-option v-for="value in transportTypeMap"
                                     :key="value.dictId">{{value.dictName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="提货时间" class="mb10">
                  <a-date-picker
                    v-decorator="['pickupTime']"
                    :format="'YYYY-MM-DD HH:mm:ss'"
                    :showTime="{ defaultValue: moment() }"
                    :disabledDate="disabledStartDate"
                    :disabledTime="disabledStartDateTime"
                    placeholder="请选择提货时间"
                    style="width: 100%"/>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="{md:10}">
              <a-col :md="6" :sm="24" >
                <a-form-item label="送达时间" class="mb10">
                  <a-date-picker
                    v-decorator="['arrivalTime']"
                    :format="'YYYY-MM-DD HH:mm:ss'"
                    :showTime="{ defaultValue: moment() }"
                    :disabledDate="disabledEndDate"
                    :disabledTime="disabledEndDateTime"
                    placeholder="请选择送达时间"
                    style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24" v-if="isCarrier">
                <a-form-item label="承运商单号" class="mb10">
                  <a-input v-decorator="['carrierNumber', {rules:[{ max: 31, message: '最多输入30个字符' }]}]"
                           placeholder="请输入承运商单号"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="备注" class="mb10">
                  <a-textarea  v-decorator="['remark', { rules: [{ message: `最多可输入100个字符`, whitespace: true, max: 101}]}]"
                               :autosize="{ minRows: 3, maxRows: 3 }"
                               :disabled="isDetail"
                               placeholder="最多可输入100个字符"/>
                </a-form-item>
              </a-col>
            </a-row>
          </template>
        </div>
      </a-card>

      <a-card :title="isCarrier ? '承运商信息' : '车辆信息'"  class="mt10 smallCard" :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose2=!feeClose2" ><a-icon type="down"  :class="{closeJt:feeClose2}" /></a>
        <div :class="{close: feeClose2}">
          <a-row :gutter="{md:10}">
            <a-col :md="6" :sm="24">
              <a-form-item label="车牌号" v-if="!isCarrier" class="mb10">
                <a-auto-complete
                  :disabled="isDetail"
                  :dataSource="plateNumberData"
                  v-decorator="['plateNumber',{rules: [
                  { required: true, message: '请输入车牌号' },
                ]}]"
                  allowClear
                  :filterOption="filterOption"
                  @change="plateNumberChange"
                  placeholder="请输入车牌号"></a-auto-complete>
              </a-form-item>

              <a-form-item label="承运商名称" v-if="isCarrier" class="mb10">
                <a-select
                  v-if="isCarrier"
                  :disabled="isDetail"
                  placeholder="请输入承运商名称"
                  showSearch
                  :filterOption="filterOption"
                  @change="carrierChangeCb"
                  v-decorator="['carrier',{rules: [
                  { required: true, message: '请输入承运商名称' }
                ]}]">
                  <a-select-option
                    v-for="item in allCarriersList"
                    :key="item.partnerId"
                    :value="item.partnerId">
                    {{item.partnerName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="司机姓名" class="mb10">
                <a-auto-complete
                  :disabled="isDetail"
                  :dataSource="allDrivers"
                  v-decorator="['driverName', {rules:[{required: !isCarrier, message: '请输入司机姓名'}]}]"
                  allowClear
                  :filterOption="filterOption"
                  @change="handleDriverNameChange"
                  placeholder="请输入司机姓名"></a-auto-complete>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24" >
              <a-form-item label="司机手机号" class="mb10">
                <a-input
                  :disabled="isDetail"
                  v-decorator="['mobile',{rules: phoneRules }]"
                  placeholder="请输入司机手机号"/>
              </a-form-item>
            </a-col>

          </a-row>
          <a-row :gutter="{md:10}">
            <a-col :md="6" :sm="24">
              <a-form-item label="车长（m）" class="mb10">
                <a-select
                  :disabled="isDetail" allowClear
                  placeholder="请选择车长"
                  v-decorator="['truckLength']">
                  <a-select-option
                    v-for="item in truckLongsMap"
                    :key="item.dictId"
                    :value="item.dictId">
                    {{item.dictName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="车辆类型" class="mb10">
                <a-select
                  :disabled="isDetail" allowClear
                  v-decorator="['truckType']"
                  placeholder="请选择车辆类型" >
                  <a-select-option
                    v-for="item in truckTypeMap"
                    :catid="item.catalogId"
                    :key="item.dictId">
                    {{item.dictName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="载重（kg）" class="mb10">
                <a-input-number style="width: 100%" v-decorator="['weightLoad', {rules: [{validator: validMaxNumberSix}]}]" :max='999999.99' :disabled="isDetail" :min='0' placeholder="请输入载重"/>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-card>

      <a-card title="费用信息" class="mt10 smallCard"  :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose3=!feeClose3" ><a-icon type="down"  :class="{closeJt:feeClose3}" /></a>
        <div :class="{close: feeClose3}">
          <a-row :gutter="{md:10}" v-if="isCarrier">
            <a-col :md="6" :sm="24">
              <a-radio-group class="di_fee_type_change_radio" :disabled="isDetail" @change="currentTypeChange" :options="typeOptions"  v-model="currentType" />
            </a-col>
          </a-row>
          <a-row :gutter="{md:10}">
            <a-col :md="6" :sm="12">
              <a-form-item label="均摊方式" class="mb10">
                <a-select v-decorator="['costType', {rules: [{ required: true, message: '请选择均摊方式' }]}]"
                          @change="costTypeChange"
                          :disabled="isDetail" allowClear
                          placeholder="请选择均摊方式">
                  <a-select-option value="4" v-if="!isAgreement">按运单数</a-select-option>
                  <a-select-option value="1">按件数</a-select-option>
                  <a-select-option value="2">按重量</a-select-option>
                  <a-select-option value="3">按体积</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="12" v-if="isAgreement && !isDetail">
              <a-button type="primary" size="small" @click="getAgreement" :loading="agreementLoading">匹配合同</a-button>
            </a-col>
          </a-row>
          <a-row :gutter="{md:10}">
            <template v-if="allValues.length">
              <a-col :md="6" :sm="24"  v-for="(aVal) in allValues" :key="aVal.subDictId">
                <a-form-item :label="`${aVal.subDictName}(元)`" class="mb10">
                  <a-input-number :max='max'
                                  :min='min'
                                  :disabled="isAgreement || isDetail"
                                  :placeholder="`请输入${aVal.subDictName}`"
                                  @change="updatePageNumbers(aVal.modelKey)"
                                  :formatter='chknum'
                                  style="width: 100%"
                                  v-decorator="[aVal.modelKey,{rules: [{validator: validMaxNumber}]}]"
                                  :parser='chknum' />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="6" :sm="24" >
              <a-form-item label="合计" class="mb10">
                <a-input-number :disabled="true"
                                placeholder=""
                                :formatter='chknum'
                                style="width: 100%"
                                v-decorator="['ksSum',{rules: [{validator: validMaxNumber}]}]"
                                :parser='chknum' />
              </a-form-item>
            </a-col>

          </a-row>
        </div>
      </a-card>

      <a-card title="结算信息" class="mt10 smallCard" :bodyStyle="otherBodyStyle">
        <a href="javascript:" slot="extra" @click="feeClose4=!feeClose4" ><a-icon type="down"  :class="{closeJt:feeClose4}" /></a>
        <div :class="{close: feeClose4}">
          <a-row :gutter="{md:10}">
            <a-col :md="6" :sm="24">
              <a-form-item label="现付金额:" class="mb10">
                <a-input-number :max='max'
                                :min='min'
                                :disabled="isDetail"
                                placeholder="请输入现付金额"
                                @change="updatePageNumbers('ksSettleXfMoney')"
                                :formatter='chknum'
                                style="width: 100%"
                                v-decorator="['ksSettleXfMoney',{rules: [{validator: validMaxNumber}]}]"
                                :parser='chknum' />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="到付金额" class="mb10">
                <a-input-number :max='max'
                                :min='min'
                                :disabled="isDetail"
                                placeholder="请输入到付金额"
                                @change="updatePageNumbers('ksSettleDfMoney')"
                                :formatter='chknum'
                                style="width: 100%"
                                v-decorator="['ksSettleDfMoney',{rules: [{validator: validMaxNumber}]}]"
                                :parser='chknum' />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24" >
              <a-form-item label="月结金额" class="mb10">
                <a-input-number :max='max'
                                :min='min'
                                :disabled="isDetail"
                                placeholder="请输入月结金额"
                                @change="updatePageNumbers('ksSettleMonthMoney')"
                                :formatter='chknum'
                                style="width: 100%"
                                v-decorator="['ksSettleMonthMoney',{rules: [{validator: validMaxNumber}]}]"
                                :parser='chknum' />
              </a-form-item>
            </a-col>

          </a-row>
        </div>
      </a-card>

      <a-card title="运单信息" class="mt10 smallCard noPadding" :bodyStyle="bodyStyle" >
        <a href="javascript:" slot="extra" @click="feeClose=!feeClose" ><a-icon type="down"  :class="{closeJt:feeClose}" /></a>
        <div v-if="dispatchId && !isDetail" >
          <a-button type="primary" class="avOrderBtn" size="small" @click="selectOrderShow">添加运单</a-button>
        </div>
        <div :class="{close:feeClose}">
          <dispatch-order-list
            @remove="removeOrder"
            :selectedRows="selectedRows"
            :isAgreement="isAgreement"
            :sites="sites"
            :updatePageNumbers="updatePageNumbers"
            :triggerRowSum="triggerRowSum"
            :allValues="allValues"
            :dispatchId="dispatchId"></dispatch-order-list>
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

    <footer-tool-bar align="center">
      <a-button @click="cancelSubmit">返回</a-button> &nbsp;&nbsp;
      <a-button type="primary" v-if="!isDetail" @click="sendSubmit" :loading="loading">
        {{this.dispatchId ? '修改调度单' : '生成调度单'}}
      </a-button>
      &nbsp;&nbsp;<a-button type="primary" v-if="dispatchId" :loading="printLoading" @click="printDialogShow">打印</a-button>
    </footer-tool-bar>

<!--    选择运单-->
    <a-modal
      title="添加运单"
      :width="selectOrderWidth"
      :visible="selectOrderVisible"
      :key="modalKey"
      @cancel="selectOrderCancel"
      @ok="selectOrderOk">
      <road-line-list ref="roadList" @loadData="lineListLoad" :isListMode="false"></road-line-list>
    </a-modal>

    <print-dialog ref="PrintDialogRef" :store="$store" title="调度单打印" @success="printLoading=false" :printmenuId="2"></print-dialog>
  </a-spin>
</template>

<script>
import { validatePhoneNumber, validMaxNumber, validatePhoneNumberNoRequired, validMaxNumberSix } from '@/utils/validate'
import FooterToolBar from '@/components/FooterToolbar'
import BackBtn from '@/components/BackBtn'
import moment from 'moment'
// import SelectAutoComplete from './components/SelectAutoComplete'
import { queryAllTruckDrivers } from '@/api/resource/truck'
import { getTruckLongs, getTruckTypeByDataStatus } from '@/api/libraries'
import { queryDrivers } from '@/api/resource/driver'
import wmath from '@utils/wmath'
import { createDispatchWaybill, getdetails, getAllDispatchStatus } from '@/api/dispatch/dispatch'
import { selectAll } from '@/api/resource/siteAddress'
import dictionaryBase from '@/views/dispatch/DispatchList/mixins/dictionary_base'
import RoadLineList from './RoadLineList'
import { matchDispatch } from '@/api/resource/contract'
import { getAllPartners } from '@/api/resource/partner'
import { TENANT_ID } from '@/store/mutation-types'
import { mapGetters } from 'vuex'
import { PrintDialog } from 'dj_print'
import librariesBase from '@views/mixins/libraries_base'
import assignedVehicleBase from './mixins/assigned_vehicle_base'
import DispatchOrderList from '@/views/dispatch/components/DispatchOrderList'

export default {
  name: 'assignedVehicle',
  mixins: [dictionaryBase, librariesBase, assignedVehicleBase],
  components: {
    FooterToolBar,
    // SelectAutoComplete,
    RoadLineList,
    PrintDialog,
    DispatchOrderList,
    BackBtn
  },
  data () {
    return {
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
      feeClose: true,
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

      currentCostType: '',

      selectedRows: [],
      max: 99999999.999999,
      min: 0,

      updateTimer: null,
      matchDispatchApi: null,

      // 动态字段
      computeTotalArr: [],
      // computeTotalArr: ['ksTranMoney', 'ksThMoney', 'ksShMoney', 'ksXhMoney', 'ksOtherMoney'],
      sites: [],

      pageLoading: false,
      currentDispatch: {},
      allStatusList: [],
      printLoading: false,
      agreementLoading: false,
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
    this.initPage()
  },
  mounted () {
  },
  methods: {
    initPage () {
      this.pageLoading = true

      // 如果用户有loginMobile字段  就直接设置到调度人手机号字段里面
      if (this.userinfo && this.userinfo.loginMobile) {
        this.form.setFieldsValue({ 'contactMobile': this.userinfo.loginMobile })
      }
      // 司机的时候
      if (!this.isCarrier) {
        // 调度人手机非必选
        this.phoneRules = [
          { required: true, message: '请输入手机号' },
          { validator: this.validatePhoneNumberNoRequired }
        ]

        // 所有司机共用费用来源
        this.loadFeeList({
          expenseType: 'DRIVER',
          typePartId: '司机'
        })
      }

      // 创建的时候
      if (!this.dispatchId) {
        // 先初始化  selectedRows
        this.createSelectedRows()
        // 如果没有 selectedRows  就返回上一页
        if (this.selectedRows.length === 0) {
          this.$message.error('请选择运单数据!')
          this.$router.push({ name: 'RoadLineList' })
        }
        this.pageLoading = false
      }

      if (this.dispatchId) {
        getAllDispatchStatus().then(res => {
          this.allStatusList = res.data
        })
        getdetails({ dispatchId: this.dispatchId }).then(res => {
          this.setPageDatas(res.data)
          this.pageLoading = false
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
        if (arrivalTime && selectDay === currentDay) {
          arrivalTime = arrivalTime.split(':')
          arrivalTime = arrivalTime.map(val => parseFloat(val))
          let h = this.range(arrivalTime[0], 24)
          let m = this.range(arrivalTime[1], 60)
          let s = this.range(parseFloat(arrivalTime[2]) - 1, 60)
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
          let s = this.range(0, parseFloat(pickupTime[2]) + 1)
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
            if (item.truckId) {
              arr.push({
                ...item,
                value: item.truckId,
                text: item.plateNumber
              })
            }
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
        if (fields.costType) {
          this.currentCostType = fields.costType
        }
        if (dataItem.carrierNumber) fields.carrierNumber = dataItem.carrierNumber
        if (dataItem.pickupTime) {
          fields.pickupTime = dataItem.pickupTime ? moment(dataItem.pickupTime) : undefined
        }
        if (dataItem.arrivalTime) {
          fields.arrivalTime = dataItem.arrivalTime ? moment(dataItem.arrivalTime) : undefined
        }

        if (dataItem.costInformationType) {
          this.currentType = dataItem.costInformationType
        }

        this.form.setFieldsValue(fields)
        // 计算合计
        let sum = this.computeTotalArr.reduce((res, item) => {
          let val = fields[item]
          if (val) {
            res = wmath.add(res, val)
          }
          return res
        }, 0)
        this.form.setFieldsValue({ ksSum: sum })
        console.log('edit', dataItem)
        dataItem.carrierId && this.carrierChange(dataItem.carrierId)
        console.log(JSON.stringify(dataItem.waybills))
        this.editSelectedRows(dataItem.waybills)
      }
    },
    currentTypeChange (val) {
      // 切换到合同的时候，清空那一堆值
      if (this.currentType === 1) {
        this.clearPageAllFee()
      }
      this.form.setFieldsValue({ costType: undefined })
      this.currentCostType = ''
    },
    // 清空所有的费用和合同数据
    clearFeeData () {
      let feeList = {}
      this.computeTotalArr.forEach(field => {
        feeList[field] = ''
      })
      this.form.setFieldsValue({
        'ksSum': 0,
        ...feeList
      })
      this.selectedRows.forEach(row => {
        row.contractName = ''
      })
      this.$nextTick(() => {
        this.updatePageNumbers()
      })
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
          // 不是编辑的时候，动态在row上绑定带total的件重体
          if (!this.dispatchId) {
            row.totalWeight = row.weight || 0
            row.totalVolume = row.volume || 0
            row.totalAmount = row.amount || 0
          }
        })
      }
      this.selectedRows = rows
      // this.$ls.remove('AssignedVehicle')
    },
    // 编辑的时候row赋值
    editSelectedRows (rows, isClear = false) {
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
                  this.$set(row, field, isClear === false ? (list.outgoMoney || '') : '')
                }
              })
            }
          })
          this.$set(row, 'ksSettleXfMoney', isClear === false ? (row.settlementCurrent || '') : '')
          this.$set(row, 'ksSettleDfMoney', isClear === false ? (row.settlementArrival || '') : '')
          this.$set(row, 'ksSettleMonthMoney', isClear === false ? (row.settlementMonth || '') : '')
          this.$set(row, 'contractName', isClear === false ? (row.contractName || '') : '')
          this.$set(row, 'contractId', isClear === false ? (row.contractId || '') : '')
          this.updateRowSum(row)
        })
        this.selectedRows = rows
        this.updateBaseMoney()
        this.updateSumMoney()
        console.log('selectedRows', this.selectedRows)
      }
    },
    // 匹配合同
    getAgreement () {
      var fields = this.form.getFieldsValue()
      if (!fields.transportType) {
        this.$message.error('请选择运输方式')
        return false
      }
      // 承运商的时候判断
      if (this.isCarrier) {
        if (!fields.carrier) {
          this.$message.error('请选择承运商')
          return false
        }
        console.log(this.currentCostType)
        if (!this.currentCostType) {
          this.$message.error('请选择均摊方式')
          return false
        }
      }

      let waybillList = this.selectedRows.reduce((res, item) => {
        let list = {
          'amount': item.totalAmount,
          'rvCityRgcode': item.arrivalCityRgcode || 0,
          'rvDistrictRgcode': item.arrivalDistrictRgcode || 0,
          'rvProvinceRgcode': item.arrivalProvinceRgcode || 0,
          'sdCityRgcode': item.departCityRgcode || 0,
          'sdDistrictRgcode': item.departDistrictRgcode || 0,
          'sdProvinceRgcode': item.departProvinceRgcode || 0,
          'volume': item.totalVolume,
          'waybillId': item.waybillId,
          'weightLoad': item.totalWeight,
          'transportDate': item.transportDate || moment(new Date()).format('YYYY-MM-DD'),
          'computeType': item.computeType || 0,
          'projectId': item.projectId || 0,
          'transportType': fields.transportType || 0,
          'priceUnit': fields.costType || 0
        }
        if (fields.truckLength) list.truckLength = fields.truckLength
        res.push(list)
        return res
      }, [])

      let tenantId = this.$ls.get(TENANT_ID)
      let form = this.form.getFieldsValue()
      var params = {
        waybillList: waybillList,
        tenantId: tenantId || '',
        dispathId: this.dispathId || 0,
        partnerId: form.carrier || 0,
        t: new Date().getTime()
      }
      this.matchDispatchApi = null
      this.clearPageAllFee()
      // 将合同数据放入到row中
      setTimeout(() => {
        console.log('查看状态', this.agreementLoading)
        this.agreementLoading = true
        this.matchDispatchApi = matchDispatch(params).then(res => {
          // 判断合同里返回的费用， 页面中是否都已经存在，如果有不存在的，则提醒并刷新页面
          let unlikeFee = false
          if (res.data && res.data.waybillList && res.data.waybillList.length) {
            for (let list of res.data.waybillList) {
              let unlikeFeeArr = []
              if (list.subResultVo && list.subResultVo.length) {
                list.subResultVo.forEach(sub => {
                  let find = this.allValues.find(val => {
                    return val.tanantNumberId === sub.outgoType
                  })
                  if (find) unlikeFeeArr.push(find)
                })
                console.log('unlikeFeeArr', unlikeFeeArr)
                if (unlikeFeeArr.length !== list.subResultVo.length) {
                  unlikeFee = true
                  break
                }
              }
            }
          }
          if (unlikeFee === true) {
            this.$confirm({
              content: '合同费用已更新，是否刷新页面',
              onOk: () => {
                this.clearPageAllFee()
                location.reload()
              },
              onCancel: () => {
                this.agreementSuccess(res)
              }
            })
          } else {
            this.agreementSuccess(res)
          }
        }).finally(res => {
          setTimeout(() => {
            this.$message.destroy()
          }, 3500)
          this.agreementLoading = false
        })
      }, 300)
    },
    // 匹配合同回调
    agreementSuccess (res) {
      if (res.data.message) {
        if (res.data.isOk) this.$message.success(res.data.message)
        if (!res.data.isOk) this.$message.error(res.data.message)
      }

      if (res.data && res.data.waybillList && res.data.waybillList.length) {
        res.data.waybillList.forEach(list => {
          this.selectedRows.forEach(row => {
            if (row.waybillId === list.waybillId) {
              this.$set(row, 'contractId', list.contractId)
              this.$set(row, 'contractName', list.contractName)
              this.$set(row, 'price', list.price)
              // 设置动态的费用值
              if (list.subResultVo && list.subResultVo.length) {
                list.subResultVo.forEach(sub => {
                  let findVal = this.allValues.find(item => item.subDictId === sub.outgoType)
                  if (findVal) {
                    let modelKey = 'key_' + sub.outgoType
                    this.$set(row, modelKey, sub.outgoMoney)
                  }
                })
              }
              this.triggerRowSum(row, true)
            }
          })
        })
      }
    },

    cancelSubmit () {
      this.$router.go(-1)
    },

    clearPageAllFee () {
      this.clearFeeData()
      this.form.setFieldsValue({
        'ksSettleXfMoney': '',
        'ksSettleDfMoney': '',
        'ksSettleMonthMoney': '',
        'ksSum': ''
      })
    },
    removeOrder (order, index) {
      this.selectedRows.splice(index, 1)
      this.clearPageAllFee()
    },
    sendSubmit () {
      this.form.validateFields((err, values) => {
        console.log('sendSubmit515555', values)
        if (!err) {
          var params = {
            transportType: values.transportType,
            contact: values.contact,
            contactMobile: values.contactMobile,
            remark: values.remark,
            plateNumber: values.plateNumber,
            driverName: values.driverName,
            mobile: values.mobile,
            truckLength: values.truckLength,
            truckType: values.truckType,
            weightLoad: values.weightLoad,
            equalizationMethod: values.costType,
            settlementCurrent: values.ksSettleXfMoney,
            settlementArrival: values.ksSettleDfMoney,
            settlementMonth: values.ksSettleMonthMoney
          }
          if (values.carrierNumber) params.carrierNumber = values.carrierNumber
          if (this.dispatchId) params.dispatchId = this.dispatchId
          if (!this.dispatchId) {
            params.transportType = values.transportType
          }
          if (values.pickupTime) {
            params.pickupTime = values.pickupTime ? moment(values.pickupTime).format('YYYY-MM-DD HH:mm:ss') : ''
          }
          if (values.arrivalTime) {
            params.arrivalTime = values.arrivalTime ? moment(values.arrivalTime).format('YYYY-MM-DD HH:mm:ss') : ''
          }
          // 时间都有的话，判断提货时间不能大于送达时间
          if (values.pickupTime && values.arrivalTime) {
            if (moment(values.pickupTime) >= moment(values.arrivalTime)) {
              this.$message.error('送达时间必须大于提货时间')
              return false
            }
          }
          let sum = isNaN(parseFloat(values.ksSum)) ? 0 : parseFloat(values.ksSum)
          // 验证动态数据是否一致
          let validValues = {}
          let findVal = null
          this.computeTotalArr.forEach(field => {
            if (!validValues[field]) validValues[field] = 0
            this.selectedRows.forEach(row => {
              validValues[field] = wmath.add(validValues[field], row[field] || 0)
            })
          })
          for (var validValue in validValues) {
            let val = validValues[validValue] || 0
            let rowVal = values[validValue] || 0
            if (rowVal !== val) {
              findVal = this.allValues.find(item => item.modelKey === validValue)
              break
            }
          }
          if (findVal) {
            this.$message.error(`${findVal.subDictName}数值不对称`)
            return false
          }

          let settleXfVals = 0 // 现付金额 验证
          let settleDfVals = 0 // 到付金额 验证
          let settleMfVals = 0 // 月结金额 验证
          this.selectedRows.forEach(row => {
            settleXfVals = wmath.add(settleXfVals, row.ksSettleXfMoney || 0)
            settleDfVals = wmath.add(settleDfVals, row.ksSettleDfMoney || 0)
            settleMfVals = wmath.add(settleMfVals, row.ksSettleMonthMoney || 0)
          })
          if (settleXfVals && settleXfVals !== parseFloat(values.ksSettleXfMoney)) {
            this.$message.error(`订单现付金额分摊值不等于总值`)
            return false
          }
          if (settleDfVals && settleDfVals !== parseFloat(values.ksSettleDfMoney)) {
            this.$message.error(`订单到付金额分摊值不等于总值`)
            return false
          }
          if (settleMfVals && settleMfVals !== parseFloat(values.ksSettleMonthMoney)) {
            this.$message.error(`订单月结金额分摊值不等于总值`)
            return false
          }
          // 总额不能等于0
          // if (sum <= 0) {
          //   this.$message.error(`结算金额必须大于0`)
          //   return false
          // }
          // 判断最终合计金额是否一致
          if (this.sumMoney !== sum) {
            this.$message.error(`费用合计不等于结算金额合计`)
            return false
          }

          // 现付金额 + 到付金额 + 月结金额 = 合计金额 （任意一个输入，就要激活判断）
          if (values.ksSettleXfMoney || values.ksSettleDfMoney || values.ksSettleMonthMoney) {
            // 判断三个值加起来必须等于合计
            let two = wmath.add(values.ksSettleXfMoney || 0, values.ksSettleDfMoney || 0)
            let res = wmath.add(two, values.ksSettleMonthMoney || 0)
            if (res !== sum) {
              this.$message.error(`现付金额+到付金额+月结金额必须等于合计金额(${values.ksSum})`)
              return false
            }
          } else {
            // 没有一个输入的时候，月结金额  设置为  合计金额
            params.settlementMonth = values.ksSum
            this.form.setFieldsValue({ ksSettleMonthMoney: values.ksSum })
            this.updatePageNumbers('ksSettleMonthMoney')
          }

          // 司机处理
          let driver = this.allDrivers.find(item => (item.driverName === values.driverName || item.driverId === values.driverName))
          if (driver) {
            params.driverName = driver.driverName
            params.driverId = driver.driverId
          }
          // 承运商的话，需要传入手工或是合同
          if (this.isCarrier) {
            params.costInformationType = this.currentType
            // 承运商处理
            let carrier = this.allCarriersList.find(item => item.partnerId === values.carrier)
            if (carrier) {
              params.carrierId = carrier.partnerId
              params.carrierName = carrier.partnerName
            }
          } else {
            // 车牌处理
            let plateNumberData = this.plateNumberData.find(item => item.truckId === values.plateNumber)
            if (plateNumberData) {
              params.truckId = plateNumberData.truckId
              params.plateNumber = plateNumberData.plateNumber
            }
          }
          this.pageLoading = true
          setTimeout(() => {
            let waybills = this.getWaybills()
            console.log('send')
            console.log(JSON.stringify(waybills))
            if (waybills.length) params.waybills = waybills
            let removeIds = []
            // 删除的发给后端
            this.catchIds.forEach(list => {
              let has = this.selectedRows.some(item => item.routeId === list.routeId)
              if (!has) removeIds.push(list)
            })
            if (removeIds.length) params.dwaybills = removeIds
            createDispatchWaybill(params).then(res => {
              this.$message.success(this.dispatchId ? '修改成功' : '创建成功')
              this.$router.go(-1)
              this.pageLoading = false
              this.$ls.remove('AssignedVehicle')
            }).catch(() => {
              this.pageLoading = false
            })
          }, 320)
        }
      })
    },
    getWaybills () {
      var res = []
      this.selectedRows.forEach(item => {
        var list = {
          feeList: this.getRowValues(item),
          routeId: item.routeId,
          settlementArrival: item.ksSettleDfMoney,
          settlementCurrent: item.ksSettleXfMoney,
          settlementMonth: item.ksSettleMonthMoney,
          siteId: item.station,
          waybillCode: item.waybillCode,
          waybillId: item.waybillId,
          totalWeight: item.totalWeight || 0,
          totalVolume: item.totalVolume || 0,
          totalAmount: item.totalAmount || 0,
          amount: item.amount || 0,
          weight: item.weight || 0,
          volume: item.volume || 0,
          dispatchedWaybillId: item.dispatchedWaybillId,
          dwStatus: item.dwStatus,
          rvCityRgcode: item.rvCityRgcode,
          rvDistrictRgcode: item.rvDistrictRgcode,
          rvProvinceRgcode: item.rvProvinceRgcode,
          sdCityRgcode: item.sdCityRgcode,
          sdDistrictRgcode: item.sdDistrictRgcode,
          sdProvinceRgcode: item.sdProvinceRgcode
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
        // if (fieldVal) {
        let findVal = this.allValues.find(item => item.modelKey === field)
        if (findVal) {
          result.push({
            outgoMoney: fieldVal || 0,
            outgoType: findVal.subDictId,
            tagName: findVal.expenseTag,
            outgoTypeName: findVal.subDictName
          })
        }
        // }
      })
      return result
    },

    plateNumberChange (value) {
      var find = this.plateNumberData.find(item => item.value === value)
      this.form.setFieldsValue({
        truckLength: find ? find.truckLength : undefined,
        truckType: find ? find.truckType : undefined,
        weightLoad: find ? find.weightLoad : undefined
      })
      if (find && find.driverTruckMaps && find.driverTruckMaps.length) {
        let driverItem = find.driverTruckMaps[0] // 取匹配到的第一个司机
        this.form.setFieldsValue({
          driverName: driverItem.driverName,
          mobile: driverItem.mobile
        })
      } else {
        this.form.setFieldsValue({
          driverName: undefined,
          mobile: undefined
        })
      }
    },
    carrierChange (value) {
      this.loadFeeList({
        expenseType: 'NOVCC',
        typePartId: value
      })
    },
    carrierChangeCb (value) {
      this.loadFeeList({
        expenseType: 'NOVCC',
        typePartId: value,
        isClear: true
      })
    },
    handleDriverNameChange (value) {
      var find = this.allDrivers.find(item => item.value === value)
      if (find && find.mobile) {
        this.form.setFieldsValue({
          mobile: find.mobile
        })
      }
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
          this.form.setFieldsValue({ ksSum: sum })

          var summation = 0 // 假如有3条订单，这里面存前2条总和，最后一单 = 总数-前面总和 。 如100/3
          this.selectedRows.forEach((row, rowIndex) => {
            if (row.hasOwnProperty(field)) {
              if (!isNaN(total)) {
                // 每个订单分担的值
                let itemVal = 0
                // 按运单
                if (this.currentCostType === '4') {
                  itemVal = parseFloat(wmath.div(total, orderCount).toFixed(4))
                }
                // 按件数
                if (this.currentCostType === '1') {
                  itemVal = parseFloat(wmath.div(total, this.totalAmount).toFixed(4))
                  itemVal = wmath.mul(itemVal, row.amount || 0)
                }

                // 按重量
                if (this.currentCostType === '2') {
                  itemVal = parseFloat(wmath.div(total, this.totalWeight).toFixed(4))
                  itemVal = wmath.mul(itemVal, row.weight || 0)
                }

                // 按体积
                if (this.currentCostType === '3') {
                  itemVal = parseFloat(wmath.div(total, this.totalVolume).toFixed(4))
                  itemVal = wmath.mul(itemVal, row.volume || 0)
                }

                // 最后一个值单独处理
                if (rowIndex === orderCount - 1) {
                  itemVal = wmath.sub(total, summation)
                }

                // 设置显示字段值
                if (this.currentCostType) {
                  if (currentField) {
                    if (field === currentField) {
                      row[currentField] = itemVal
                    }
                  } else {
                    row[field] = itemVal
                  }
                }

                // 累加之前的值，为了计算最后一个值使用
                summation = wmath.add(summation, itemVal)
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
      row['ksSum'] = this.computeTotalArr.reduce((res, rowField) => {
        if (row[rowField]) {
          res = wmath.add(res, row[rowField])
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
            }
          })
        })
        console.log('feeList', feeList)
        this.form.setFieldsValue({
          'ksSettleXfMoney': ksSettleXfMoney || '',
          'ksSettleDfMoney': ksSettleDfMoney || '',
          'ksSettleMonthMoney': ksSettleMonthMoney || '',
          'ksSum': ksSum || '',
          ...feeList
        })
      }, 310)
    },
    // 更新总额
    updateSumMoney () {
      this.sumMoney = this.selectedRows.reduce((res, item) => {
        res = wmath.add(res, item.ksSum || 0)
        return res
      }, 0)
    },
    // 打印
    printDialogShow () {
      this.printLoading = true
      this.$refs.PrintDialogRef.print([this.currentDispatch])
    },
    lineListLoad (vm) {
      let ids = this.selectedRows.map(item => item.routeId)
      vm.setSelectedRows(ids)
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
      this.currentCostType = ''
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
      this.form.setFieldsValue(fields)
    },
    // 运单详情页
    goDetail (id) {
      this.$router.push({
        name: 'WaybillDetail',
        params: { id: id }
      })
    }
  },
  activated () {
    // this.initPage()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'DispatchList' || to.name === 'RoadLineList') {
      this.$ls.set('pageCatch', true)
    }
    this.clearPageData()
    next()
  },
  watch: {
  },
  computed: {
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

<style lang="less" >
  .mb10{margin-bottom: 10px}
  .mt10{margin-top: 10px}
  .flex{
    display: -webkit-flex;
    display: flex;
    label{
      width: 80px;position: relative;
      text-align: right;
      flex: none;
      strong {
        position: absolute;left: 0;right: 8px;top: 50%;
        transform:translateY(-50%);line-height: 1;font-weight: normal;
      }
      &:after {
        content: ':';position: absolute;right: 0;top: 2px;
      }
    }
  }
  .closeJt{
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }
  .avOrderBtn {
    position: absolute;left: 100px;top: 0;background: transparent;color:#1890ff;border-color: transparent;
    box-shadow: 0 0 0 #000;
  }
  .avOrderBox{
    font-size: 12px;
    display: block;
    overflow: hidden;position: relative;
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
      margin: -10px -11px 0;
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
    // top: 5px;
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
