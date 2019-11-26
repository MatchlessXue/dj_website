<template>
  <div>
    <a-table :columns="columns" :dataSource="data" bordered :pagination="false" :loading="loading" size="small">
      <template v-for="(col, i) in cols" :slot="col" slot-scope="text, record, index" style="text-align: center">
        <div :key="col" v-if="col === 'nodeType'">
          <a-select :allowClear="true" :key="col" v-if="record.editable" style="width: 92px" :value="text || undefined" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="expense in expenses" :key="JSON.stringify(expense)">{{expense.name }}</a-select-option>
          </a-select>
          <template v-else>{{record.nodeTypeName}}</template>
        </div>
        <div :key="col" v-if="col === 'ClaimNoteType'">
          <a-select :key="col" v-if="record.editable" style="width: 92px" :value="text" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="expense in ClaimNoteType" :key="expense.id">{{expense.name }}</a-select-option>
          </a-select>
          <template v-else>{{record.nodeTypeName}}</template>
        </div>
        <div :key="col" v-if="col === 'price'">
          <a-input-number :key="col" v-if="record.editable" style="margin: -5px 0" :min="0.01" :placeholder="columns[i].title" v-decorator="[ `${col}${record.key}`,{rules: [{ message: `请输入正确的金额`, whitespace: true, max: 10}]}]" @change="e => handleChange(e, record.key, col)" maxLength="10" />
          <template v-else>{{text}}</template>
        </div>
        <div :key="col" v-if="col === 'transportType'">
          <a-select allowClear :key="col" v-if="record.editable" style="width: 92px" :value="text" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="transport in transports" :key="transport.id">{{transport.name }}</a-select-option>
          </a-select>
          <template v-else>{{record.transportTypeName}}</template>
        </div>
        <div :key="col" v-if="col === 'settlementObjId'">
          <template v-if='payType === "waybill"'>{{trackData.partnerName}}</template>
          <template v-else-if='payType === "dispatch"'>{{getDispatchSettlementObjName(trackData)}}</template>
          <a-select :dropdownStyle="{ minWidth: '260px' }" :allowClear="true" :key="col" v-else-if="record.editable" :value="text" style="width: 92px;" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="settlement in settlements" :key="settlement.id">{{settlement.name }}</a-select-option>
          </a-select>
          <template v-else>{{getSettleName(record.settlementObjId)}}</template>
        </div>
        <div :key="col" v-if="col === 'settlementObj'"><!--结算类型 异常处理使用-->
          <a-select :dropdownStyle="{ minWidth: '260px' }" :key="col" v-if="record.editable" :value="text" style="width: 92px;" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="settlement in settlements" :key="settlement.id">{{settlement.name }}</a-select-option>
          </a-select>
          <template v-else>{{record.settlementObjName}}</template>
        </div>
        <div :key="col" v-if="col === 'settlementType'">
          <a-select allowClear :key="col" v-if="record.editable" style="width: 92px" :value="text" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="transport in settlementTypes" :key="transport.id">{{transport.name }}</a-select-option>
          </a-select>
          <template v-else>{{record.settlementTypeName}}</template>
        </div>
        <div :key="col" v-if="col === 'equalizationMethod'">
          <a-select allowClear :key="col" v-if="record.editable" style="width: 92px" :value="text" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="proportion in proportionTypes" :key="proportion.id">{{proportion.name }}</a-select-option>
          </a-select>
          <template v-else>{{record.equalizationMethodName}}</template>
        </div>
        <div :key="col" v-if="col === 'nodeContent'">
          <a-input :key="col" v-if="record.editable" style="margin: -5px 0" :value="text" :placeholder="columns[i].title" v-decorator="[ `${col}${record.key}`]" @change="e => handleChange(e.target.value, record.key, col)" maxLength="10" />
          <template v-else>{{record.nodeContent}}</template>
        </div>
        <div :key="col" v-if="col === 'id'"><a @click="handleSpecialFeeClick(record)">{{record.expenseCode}}</a></div>
        <div :key="col" v-if="col === 'status'"><template>{{record.bizStatusName}}</template></div>
        <div :key="col" v-if="col === 'operation'" style="width:180px;overflow:hidden;">
          <a @click="addData" style="margin-right:15px" v-if="index === data.length - 1">添加</a>
          <span v-if="data.length > 1 && (record.editable || String(record.bizStatus) === ('1' || '2'))" style="margin-right:15px">
            <a-popconfirm title='确定删除该条信息吗?' @confirm="() => cancel(record.key)"><a>删除</a></a-popconfirm>
          </span>
          <a-upload v-if="payType !== 'addfee' && (record.editable || String(record.bizStatus) === ('1' || '2'))" :showUploadList="false" :action="uploadPictureUrl" :fileList="record.fileList" @preview="handlePreview"   :headers="headers" @change="(file, fileList)=>handleChange1(file, fileList,record)">
            <div v-if="record.fileList.length < 9">
              <a>上传图片</a>
            </div>
          </a-upload>
        </div>
      </template>
      <span slot="nodeTypeTitle">
            <span style="color:red" > * </span>费用类型
      </span>
      <span slot="priceTitle">
            <span style="color:red" > * </span>费用金额
      </span>
      <span slot="settlementObjIdTitle">
            <span style="color:red" > * </span>结算对象
      </span>
      <span slot="settlementTypeTitle">
            <span style="color:red" > * </span>结算方式
      </span>
    </a-table>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUploadPictureUrl } from '@/api/common'
import { mapActions } from 'vuex'

import fileBase from '@views/mixins/file_base'
import base from './mixins/base'
import { getTrackSpecialExpenseList, getSettlementObject, trackExpenseDelete } from '@/api/track/track.js'
export default {
  name: 'AddFee',
  mixins: [fileBase, base],
  components: {},
  props: {
    info: Object,
    payType: {
      type: String,
      default: 'addfee'
    },
    // 可能是 运单Code 或 调度单Code
    id: {
      type: String,
      default: ''
    },
    trackData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      bizStatus: 0,
      columns: [],
      data: [],
      loading: false,
      confirmLoading: false,
      datalength: 0,
      form: this.$form.createForm(this),
      mdl: {},
      cols: [],
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      previewVisible: false,
      previewImage: '',
      // fileList: [],
      ClaimNoteType: [], // 费用类型
      settlements: [],
      settleIds: [],
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      documentId: '',
      invoiceId: '',
      imgurl: ''
    }
  },
  created () {
    this.columns = this.getColumns(this.payType)
    this.cols = this.getCols(this.payType)
    this.initData()
    let reqData = ['waybill', 'expend'].includes(this.payType) ? { waybillId: this.trackData.waybillId } : undefined
    reqData && getSettlementObject(reqData).then(res => {
      this.settleIds = res.data
      this.$emit('getSettlement', this.settleIds)
      for (var i in res.data) {
        this.settlements.push({
          name: this.getSettlementObjectDesc(res.data[i]),
          id: this.getSettlementObjectId(res.data[i])
        })
      }
    })
  },
  computed: {
    currentIdObj () {
      return this.payType === 'dispatch' ? { dispatchId: this.trackData.dispatchId } : (
        ['waybill', 'expend'].includes(this.payType) ? { waybillId: this.trackData.waybillId } : { dispatchId: this.trackData.dispatchId }
      )
    }
  },
  methods: {
    getDispatchSettlementObjName (trackData) {
      // console.log('getDispatchSettlementObjName (trackData', trackData)
      return trackData.carrierId ? trackData.carrierName : trackData.driverName
    },
    getSettleName (settleId) {
      console.log('getSettleName (settleId', settleId)
      let find = this.settleIds.find(item => {
        return item.settleId === settleId
      })
      console.log('getSettleName', find, settleId)
      if (find) return find.settleName
      return ''
    },
    handleSpecialFeeClick (record) {
      console.log('handleSpecialFeeClick (record', record)
      this.$router.push({
        name: 'expendList',
        query: { expenseCode: record.expenseCode }
      })
    },
    ...mapActions('track', [
      'paymentList', 'expendList'
    ]),
    initData () {
      getTrackSpecialExpenseList({ page: 1, pageSize: 20, relCode: this.id }).then(res => {
        console.log(res)
        // res.data.records && this.paymentList(res.data.records.filter(item => item.budgetFlag === 1))
        // res.data.records && this.expendList(res.data.records.filter(item => item.budgetFlag === 2))
        const budgetFlag = ['expend', 'dispatch'].includes(this.payType) ? 2 /* 支出 */ : 1 /* 收入 */
        // this.data = res.data.records.filter(item => item.budgetFlag === budgetFlag)
        const _ = this
        this.data = []
        res.data.records.forEach(function (item, i) {
          item.fileList = []
          if (item.budgetFlag === budgetFlag) {
            item.key = _.datalength
            _.datalength++
            _.data.push(item)
          }
        })
      }).finally(() => {
        this.addData()
        this.handleadd()
      })
    },
    handleadd () {
      let data = []
      // console.log('data515515', this.data)
      this.data.forEach((item) => {
        if (!item.id) {
          data.push(item)
        }
      })
      switch (this.payType) {
        case 'addfee':
          this.paymentList({ paylistsF: data })
          return false
        case 'dispatch':
          this.paymentList({ paylistsD: data })
          return false
        case 'waybill':
          this.paymentList({ paylistsWI: data })
          return false
        case 'expend':
          this.expendList({ paylistsWE: data })
          return false
        default:
      }
      console.log(this.data)
    },
    addData () {
      // console.log(this.data)
      if (!this.data) { this.data = [] }
      this.datalength++
      const budgetFlag = this.payType === 'expend' ? 2 /* 支出 */ : 1 /* 收入 */
      this.data.push({ 'key': this.datalength, budgetFlag, ...this.currentIdObj, relCode: this.id, editable: true, fileList: [] })
      // console.log(this.data)
    },
    handleChange (value, key, column) {
      console.log('handleChange (value, key, column515', value, key, column)
      // 结算对象选择逻辑处理
      column === 'settlementObjId' && this.handleSettlementObjIdChange(value, key)

      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
      this.handleadd()
    },
    handleSettlementObjIdChange (value, key) {
      if (value) {
        const settlementObjIdObj = JSON.parse(value)
        let partParams = {}
        if (settlementObjIdObj.settleTypeNmae.indexOf('司机') >= 0) {
          partParams = { expenseType: 'DRIVER', typePartId: '司机' }
        } else if (settlementObjIdObj.settleTypeNmae.indexOf('承运商') >= 0) {
          partParams = { expenseType: 'NOVCC', typePartId: settlementObjIdObj.settleId }
        }
        this.initFeeTypeList(() => partParams)
      } else {
        this.expenses = []
        this.handleChange('', key, 'nodeType')
      }
    },
    save (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData
      }
    },
    cancel (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      // console.log(target)
      const expenseIds = [target.expenseId]
      if (target) {
        delete target.editable
        this.data = newData.filter(item => key !== item.key)
      }
      let url = '?expenseIds=' + expenseIds.join('&expenseIds=')
      expenseIds[0] !== undefined && trackExpenseDelete(url).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      })
      this.handleadd()
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    handleCancelimg () { // 取消显示放大图
      this.previewVisible = false
    },
    handlePreview (file) { // 显示放大图
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange1 (file, fileList, record) {
      if (record.fileList.some(v => v.uid === file.file.uid)) return
      record.fileList.push(file.file)
    },
    beforeUpload (file) {
      const isJPG =
        ['image/jpeg', 'image/png', 'image/bmp', 'application/pdf'].indexOf(file.type) > -1
      if (!isJPG) {
        this.$message.info('只支持jpg.png.bmp.pdf格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M) {
        this.$message.info('上传图片不能大于4M!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
