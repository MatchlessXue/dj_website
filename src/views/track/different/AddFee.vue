<template>
<div>
    <a-table :columns="columns" :dataSource="data" bordered :pagination="false" size="small">
        <template v-for="(col, i) in cols" :slot="col" slot-scope="text, record, index" style="text-align: center">
        <div :key="col" v-if="col === 'ClaimNoteType'">
          <a-select allowClear :key="col" v-if="record.editable" style="width: 92px" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="expense in ClaimNoteType" :key="JSON.stringify(expense)">{{expense.name }}</a-select-option>
          </a-select>
          <template v-else>{{record.nodeTypeName}}
          </template>
        </div>
        <div :key="col" v-if="col === 'price'">
          <a-input-number :key="col" v-if="record.editable" style="margin: -5px 0" :placeholder="columns[i].title" v-decorator="[ `${col}${record.key}`,{rules: [{ message: `请输入正确的金额`, whitespace: true, max: 10}]}]" @change="e => handleChange(e, record.key, col)" maxLength="10" :min="0.01" :formatter='chknum' :parser='chknum'/>
<template v-else>
 {{text}}
</template>
        </div>
        <div :key="col" v-if="col === 'settlementObj'">
          <a-select allowClear :key="col" v-if="record.editable"  style="width: 92px;" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="settlement in settlements" :key="settlement.id">{{settlement.name }}</a-select-option>
          </a-select>
<template v-else>
 {{record.settlementObjName}}
</template>
        </div>
        <div :key="col" v-if="col === 'settlementObj2'">
          <a-select allowClear :key="col" v-if="record.editable" style="width: 92px" :value='record.settlementObj2' :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)" @focus='(value) => handleChange(value, record.key, col)'>
<template v-if='settlementObj2[record.settlementObj]'>
<a-select-option v-for="settle in settlementObj2[record.settlementObj]" :key="JSON.stringify(settle)">
    {{settle.settlementName|| '' }}</a-select-option>
</template>
          </a-select>
<template v-else>
 {{text}}
</template>
        </div>
        <div :key="col" v-if="col === 'settlementType'">
          <a-select allowClear :key="col" v-if="record.editable" style="width: 92px" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="transport in settlementTypes" :key="transport.id">{{transport.name }}</a-select-option>
          </a-select>
<template v-else>
 {{record.settlementTypeName}}
</template>
        </div>
        <div :key="col" v-if="col === 'equalizationMethod' && record.relationType !== 1"><!--异常处理页面，如管理类型为运单，则不显示分摊方式-->
          <a-select allowClear :key="col" v-if="record.editable" style="width: 92px" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="proportion in proportionTypes" :key="proportion.id">{{proportion.name }}</a-select-option>
          </a-select>
<template v-else>
 {{record.equalizationMethodName}}
</template>
        </div>
        <div :key="col" v-if="col === 'remark'">
          <a-input :key="col" v-if="record.editable" style="margin: -5px 0" placeholder="备注" v-decorator="[ `${col}${record.key}`]" @change="e => handleChange(e.target.value, record.key, col)" maxLength="10" />
<template v-else>
 {{record.nodeContent}}
</template>
        </div>
        <div :key="col" v-if="col === 'operation'">
          <a @click="addData" style="margin-right:15px" v-if="index === data.length - 1">添加</a>
          <span v-if="data.length > 1 && (record.editable || record.bizStatus === ('1' || '2'))" style="margin-right:15px">
            <a-popconfirm title='确定删除该条信息吗?' @confirm="() => cancel(record.key)"><a>删除</a></a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUploadPictureUrl } from '@/api/common'
import { mapActions } from 'vuex'

import fileBase from '@views/mixins/file_base'
import _ from 'lodash'
import base from './mixins/base'
import { trackExpenseDelete, getSettlementObject2 } from '@/api/track/track.js'
import { getSettlementType, getFeeList } from '@/api/libraries.js'
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
      columns: [
        {
          title: '结算类型',
          width: 80,
          dataIndex: 'settlementObj',
          scopedSlots: { customRender: 'settlementObj' }
        },
        {
          title: '结算对象',
          width: 80,
          dataIndex: 'settlementObj2',
          scopedSlots: { customRender: 'settlementObj2' }
        }, { // 赔偿索赔费用列表
          title: '费用类型',
          width: 80,
          dataIndex: 'ClaimNoteType',
          scopedSlots: { customRender: 'ClaimNoteType' }
        },
        {
          title: '金额',
          width: 80,
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '结算方式',
          width: 80,
          dataIndex: 'settlementType',
          scopedSlots: { customRender: 'settlementType' }
        },
        {
          title: '分摊方式',
          width: 80,
          dataIndex: 'equalizationMethod',
          scopedSlots: { customRender: 'equalizationMethod' }
        },
        {
          title: '备注',
          width: 150,
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          width: 150,
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      confirmLoading: false,
      datalength: 0,
      cols: [],
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      previewVisible: false,
      previewImage: '',
      ClaimNoteType: [], // 类型
      settlements: [], // 结算类型
      settlementObj2: [], // 结算对象
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      documentId: '',
      invoiceId: '',
      imgurl: ''
    }
  },
  created () {
    this.cols = this.columns.map(v => v.dataIndex)

    this.initFeeTypeList()

    let val = this.trackData
    let reqData = {
      relationType: val.relationType
    }
    console.log('cols515', this.columns, this.cols, val)
    if (val.relationType === 2) {
      reqData.dispatchId = val.dispatchId
    } else if (val.relationType === 1) {
      reqData.waybillId = val.waybillId
      this.columns = this.columns.filter(col => col.dataIndex !== 'equalizationMethod')
    }
    reqData.tenantId = this.tenantId
    // 获取结算对象
    getSettlementObject2(reqData).then(res => {
      this.settlementObj2 = res.data
    })
    // 获取结算类型
    getSettlementType().then(res => {
      console.log(this.trackData.relationType)
      if (this.trackData.relationType === 2) {
        res.data.shift()
      }
      this.settlements = res.data.map(v => {
        return {
          name: v.dictName,
          id: v.dictId,
          settle: []
        }
      })
    })
    this.addData()
  },
  methods: {
    initFeeTypeList () {
      let userinfo = this.$store.getters.userInfo || {}
      getFeeList({
        expenseType: 'EXCEPTION',
        notToList: [0],
        typePartId: 'EXCEPTION',
        tenantId: userinfo.tenantId
      }).then(res => {
        console.log('getFeeList>res', res)
        this.ClaimNoteType = res.data.map(v => {
          return {
            name: v.expenseSelfName,
            id: v.tanantNumberId
          }
        })
      })
    },
    ...mapActions('track', [
      'paymentList', 'expendList'
    ]),
    handleadd () {
      let data = []
      this.data.forEach((item) => {
        if (!item.id) {
          data.push(item)
        }
      })
      this.paymentList({ paylistsF: data })
    },
    addData () {
      if (!this.data) { this.data = [] }
      this.datalength++
      this.data.push(_.cloneDeep({ 'key': this.datalength, relCode: this.id, editable: true, settlementName: '' }))
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      console.log('handleChange>value, key, column515', value, key, column, target)
      if (target) {
        target[column] = value
        this.data = newData
      }
      if (column === 'settlementObj') {
        target['settlementObj2'] = undefined
      }
      if (column === 'settlementObj2') {
        let key = target['settlementObj']
        let settleobj = this.settlementObj2[key].filter(item => {
          if (item.dispatchId === target['settlementObj2']) {
            return true
          }
          return false
        })
        target['settlementName'] = settleobj.length > 0 ? settleobj[0].settlementName : ''
      }
      this.handleadd()
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
      const expenseIds = [target.expenseId]
      if (target) {
        delete target.editable
        this.data = newData.filter(item => key !== item.key)
      }
      // 删除报错原因undefined问题造成的，过滤一下，如果是undefined，不上传
      if (!expenseIds[0]) {
        this.handleadd()
        return
      }
      // console.log(expenseIds[0])
      let url = '?expenseIds=' + expenseIds.join('&expenseIds=')
      trackExpenseDelete(url).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      })
      this.handleadd()
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
