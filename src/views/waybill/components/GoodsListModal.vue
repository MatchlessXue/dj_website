<template>
  <a-card
    title="货物信息"
    :bordered="false"
  >
    <a-form
      :form="form"
      class="form"
    >
      <a-row
        class="form-row"
        :gutter="0">
        <a-table
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          bordered
          :scroll="{ x: scrollX, y: 300 }">
          <template
            v-for="(col, i) in editColumns"
            :slot="col"
            slot-scope="text, record"
          >
            <div v-if="record.key !== 'sumRow'" :key="col">
              <a-auto-complete
                :key="col"
                v-if="col === 'consignmentName'"
                :dataSource="consignmentMap"
                v-model="record.consignmentName"
                @focus="getConsignmentNameList"
                :filterOption="filterOption"
                @select="e => onSelect(e, record.key)"
                placeholder="货物名称"
                maxlength="30"
              />
              <a-input
                :key="col"
                v-else-if="col === 'consignmentCode'"
                v-model="record.consignmentCode"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
                maxlength="30"
              />
              <a-select
                :key="col"
                v-else-if="col === 'packageType'"
                :placeholder="columns[i].title"
                v-model="record.packageType"
                @change="e => handleChange(e, record.key, col)"
              >
                <a-select-option
                  v-for="packageType in packageTypeList"
                  :key="packageType.dictId"
                >{{packageType.dictName}}</a-select-option>
              </a-select>
              <a-select
                :key="col"
                v-else-if="col === 'consignmentType'"
                :placeholder="columns[i].title"
                v-model="record.consignmentType"
                @change="e => handleChange(e, record.key, col)"
              >
                <a-select-option
                  v-for="cargoType in cargoTypeList"
                  :key="cargoType.dictId"
                >{{cargoType.dictName}}</a-select-option>
              </a-select>
              <a-input
                :key="col"
                v-else-if="col === 'orderAmount'"
                v-model="record.orderAmount"
                placeholder="件数"
                @change="e => amountHandleChange(e.target.value, record.key, col)"
              />
              <a-input
                :key="col"
                v-else-if="col === 'orderTargetWeight'"
                v-model="record.orderTargetWeight"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <a-input
                :key="col"
                v-else-if="col === 'orderTargetVolume'"
                v-model="record.orderTargetVolume"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <a-input
                :key="col"
                v-else-if="col === 'deliveryCode'"
                v-model="record.deliveryCode"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <a-input
                :key="col"
                v-else-if="col === 'consignmentValue'"
                v-model="record.consignmentValue"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <a-input
                :key="col"
                v-else-if="col === 'unitWeight'"
                v-model="record.unitWeight"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <a-input
                :key="col"
                v-else-if="col === 'unitVolume'"
                v-model="record.unitVolume"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <a-input
                :key="col"
                v-else-if="col === 'remark'"
                v-model="record.remark"
                :placeholder="columns[i].title"
                @change="e => handleChange(e.target.value, record.key, col)"
                maxlength="50"
              />
              <span :key="col" v-else-if="col === 'sequenceId'">{{record.sequenceId}}</span>
            </div>
            <div v-else :key="col">
              <span :key="col" v-if="col === 'sequenceId'">{{record.sequenceId}}</span>
              <span :key="col" v-else-if="col === 'orderAmount'">{{record.orderAmount}}</span>
              <span :key="col" v-else-if="col === 'orderTargetWeight'">{{record.orderTargetWeight}}</span>
              <span :key="col" v-else-if="col === 'orderTargetVolume'">{{record.orderTargetVolume}}</span>
              <span :key="col" v-else-if="col === 'consignmentValue'">{{record.consignmentValue}}</span>
              <span :key="col" v-else-if="col === 'unitWeight'">{{record.unitWeight}}</span>
              <span :key="col" v-else-if="col === 'unitVolume'">{{record.unitVolume}}</span>
            </div>
          </template>
          <template
            slot="operation"
            slot-scope="record"
          >
            <span v-show="record.key !== 'sumRow'">
                <a @click="newMember()">添加</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="是否要删除此行？"
                  @confirm="remove(record.key)"
                  v-if="delShow"
                >
                  <a>删除</a>
                </a-popconfirm>
            </span>
          </template>
          <span slot="consignmentNameTitle">
            <span style="color:red" > * </span>货物名称
          </span>
          <span slot="orderAmountTitle">
            <span style="color:red" > * </span>件数
          </span>
        </a-table>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { deepClone, countCollumnsWidth } from '@/utils/util'
import { throttle, trim } from 'lodash'
import { simpleList, getCargoById } from '@/api/resource/cargo'

import {
  getPackageTypeByDataStatus,
  getCargoTypeByDataStatus
} from '@/api/libraries'
export default {
  name: 'GoodsListModal',
  props: {
    incomesdata: {
      type: Object,
      default () {
        return {}
      }
    },
    currentId: {
      type: String,
      default () {}
    }
  },
  components: {
  },
  watch: {
    incomesdata: {
      deep: true,
      handler: function (val) {
        if (
          val !== undefined &&
          val !== null &&
          val.consignments !== null &&
          val.consignments.length > 0
        ) {
          val.consignments.forEach(function (item, i) {
            item.key = `${i}`
            item.sequenceId = i + 1
            item.packageType = item.packageType === 0 ? '' : item.packageType
            item.consignmentType = item.consignmentType === 0 ? '' : item.consignmentType
          })
          this.priceunitVal = val.priceUnit
          this.currentPartnerId = val.partnerId
          this.data = deepClone(val.consignments)
          // if (this.data && this.data.filter(goodInfo => goodInfo.key !== 'sumRow').length > 1) {
          //   this.delShow = true
          // }
          /**
           * 将请求回来的货物，存到vuex中
           */
          this.setCargoInfo(this.data)
          this.addKeyVal = this.data.length
          this.calculationSub()
          this.refreshSumRow()
        }
      }
    },
    currentId: {
      handler: function (val) {
        this.currentPartnerId = val
        if (!this.currentPartnerId) {
          this.consignmentMap = []
        }
      }
    },
    getPrice: {
      handler: function (val) {
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].unitPrice = val
        }
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      goodsListPageSelectvisible: false,
      consignmentName: '',
      cargoId: '',
      consignmentList: [],
      consignmentMap: [],
      editColumns: [
        'sequenceId',
        'consignmentName',
        'consignmentCode',
        'packageType',
        'consignmentType',
        'orderAmount',
        'orderTargetWeight',
        'orderTargetVolume',
        'deliveryCode',
        'consignmentValue',
        'unitWeight',
        'unitVolume',
        'remark'
      ],
      // table
      columns: [
        {
          title: '序号',
          dataIndex: 'sequenceId',
          width: 150
        },
        {
          dataIndex: 'consignmentName',
          width: 150,
          slots: { title: 'consignmentNameTitle' },
          scopedSlots: { customRender: 'consignmentName' }
        },
        {
          title: '货物代码',
          dataIndex: 'consignmentCode',
          width: 150,
          scopedSlots: { customRender: 'consignmentCode' }
          // fixed: 'left'
        },
        {
          title: '货物包装',
          dataIndex: 'packageType',
          width: 150,
          scopedSlots: { customRender: 'packageType' }
        },
        {
          title: '货物类型',
          dataIndex: 'consignmentType',
          width: 150,
          scopedSlots: { customRender: 'consignmentType' }
        },
        {
          dataIndex: 'orderAmount',
          width: 150,
          slots: { title: 'orderAmountTitle' },
          scopedSlots: { customRender: 'orderAmount' }
        },
        {
          title: '重量(kg)',
          dataIndex: 'orderTargetWeight',
          width: 150,
          scopedSlots: { customRender: 'orderTargetWeight' }
        },
        {
          title: '体积(m³)',
          dataIndex: 'orderTargetVolume',
          width: 150,
          scopedSlots: { customRender: 'orderTargetVolume' }
        },
        // {
        //   title: '单价',
        //   dataIndex: 'unitPrice',
        //   width: 150,
        //   scopedSlots: { customRender: 'unitPrice' }
        // },
        // {
        //   title: '运费',
        //   dataIndex: 'totalPrice',
        //   width: 150,
        //   scopedSlots: { customRender: 'totalPrice' }
        // },
        {
          title: '交货单号',
          dataIndex: 'deliveryCode',
          width: 150,
          scopedSlots: { customRender: 'deliveryCode' }
        },
        {
          title: '申明价值',
          dataIndex: 'consignmentValue',
          width: 150,
          scopedSlots: { customRender: 'consignmentValue' }
        },
        {
          title: '单件重量',
          dataIndex: 'unitWeight',
          width: 150,
          scopedSlots: { customRender: 'unitWeight' }
        },
        {
          title: '单件体积',
          dataIndex: 'unitVolume',
          width: 150,
          scopedSlots: { customRender: 'unitVolume' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 150,
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          scopedSlots: { customRender: 'operation' },
          fixed: 'right'
        }
      ],
      addKeyVal: 0,
      priceunitVal: 0,
      data: [],
      packageTypeList: [],
      cargoTypeList: [],
      currentPartnerId: this.currentId
    }
  },
  mounted () {
    this.getCargoTypeList()
    this.getPackageTypeList()
    this.newMember()
  },
  computed: {
    ...mapGetters('waybill', ['getPrice', 'getPartnerId']),
    scrollX () {
      return countCollumnsWidth(this.columns)
    },
    delShow () {
      return this.data.filter(goodInfo => goodInfo.key !== 'sumRow').length !== 1
    }
  },
  methods: {
    ...mapActions('waybill', ['setTotal', 'setCargoInfo']),
    // 获取货物类型数据
    getCargoTypeList () {
      let param = {
        partnerId: this.currentPartnerId
      }
      getCargoTypeByDataStatus(param).then(res => {
        this.cargoTypeList = res.data
      })
    },
    // 获取货物包装数据
    getPackageTypeList () {
      let param = {
        partnerId: this.currentPartnerId
      }
      getPackageTypeByDataStatus(param).then(res => {
        this.packageTypeList = res.data
      })
    },
    // 刷新总计行
    refreshSumRow () {
      const sumRowIndex = this.data.findIndex(goodInfo => goodInfo.key === 'sumRow')
      sumRowIndex >= 0 && this.data.splice(sumRowIndex, 1)
      const sumRow = {
        key: 'sumRow',
        sequenceId: '合计',
        orderAmount: 0,
        orderTargetWeight: 0,
        orderTargetVolume: 0,
        consignmentValue: 0,
        unitWeight: 0,
        unitVolume: 0
      }
      this.data.forEach((goodInfo, index) => {
        goodInfo.sequenceId = `${index + 1}`
        sumRow.orderAmount += Number(goodInfo.orderAmount || 0)
        sumRow.orderTargetWeight += Number(goodInfo.orderTargetWeight || 0)
        sumRow.orderTargetVolume += Number(goodInfo.orderTargetVolume || 0)
        sumRow.consignmentValue += Number(goodInfo.consignmentValue || 0)
        sumRow.unitWeight += Number(goodInfo.unitWeight || 0)
        sumRow.unitVolume += Number(goodInfo.unitVolume || 0)
      })
      this.data.push(sumRow)
    },
    handleGetdata () {
      // 获取组件数据
      // 提交时货物信息列表去除合计行
      const actualGoodsData = this.data.filter(goodInfo => goodInfo.key !== 'sumRow')
      return deepClone(actualGoodsData)
    },
    // 删除货物列表中数据
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      // if (this.data.length === 1) {
      //   this.delShow = false
      // }
      this.refreshSumRow()
    },
    // 选择货物列表弹窗关闭
    handlegoodsselectclose () {
      this.goodsListPageSelectvisible = false
    },
    // 选择货物列表弹窗打开
    handlegoodsselectopen () {
      if (this.currentPartnerId !== '') {
        this.goodsListPageSelectvisible = true
      } else {
        this.$message.error('请选择客户名称')
      }
    },
    // 新建货物明细行
    newMember () {
      /**
       * 更改了key -1 直接key值得花。会导致key不连续。
       */
      this.addKeyVal++
      var key = this.addKeyVal
      this.data.push({
        key: `${key - 1}`,
        sequenceId: `${key}`,
        consignmentName: '',
        consignmentCode: '',
        packageType: null,
        consignmentType: null,
        orderAmount: 0, //
        orderTargetWeight: 0, //
        orderTargetVolume: Number(0), //
        // unitPrice: Number(0), // 单价
        // totalPrice: Number(0), //
        deliveryCode: null, //
        consignmentValue: null, //
        unitWeight: 0, // 单件重量
        unitVolume: 0, // 单件体积
        remark: ''
      })
      // if (this.data.length > 1) {
      //   this.delShow = true
      // }
      this.$nextTick(() => {
        this.form = this.$form.createForm(this)
        this.refreshSumRow()
      })
      /**
       * 手动新增货物后，将将相关的货物数据储存起来
       */
    },
    amountHandleChange (value, key, column) {
      const target = this.data.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data.forEach(function (item, i) {
          if (item.key === target.key && item.orderAmount !== null && item.orderAmount >= 0) {
            if (item.unitWeight && item.unitWeight >= 0) {
              item.orderTargetWeight = target.orderAmount * item.unitWeight
            }
            if (item.unitVolume && item.unitVolume >= 0) {
              item.orderTargetVolume = target.orderAmount * item.unitVolume
            }
          }
        })
        this.setCargoInfo(this.data)
      }
      this.refreshSumRow()
    },
    // 货物明细列表数据修改触发事件
    handleChange (value, key, column) {
      /**
       * value 为值
       * key 为行值
       * column 为相关列
       * 改变数据后将相关的数据存储下来
       */
      const target = this.data.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.calculationSub()
      }
      /**
       * 数据改变后将相关的数据存起来
       */
      this.setCargoInfo(this.data)
      this.refreshSumRow()
    },
    // 计算货物运费
    calculationSub () {
      var priceunitValtemp = this.priceunitVal
      this.data.forEach(function (item, i) {
        if (
          item.orderAmount !== null &&
          item.orderAmount >= 0 &&
          item.unitPrice !== null &&
          item.unitPrice >= 0
        ) {
          switch (priceunitValtemp) {
            case 1: // 件
              item.totalPrice = item.orderAmount * item.unitPrice
              break
            case 2: // 重量
              item.orderTargetWeight = item.orderAmount * item.unitWeight
              item.totalPrice = item.unitPrice * item.orderTargetWeight
              break
            case 3: // 体积
              item.orderTargetVolume = item.orderAmount * item.unitVolume
              item.totalPrice = item.unitPrice * item.orderTargetVolume
              break
            // case 4: // 件
            //   item.totalPrice = item.orderAmount * item.unitPrice
            //   break
            default:
              // 其他
              item.totalPrice = 0
              break
          }
        }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getConsignmentNameList: throttle(async function (v) {
      if (this.currentPartnerId === '') {
        return
      }
      /**
       * 删除了货物名称后，将货物名称的id清空
       * 1.1.1里面默认获取拉取全部内容
       */
      // if (v === '') {
      //   this.consignmentMap = []
      //   return
      // }
      const key = trim(v)
      // 查询级联列表
      var respone = await simpleList({
        cargoName: key,
        partnerId: this.currentPartnerId
      })
      const datas = respone.data || []
      this.consignmentList = datas
      // 用于级联的下拉列表的显示只能是如下格式
      let source = []
      datas.forEach(val => {
        source.push({ value: val.cargoId, text: val.cargoName })
      })
      this.consignmentMap = source
    }, 500),
    onSelect (optionKey, recordKey) {
      this.cargoId = optionKey
      const self = this
      getCargoById({
        cargoId: this.cargoId
      }).then(res => {
        if (res.data) {
          var detail = res.data
          self.data.forEach(function (item, i) {
            if (recordKey === item.key) {
              item.consignmentName = detail.cargoName // 货物名称
              item.consignmentCode = detail.cargoCode // 货物代码
              item.packageType = detail.packageType // 货物包装
              item.consignmentType = detail.cargoType // 货物类型
              item.orderAmount = 0 //
              item.orderTargetWeight = 0 //
              item.orderTargetVolume = 0 //
              item.deliveryCode = null //
              item.consignmentValue = null //
              item.unitWeight = Number(detail.weightCustom) // 单件重量
              item.unitVolume = Number(detail.volumeCustom) // 单件体积
              item.remark = null //
            }
          })
          this.setCargoInfo(this.data)
        }
      })
      for (let i = 0; i < this.consignmentList.length; i++) {
        if (String(optionKey) === this.consignmentList[i].cargoId) {
          this.consignmentName = this.consignmentList[i].cargoName
        }
      }
    }
  }
}
</script>
