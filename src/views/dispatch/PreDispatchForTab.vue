<template>
  <div class="page-container">
    <back-btn title="返回上一级" />
    <!-- 自定义线路 -->
    <a-card
      v-if="type === 'line'"
      class="card-container"
      :bordered="false"
      style="margin-top:10px;"
    >
      <a-row>
        <a-col :lg="2" :md="4">
          <strong>线路信息：</strong>
        </a-col>
        <a-col :span="14">
          <a-select
            v-for="(item, idx) in linesNumber"
            placeholder="中转站"
            :key="idx"
            style="width:150px;margin:0 10px 10px 0"
            allowClear
            showSearch
            :filterOption="filterOption"
            :value="
              idx === 0
                ? currentSiteId
                : item.siteId === ''
                ? undefined
                : item.siteId
            "
            :disabled="item.disabled"
            @change="v => selectLineSite(v, item)"
          >
            <a-select-option
              v-for="site in siteOptions"
              :key="site.siteId"
              :value="site.siteId"
              :disabled="getEnabledSite(site.siteId)||site.siteId === currentSiteId"
            >
              {{ site.siteName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-button type="primary" @click="addLineSite">添加</a-button>
          <a-button
            type="primary"
            @click="removeLineSite"
            style="margin-left:10px;"
            >删除</a-button
          >
        </a-col>
      </a-row>
    </a-card>

    <a-card class="card-container" :bordered="false" style="margin-top:10px;">
      <!-- TABLE -->
      <a-table
        :loading="tableLoading"
        :columns="preDispatchColumns"
        :dataSource="preDispatchData"
        :pagination="false"
        :rowKey="record => record.waybillId"
      >
        <!-- type=line 线路 -->
        <span
          v-if="type === 'line'"
          slot="lineRoad"
          slot-scope="text, record"
        >
          {{ `${record.sdAddressName}-${record.rvAddressName}` }}
        </span>
        <!--计费方式 || 直达 || 中转站-->
        <a-select
          labelInValue
          placeholder="请选择计费方式"
          style="width:150px"
          slot="charging"
          slot-scope="text, record"
          @select="v => rowSelectChange(v, 'charging', record)"
        >
          <a-select-option v-for="op in priceUnitMap" :key="op.dictId">{{
            op.dictName
          }}</a-select-option>
        </a-select>
        <!-- 是否直送||末端配送 -->
        <a-checkbox
          v-if="type !== 'delivery'"
          slot="destination"
          slot-scope="text, record"
          @change="
            v => rowSelectChange(v.target.checked, 'destination', record)
          "
        ></a-checkbox>
        <!-- 选择中转站 -->
        <template slot="rvSite" slot-scope="text, record">
          <a-select
            v-if="type === 'line'"
            placeholder="请选择中转站"
            showSearch
            allowClear
            style="width:150px"
            optionFilterProp="children"
            :filterOption="filterOption"
            @change="v => rowSelectChange(v, 'rvSite', record)"
          >
            <a-select-option
              v-for="site in filterLineSite"
              :key="site.siteId"
              :disabled="site.siteId === currentSiteId"
            >
              {{ site.siteName }}
            </a-select-option>
          </a-select>
          <a-select
            v-else-if="type === 'goods'"
            placeholder="请选择中转站"
            showSearch
            allowClear
            style="width:150px"
            optionFilterProp="children"
            :filterOption="filterOption"
            @change="v => rowSelectChange(v, 'rvSite', record)"
          >
            <a-select-option
              v-for="site in siteOptions"
              :key="site.siteId"
              :disabled="site.siteId === currentSiteId"
            >
              {{ site.siteName }}
            </a-select-option>
          </a-select>
        </template>
        <!-- 操作 -->
        <confirm-info
          slot="operation"
          slot-scope="text, record, index"
          title="确认删除这条记录么"
          content="删除"
          @onconfirm="e => removeDataRow(record, index)"
        />
        <!-- 子表 -->
        <expanded-table
          slot="expandedRowRender"
          slot-scope="expandedRecord"
          :waybillId="expandedRecord.waybillId"
          :innerData="innerData"
          @selectGoodsItem="selectGoodsItem(arguments, expandedRecord)"
        ></expanded-table>
      </a-table>
      <!-- TABLE OPTIONS -->
      <div class="table-page-option-wrapper dispatch">
        <a-row :gutter="24">
          <a-col>
            <span>总计：{{ getWeightMoreNumber.count }}条数据</span>
            <a-divider type="vertical" />
            <span>载重(kg)：{{ getWeightMoreNumber.weight }}kg</span>
            <a-divider type="vertical" />
            <span>载方(m³)：{{ getWeightMoreNumber.volume }}m³</span>

            <a-button
              icon="plus"
              style="margin-left:25px"
              @click="$refs.truckModal.visible = true"
              type="primary"
              >找车辆</a-button
            >

            <a-button
              icon="plus"
              @click="$refs.companyModal.visible = true"
              type="primary"
              >找承运商</a-button
            >
          </a-col>
        </a-row>
      </div>
      <a-divider />
      <!-- 承运商或者司机 -->
      <a-row>
        <a-col :sm="24" :md="12" :xl="6"
          >承运商名称：{{
            transporter.company ? transporter.company.label : ''
          }}</a-col
        >
        <a-col :sm="24" :md="12" :xl="6"
          >：{{ transporter.truckNo }}</a-col
        >
        <a-col :sm="24" :md="12" :xl="6"
          >司机姓名：{{ transporter.driverName }}</a-col
        >
        <a-col :sm="24" :md="12" :xl="6"
          >司机手机号：{{ transporter.mobile }}</a-col
        >
      </a-row>
      <a-row>
        <a-col style="padding:20px 0"
          >备注：
          <a-input
            type="text"
            placeholder="请输入备注信息"
            style="width:300px;"
            v-model="remark"
          />
        </a-col>
      </a-row>
    </a-card>
    <!-- MODAL -->
    <company-modal ref="companyModal" @ok="chooseCompany"></company-modal>
    <truck-modal ref="truckModal" @ok="chooseTruck"></truck-modal>
    <!-- fixed footer toolbar -->
    <footer-tool-bar
      align="center"
      :style="{
        width:
          isSideMenu() && isDesktop()
            ? `calc(100% - ${sidebarOpened ? 256 : 80}px)`
            : '100%'
      }"
    >
      <a-button @click="cancel">取消</a-button> &nbsp;&nbsp;
      <a-button type="primary" @click="submit" :loading="loading">
        计算费用
      </a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import pick from 'lodash.pick'
// import _get from 'lodash.get'

import ExpandedTable from './components/ExpandedTable'
import CompanyModal from './components/CompanyModal'
import TruckModal from './components/TruckModal'
import FooterToolBar from '@/components/FooterToolbar'
import BackBtn from '@/components/BackBtn'
import ConfirmInfo from '@/components/ConfirmInfo'

import { getGoodsByCode } from '@/api/dispatch/dispatch'
import { matchDispatch } from '@/api/resource/contract'

import { mixin, mixinDevice } from '@/utils/mixin'
import librariesBase from '@views/mixins/libraries_base'
import siteCollection from './mixins/site_collection'
import { getColumns } from './variable'

export default {
  name: 'PreDispatchForTab',
  mixins: [siteCollection, librariesBase, mixin, mixinDevice],
  components: {
    ExpandedTable,
    CompanyModal,
    TruckModal,
    FooterToolBar,
    BackBtn,
    ConfirmInfo
  },
  data () {
    return {
      loading: false,
      tableLoading: false,
      type: this.$route.params.type,
      currentSiteId: '', // 发货站点 ，中转站不可选择发货站点
      currentSiteName: '',

      linesNumber: [], // 添加的线路 的选择框 队列
      filterLineSite: [], // 干线调度时的选择后的线路列表

      preDispatchColumns: [], // 表列
      preDispatchData: [], // 初始表单数据
      innerData: [], // 被折叠表数据
      waybillIdArray: [], // 折叠数据中所有列

      preDispatchDataFinal: [], // 最终选中的有效运单行数据
      transporter: {}, // 车辆或者承运商对象
      selectedGoodsList: {}, // 已选择货物们的对象
      selectedGoodsArray: [], // 已选择货物们抹平后的一维数组
      surplusConsignment: [], // 剩余货物数组
      remark: '' // 备注
    }
  },
  created () {
    this.preDispatchColumns = getColumns(this.type)
    this.preDispatchData = this.getPreDispatchData

    this.currentSiteId = this.preDispatchData[0].siteId
    this.currentSiteName = this.preDispatchData[0].siteName
    this.linesNumber.push({
      disabled: true,
      siteId: this.currentSiteId,
      siteName: this.currentSiteName
    })

    this.getGoodsList() // 获取货物列表
    this.getPriceUnitMap() // 计费单位
    this.getTransportTypeMap() // 运输类型
  },
  computed: {
    ...mapGetters(['tenantId', 'getPreDispatchData']),
    // 获取总重量体积等信息
    getWeightMoreNumber () {
      let obj = Object.keys(this.selectedGoodsList)
      let arr = []
      let amount = 0
      // let count = 0
      let weight = 0
      let volume = 0
      obj.map(key => {
        arr.push(...this.selectedGoodsList[key])
      })
      arr.forEach(item => {
        amount += item.storedAmount
        weight += item.singleStoredWeight * item.storedAmount
        volume += item.singleStoredVolume * item.storedAmount
      })
      return { count: arr.length, weight, volume, amount }
    },
    // 过滤不能使用的项目
    getEnabledSite () {
      return function (sid) {
        return this.filterLineSite.some(item => {
          return item.siteId === sid
        })
      }
    }
  },
  methods: {
    ...mapActions(['setPreDispatchFinalData']),
    // 根据运单id数组获取货物列表
    async getGoodsList () {
      this.preDispatchData.map(item => {
        this.waybillIdArray.push(item.waybillId)
        this.selectedGoodsList = Object.assign({}, this.selectedGoodsList, {
          [item.waybillId]: []
        })
      })
      this.tableLoading = true
      let siteType = this.type === 'goods' ? 1 : this.type === 'line' ? 2 : 3
      let res = await getGoodsByCode({ siteType, waybillIds: this.waybillIdArray })
      //
      // 在货物列表中获取省市区信息 注入到 preDispatchData中
      res.data.map(item => {
        this.innerData.push(...item.storedConsignments)

        this.preDispatchData.map(tm => {
          if (tm.waybillId === item.waybillId) {
            tm.rvProvinceRgcode = item.rvProvinceRgcode
            tm.rvCityRgcode = item.rvCityRgcode
            tm.rvDistrictRgcode = item.rvDistrictRgcode

            tm.sdProvinceRgcode = item.sdProvinceRgcode
            tm.sdCityRgcode = item.sdCityRgcode
            tm.sdDistrictRgcode = item.sdDistrictRgcode
          }
        })
      })

      console.log('preDispatchData', this.preDispatchData)
      // 新增一个实际数量
      this.innerData.forEach(item => {
        item.actAmount = item.storedAmount
      })
      this.tableLoading = false
    },
    // 提交计算费用
    async submit () {
      this.loading = true
      this.getSurGoods() // 获取剩余 、抹平选中数组
      this.getActiveRow() // 获取有效行
      // 计费方式，单价，备注信息，运输对象，剩余货物，运单行数据，选择的货物的数组
      let key = [
        'remark',
        'transporter',
        'surplusConsignment',
        'preDispatchDataFinal',
        'selectedGoodsArray'
      ]
      // 验证后跳转
      if (this.validate()) {
        // 如果是承运商 匹配合同
        if (this.transporter.company) {
          await this.matchContract()
        }
        // 整理数据
        let obj = Object.assign({}, pick(this, ...key))
        obj.countObj = this.getWeightMoreNumber // 总件重体数据
        // 线路信息数据
        if (this.type === 'line') {
          this.filterLineSite.push({
            disabled: true,
            siteId: this.currentSiteId
          }) // 将当前id放入线路列表
          let lines = []
          let fArray = this.filterLineSite
          fArray.reduce((a, b) => {
            lines.push({ siteAid: a.siteId, siteZid: b.siteId })
            return b
          })
          obj.lineList = lines
        }
        // set数据
        this.setPreDispatchFinalData(obj).then(() => {
          this.$router.push({
            name: 'PreDispatchForFinal',
            params: { type: `${this.type}final` }
          })
        })
      }
      this.loading = false
    },
    // 验证
    validate () {
      // 验证数据
      let msg = ''
      if (!this.transporter.tranType) {
        msg = '请添加承运商或车辆'
      } else if (this.selectedGoodsArray.length <= 0) {
        msg = '请选择货物'
      }
      this.preDispatchDataFinal.every(data => {
        if (!data.charging) {
          // 运单行的计费单位是否选择
          msg = '请选择运单的计费方式'
        }
        if (this.type !== 'delivery' && !data.destination && !data.rvSite) {
          // 运单行的计费单位是否选择
          msg = '请选择运单的中转站'
        }
        return msg === ''
      })
      msg !== '' && this.$message.error(msg)
      return msg === ''
    },
    // 匹配合同价格
    async matchContract () {
      let waybillList = this.getWaybillArrayForContract()
      let params = {
        tenantId: this.tenantId,
        partnerId: this.transporter.company.key,
        transportType: this.transporter.transportType.key,
        waybillList
      }
      let res = await matchDispatch(params)
      console.log('matchDispatch', res)

      if (res.data.isOk) {
        let chargeArray = res.data.waybillList
        chargeArray.forEach(item => {
          let objs = Object.assign(pick(item, 'freight', 'deliveryFee', 'pickupCharge', 'unloadingCharge'))
          let result = Object.values(objs).reduce((a, b) => { return a + b })
          this.$set(item, 'summaryCharge', result)

          this.preDispatchDataFinal.forEach((j, i) => {
            if (j.waybillId === item.waybillId) {
              let cObj = { contractName: item.contractName, yf: item.freight, shf: item.deliveryFee, thf: item.pickupCharge, xhf: item.unloadingCharge, summaryCharge: item.summaryCharge }
              this.preDispatchDataFinal[i] = Object.assign({}, j, cObj)
            }
          })
        })
      }
    },
    // 遍历获取运单列表关键数据
    getWaybillArrayForContract () {
      let waybillArray = []
      this.preDispatchDataFinal.map(fd => {
        let amount = 0 // 货物总件数，总体积，总重量
        let volume = 0
        let weightLoad = 0

        this.selectedGoodsList[fd.waybillId].map(item => {
          amount += item.storedAmount
          volume += item.singleStoredVolume * item.storedAmount
          weightLoad += item.singleStoredWeight * item.storedAmount
        })
        // 最终单个运单数据对象
        let Obj = {
          priceUnit: fd.charging.key,
          waybillId: fd.waybillId,
          rvProvinceRgcode: fd.rvProvinceRgcode, // 省市区
          rvCityRgcode: fd.rvCityRgcode,
          rvDistrictRgcode: fd.rvDistrictRgcode,
          sdProvinceRgcode: fd.sdProvinceRgcode,
          sdCityRgcode: fd.sdCityRgcode,
          sdDistrictRgcode: fd.sdDistrictRgcode,
          amount,
          volume,
          weightLoad,
          transportDate: fd.transportDate // 开单日期(托运日期)
        }
        waybillArray.push(Obj)
      })
      return waybillArray
    },
    // 获取运单货物选择后剩余的 数组
    getSurGoods () {
      let obj = Object.keys(this.selectedGoodsList)
      let arr = []
      obj.map(key => {
        arr.push(...this.selectedGoodsList[key])
      })
      this.selectedGoodsArray = arr
      this.surplusConsignment = []
      // 对比pick的货物与所有货物，取出每张运单中还剩余货物
      arr.forEach(i => {
        this.innerData.forEach(j => {
          if (
            j.consignmentId === i.consignmentId &&
            j.actAmount >= i.storedAmount
          ) {
            let storedAmount = j.actAmount - i.storedAmount // 剩余件数
            let storedVolume = storedAmount * j.singleStoredVolume // 剩余体积
            let storedWeight = storedAmount * j.singleStoredWeight // 剩余重量
            this.surplusConsignment.push({
              waybillId: j.waybillId,
              consignmentId: j.consignmentId,
              storedAmount,
              storedVolume,
              storedWeight
            })
          }
        })
      })

      console.log('surplusConsignment', this.surplusConsignment)
    },
    // 遍历获取有效运单行（有些行没有被选中货物）
    getActiveRow () {
      this.preDispatchDataFinal = []
      Object.keys(this.selectedGoodsList).map(item => {
        if (this.selectedGoodsList[item].length > 0) {
          this.preDispatchData.map(j => {
            if (item === j.waybillId) {
              this.preDispatchDataFinal.push(j)
            }
          })
        }
      })
    },
    // 删除运单行
    removeDataRow (row, index) {
      this.preDispatchData.splice(index, 1)
      this.selectedGoodsList[row.waybillId] = []
      console.log(this.selectedGoodsList)
    },
    // 添加线路中转站
    addLineSite () {
      this.linesNumber.push({ disabled: false, siteId: '', siteName: '' })
    },
    // 删除线路中转站
    removeLineSite () {
      if (this.linesNumber.length <= 1) return false

      let count = this.linesNumber.length - 1
      if (this.linesNumber[count].disabled) {
        // 队列最后的一项如果是被选过的，需要重置相关数据
        let id = this.linesNumber[count].siteId
        let index = this.filterLineSite.findIndex(item => {
          // 删除被过滤数组中的对象
          return item.siteId === id
        })
        if (index >= 0) {
          this.filterLineSite.splice(index, 1)
        }
        // 已选的给清空掉
        this.preDispatchData.map(o => {
          if (o.rvSite === id) {
            o.rvSite = null
          }
        })
      }
      this.linesNumber.splice(count, 1)
    },
    // 选择顶部线路信息下拉框中转站
    selectLineSite (val, itemObj) {
      itemObj.disabled = true
      itemObj.siteId = val

      let isIn = this.filterLineSite.filter(i => {
        return i.siteId === val
      })
      if (isIn.length <= 0) {
        // 不在被过滤数组中的话
        let item = this.siteOptions.filter(i => {
          return i.siteId === val
        })
        this.filterLineSite.push(...item)
      }
    },
    // 选择货物
    selectGoodsItem (arg, parent) {
      this.selectedGoodsList[parent.waybillId] = arg[0]
    },
    // 计费方式、直送 Change
    rowSelectChange (v, clm, row) {
      row[clm] = v
    },
    // 选择公司
    chooseCompany (values) {
      if (values.takeTime) {
        values.takeTime = values.takeTime.format('YYYY-MM-DD HH:mm:ss')
      }
      if (values.deliveryTime) {
        values.deliveryTime = values.deliveryTime.format('YYYY-MM-DD HH:mm:ss')
      }
      this.transporter = Object.assign({ tranType: 1 }, values) // 1为找承运商
      console.log(this.transporter)
    },
    // 选择车辆
    chooseTruck (values) {
      if (values.takeTime) {
        values.takeTime = values.takeTime.format('YYYY-MM-DD HH:mm:ss')
      }
      if (values.deliveryTime) {
        values.deliveryTime = values.deliveryTime.format('YYYY-MM-DD HH:mm:ss')
      }
      this.transporter = Object.assign({ tranType: 2 }, values) // 2为找司机
      console.log(this.transporter)
    },
    // 取消
    cancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-option-wrapper.dispatch {
  text-align: right;
  margin-top: 10px;
  .ant-btn {
    margin: 0 8px;
  }
  .ant-divider {
    margin: 10px;
  }
}
</style>
