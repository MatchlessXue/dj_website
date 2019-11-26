<template>
  <div class="settlement-odd-detail">
    <s-table
      ref="table"
      size="default"
      bordered
      :scroll="{ x: scrollX}"
      :columns="columns"
      :data="loadData"
      rowkey="settleId"
      :pageSize="pagination.pageSize"
      :showAlertInfo="false">
      <a slot="driverName"
         slot-scope="text, record"
         @click="handleDetail(record)"
      >{{text}}</a>

      <a slot="bizStatus"
         slot-scope="text, record">{{record.bizStatusName}}</a>
    </s-table>

  </div>
</template>

<script>
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'
import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'

export default {
  name: 'settlement-odd-detail',
  mixins: [librariesBase, base],
  components: {
    STable
  },
  props: {
    queryParam: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      columns: [],
      pagination: {
        pageSize: 5
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.selectedRowKeys = []
        this.selectedRows = []
        console.log(parameter, 'queryParam=', this.queryParam)
        return this.pageConfig.waybillPageWithFee(Object.assign(parameter, this.queryParam)).then(res => {
          console.log('settlementOddDetail.vue  res data', res.data)
          this.columns = res.data.tableTitle
          if (res.data.records) {
            res.data.records.forEach(val => {
              if (val.expenseVos) {
                val.expenseVos.forEach(v => {
                  this.$set(val, v.type, v.money)
                })
              }
            })
          }
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  created () {

  },
  methods: {
  },
  watch: {
    queryParam (n, o) {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
