<template>
  <div class="avOrderBox">
    <div class="avOrderList" v-for="(customOrder, orderIndex) in orderRows" :key="customOrder.waybillId">
      <div class="avOrderListL" v-if="dispatchId">
<!--        <a-popconfirm title='是否要删除此记录，删除后所有费用和结算金额将被清空' @confirm="removeOrder(customOrder, orderIndex)" v-if="selectedRows.length > 1">-->
<!--          <img src="../../../assets/delete.png" style="cursor: pointer"  alt="del">-->
<!--        </a-popconfirm>-->
      </div>
      <div class="avOrderListR">
        <div class="avOrderListTitle">
          <ul class="flex_item">
            <li>运单号：<a href="javascript:;" @click="goDetail(customOrder.waybillId)">{{customOrder.waybillCode}}</a></li>
            <li v-if="customOrder.contractName && isAgreement">合同名称：{{customOrder.contractName}}</li>
            <li>项目：{{customOrder.projectName}}</li>
            <!--          {{customOrder.totalAmount}}-->
            <li>件数：
              <template v-if="customOrder.isModAmount === '2'">{{customOrder.amount}}</template>
              <a-input-number
                v-if="!customOrder.isModAmount || customOrder.isModAmount === '1'"
                @input.native="amountChange(customOrder)"
                @change="amountChange(customOrder)"
                style="min-width: 180px"
                v-model="customOrder.amount"
                :max='customOrder.amount' :min='0'/>
            </li>
            <li>重量(kg)：
              <a-input-number
                style="min-width: 180px"
                v-model="customOrder.weight"
                :max='9999999999999.999' :min='0'/>
            </li>
            <li>体积(m³)：
              <!--            <span v-if="!dispatchId">{{customOrder.totalVolume}}</span>-->
              <!--            v-if="dispatchId"-->
              <a-input-number
                style="min-width: 180px"
                :min='0'
                :max='9999999.999'
                v-model="customOrder.volume" />
            </li>
            <li v-if="isAgreement">单价：{{customOrder.price}}</li>
            <li>发货方地址：{{customOrder.departAddress}}</li>
            <li>收货方地址：{{getSiteName(customOrder)}}</li>
          </ul>
        </div>
        <div class="avOrderListBody mt10">
          <a-row :gutter="10">
            <strong style="float: left;">费用信息：</strong>
            <div class="valueList">
              <template v-if="feeValues && feeValues.length">
                <a-col  :xxl="4" :xl="4" :md="4" v-for="aVal in feeValues" :key="aVal.subDictId">
                          <span class="flex">
                            <label><strong>{{aVal.subDictName}}</strong></label>
                            <a-input-number :max='max'
                                            :min='min'
                                            @change="triggerRowSum(customOrder, true)"
                                            :formatter='chknum'
                                            :style="{width: '100%', minWidth:'50px'}"
                                            v-model="customOrder[aVal.modelKey]"
                                            :parser='chknum' />
                          </span>
                </a-col>
              </template>
              <a-col :xxl="4" :xl="4" :md="4"><span class="flex"><label><strong>合计</strong></label><a-input v-model="customOrder.ksSum" :disabled="true" /></span></a-col>
            </div>
          </a-row>
          <a-row :gutter="10" class="mt10">
            <strong style="float: left;">结算信息：</strong>
            <div class="valueList">
              <a-col :xxl="4" :xl="4" :md="4">
                      <span class="flex">
                        <label><strong>现付</strong></label>
                        <a-input-number :max='max'
                                        :min='min'
                                        :formatter='chknum'
                                        style="width: 100%"
                                        v-model="customOrder.ksSettleXfMoney"
                                        :parser='chknum' />
                      </span>
              </a-col>
              <a-col :xxl="4" :xl="4" :md="4">
                      <span class="flex">
                        <label><strong>到付</strong></label>
                        <a-input-number :max='max'
                                        :min='min'
                                        :formatter='chknum'
                                        style="width: 100%"
                                        v-model="customOrder.ksSettleDfMoney"
                                        :parser='chknum' />
                      </span>
              </a-col>
              <a-col :xxl="4" :xl="4" :md="4">
                      <span class="flex">
                        <label><strong>月结</strong></label>
                        <a-input-number :max='max'
                                        :min='min'
                                        :formatter='chknum'
                                        style="width: 100%"
                                        v-model="customOrder.ksSettleMonthMoney"
                                        :parser='chknum' />
                      </span>
              </a-col>
            </div>
          </a-row>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'DispatchOrderList',
  props: {
    order: {
      default: () => {},
      type: Object
    },
    dispatchId: {
      default: '',
      type: String
    },
    isAgreement: {
      default: false,
      type: Boolean
    },
    allValues: {
      default: () => [],
      type: Array
    },
    selectedRows: {
      default: () => [],
      type: Array
    },
    sites: {
      default: () => [],
      type: Array
    },
    max: {
      default: 99999999.99,
      type: Number
    },
    min: {
      default: 0,
      type: Number
    },
    triggerRowSum: {
      default: function () {},
      type: Function
    },
    updatePageNumbers: {
      default: function () {},
      type: Function
    }
  },
  data () {
    return {
      feeValues: this.allValues,
      orderRows: this.selectedRows
    }
  },
  created () {
    this.addRowInitValue()
  },
  methods: {
    addRowInitValue () {
      this.orderRows.forEach(item => {
        item.initAmount = item.amount
        item.initWeight = item.weight
        item.initVolume = item.volume
      })
    },
    removeOrder (order, index) {
      this.$emit('remove', order, index)
    },
    getSiteName (customOrder) {
      let find = this.sites.find(item => item.siteId === customOrder.station)
      if (find) return find.address
      return customOrder.arrivalAddress
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
    amountChange (row) {
      if (!row.amount) row.amount = row.initAmount
      if (row.amount >= row.initAmount) row.amount = row.initAmount
      let value = parseInt(row.amount)
      row.amount = isNaN(value) ? row.amount : value
      this.updatePageNumbers()
    },
    volumeChange (row) {
      if (!row.volume) row.volume = row.initVolume
      if (row.volume >= row.initVolume) row.volume = row.initVolume
      let value = parseInt(row.volume)
      row.volume = isNaN(value) ? row.volume : value
      this.updatePageNumbers()
    },
    weightChange (row) {
      if (!row.weight) row.weight = row.initWeight
      if (row.weight >= row.initWeight) row.weight = row.initWeight
      let value = parseInt(row.weight)
      row.weight = isNaN(value) ? row.weight : value
      this.updatePageNumbers()
    },
    // 运单详情页
    goDetail (id) {
      this.$router.push({
        name: 'WaybillDetail',
        params: { id: id }
      })
    }
  },
  watch: {
    allValues (newVal) {
      this.feeValues = newVal
    },
    order (newVal) {
      console.log('customOrder', newVal)
      this.customOrder = newVal
    },
    selectedRows (newVal) {
      console.log('selectedRows', newVal)
      this.orderRows = newVal
      this.addRowInitValue()
    }
  }
}
</script>

<style>

</style>
