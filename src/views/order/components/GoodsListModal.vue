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
        :gutter="60"
      >

        <a-table
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          bordered
          :scroll="{ x: scrollX, y: 300 }"
        >
          <template
            v-for="(col, i) in editColumns"
            :slot="col"
            slot-scope="text, record"
          >

            <a-input
              :key="col"
              v-if="col === 'consignmentName'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`,{
            rules: [{ required: true, message: '请输入'+columns[i].title+'!' }]}]"
              @change="e => handleChange(e.target.value, record.key, col)"
              maxlength="30"
            />
            <a-input
              :key="col"
              v-else-if="col === 'consignmentCode'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
              maxlength="30"
            />
            <a-select
              :key="col"
              v-else-if="col === 'packageType'"
              :placeholder="columns[i].title"
              :value="text"
              v-decorator="[ `${col}${record.key}`]"
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
              :value="text"
              v-decorator="[ `${col}${record.key}`]"
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
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
              :key="col"
              v-else-if="col === 'orderTargetWeight'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
              :key="col"
              v-else-if="col === 'orderTargetVolume'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
              :key="col"
              v-else-if="col === 'deliveryCode'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
              :key="col"
              v-else-if="col === 'consignmentValue'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
              :key="col"
              v-else-if="col === 'unitWeight'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
              :key="col"
              v-else-if="col === 'unitVolume'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
              :key="col"
              v-else-if="col === 'remark'"
              :value="text"
              :placeholder="columns[i].title"
              v-decorator="[ `${col}${record.key}`]"
              @change="e => handleChange(e.target.value, record.key, col)"
              maxlength="50"
            />
          </template>
          <template
            slot="operation"
            slot-scope="record"
          >
            <span>
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="remove(record.key)"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-row>
      <a-row
        class="form-row"
        style=" margin-top: 16px; "
        :gutter="60"
      >
        <a-col :sm="12">
          <a-button
            style="width: 100%;"
            type="dashed"
            icon="plus"
            @click="newMember"
          >新增货物</a-button>
        </a-col>
        <a-col :sm="12">
          <a-button
            style="width: 100%; border-color: #1890ff;color: #1890ff;"
            type="dashed"
            icon="search"
            @click="handlegoodsselectopen"
          >选择现有货物</a-button>
        </a-col>
      </a-row>
    </a-form>
    <goods-list-page-select-modal
      :goodsListPageSelectvisible="goodsListPageSelectvisible"
      :currentId="currentPartnerId"
      @handlegoodsselectclose="handlegoodsselectclose"
      @handleSelectRows="handleSelectRows"
    />
  </a-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { deepClone, countCollumnsWidth } from '@/utils/util'

import GoodsListPageSelectModal from './GoodsListPageSelectModal' // 货物信息
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
    GoodsListPageSelectModal
  },
  watch: {
    incomesdata: {
      deep: true,
      handler: function (val) {
        console.log(11, val)
        if (
          val !== undefined &&
          val !== null &&
          val.consignments !== null &&
          val.consignments.length > 0
        ) {
          val.consignments.forEach(function (item, i) {
            item.key = i
          })
          console.log('incomesdata-val', val)
          this.priceunitVal = val.priceUnit
          this.data = deepClone(val.consignments)
          /**
           * 将请求回来的货物，存到vuex中
           */
          this.setCargoInfo(this.data)

          this.addKeyVal = this.data.length
          // this.data = val.consignments
          this.calculationSub()
          this.form.setFieldsValue(this.data)
        }
      }
    },
    currentId: {
      handler: function (val) {
        // console.log('货物模块', val)
        this.currentPartnerId = val
      }
    },
    getPrice: {
      handler: function (val) {
        // console.log('get', val)
        console.log(this.data)
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
      editColumns: [
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
          title: '货物名称',
          dataIndex: 'consignmentName',
          width: 150,
          scopedSlots: { customRender: 'consignmentName' }
          // fixed: 'left'
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
          title: '件数',
          dataIndex: 'orderAmount',
          width: 150,
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
          width: 80,
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
  },
  computed: {
    ...mapGetters('waybill', ['getPrice', 'getPartnerId']),
    scrollX () {
      return countCollumnsWidth(this.columns)
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
        // console.log('cargoTypeList', this.cargoTypeList)
      })
    },
    // 获取货物包装数据
    getPackageTypeList () {
      let param = {
        partnerId: this.currentPartnerId
      }
      getPackageTypeByDataStatus(param).then(res => {
        this.packageTypeList = res.data
        // console.log('packageTypeList', this.packageTypeList)
      })
    },
    // 弹窗选择货物返回触发
    handleSelectRows (rows) {
      // console.log('rows', rows)
      if (rows !== null && rows !== undefined && rows.length > 0) {
        var tempdata = this.data
        var tempaddKeyVal = this.addKeyVal
        rows.forEach(function (item, i) {
          tempaddKeyVal++
          var key = tempaddKeyVal
          tempdata.push({
            key: key - 1,
            consignmentName: item.cargoName, // 货物名称
            consignmentCode: item.cargoCode, // 货物代码
            packageType: item.packageType, // 货物包装
            consignmentType: item.cargoType, // 货物类型
            orderAmount: 0, //
            orderTargetWeight: 0, //
            orderTargetVolume: 0, //
            deliveryCode: null, //
            consignmentValue: null, //
            unitWeight: Number(item.weightCustom), // 单件重量
            unitVolume: Number(item.volumeCustom), // 单件体积
            remark: null //
          })
        })
        this.addKeyVal = tempaddKeyVal
      }
      console.log('jack add', this.addKeyVal)
      console.log('jack this.data', this.data)
      /**
       * 货物信息存储
       */
      this.setCargoInfo(this.data)
      this.handlegoodsselectclose()
    },
    handleGetdata () {
      // 获取组件数据
      return deepClone(this.data)
    },
    // 删除货物列表中数据
    remove (key) {
      // console.log('remove===', key)
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    // 选择货物列表弹窗关闭
    handlegoodsselectclose () {
      this.goodsListPageSelectvisible = false
    },
    // 选择货物列表弹窗打开
    handlegoodsselectopen () {
      if (this.getPartnerId !== '') {
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
        key: key - 1,
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
      this.$nextTick(() => {
        this.form = this.$form.createForm(this)
      })
      /**
       * 手动新增货物后，将将相关的货物数据储存起来
       */

      console.log('data===', this.data)
    },
    // 货物明细列表数据修改触发事件
    handleChange (value, key, column) {
      /**
       * value 为值
       * key 为行值
       * column 为相关列
       * 改变数据后将相关的数据存储下来
       */
      console.log('handleChange===', value, key, column)
      const target = this.data.filter(item => key === item.key)[0]
      // const newData = [...this.data]
      if (target) {
        target[column] = value
        // console.log('column', key, value)
        // target['totalPrice'] = target['orderAmount']

        this.calculationSub()
      }

      /**
       * 数据改变后将相关的数据存起来
       */
      this.setCargoInfo(this.data)
    },
    // 计算货物运费
    calculationSub () {
      // console.log('model', this.model)
      var priceunitValtemp = this.priceunitVal
      // console.log('priceunitValtemp', priceunitValtemp)
      console.log(this.data)
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
              console.log(item.orderTargetVolume)
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
    }
  }
}
</script>
