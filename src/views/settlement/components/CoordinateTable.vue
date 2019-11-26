<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container"

            >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="结算单号">
                <a-input v-model="queryParam.documentCode"
                         placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="结算单名称">
                <a-input v-model="queryParam.documentName"
                         placeholder="" />
              </a-form-item>
            </a-col>

            <a-col :md="6"
                   :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary"
                          @click="$refs.table.refresh()"
                          @keyup.enter="$refs.table.refresh()"
                >查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false"
            style="margin-top: 10px"
            class="card-container">

      <s-table ref="table"
               size="default"
               :columns="columns"
               :data="loadData"
               :showAlertInfo="false"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @onSelect="onChange">

        <span slot="action"
              slot-scope="text, record">
            <a v-for="item in record.operationStatus" :key="item" @click="handleChange(record,item.operation)" style="margin-right:10px;">
              {{item.operationName}}
            </a>
        </span>
      </s-table>

    </a-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import STable from '@/components/table/'
import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'

import { coordinateTable } from '@views/settlement/components/column.js'

import { coordinatelistParams } from '@views/settlement/components/queryParams.js'

export default {
  name: 'coordinatetable',
  mixins: [librariesBase, base],
  components: {
    STable
  },
  props: {
    currentPage: {
      type: String,
      defalut: '1'
    }
  },
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: null,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('展示', parameter)
        // console.log(parameter, 'queryParam=', this.queryParam)
        coordinatelistParams.objectType = this.pageType // 结算对象类型 1:客户，2:承运商 3:司机 4:服务商
        coordinatelistParams.settlementStatus = this.pageSettleType // 结算的流程类型: 300:结算单管理，301:开票管理,302:出纳确认管理
        coordinatelistParams.onlineSettlementStatus = this.currTab // 发出结算单为 1 /添加结算单为2
        return this.pageConfig.reqCoordinateList(Object.assign(coordinatelistParams, this.queryParam)).then(
          res => {
            console.log('res data==', res)
            return res.data
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: [],
      currTab: 1
    }
  },
  created () {

  },
  watch: {
    currentPage: {
      handler: function (val) {
        console.log(val)
        this.currTab = val
        this.$refs.table.refresh()
      }
    },
    deep: true
  },
  mounted () {
    this.columns = coordinateTable
  },
  methods: {
    ...mapActions('settlement', [
      'setrefuseId'
    ]),
    handleChange (record, status) {
      console.log(record)
      console.log(11)
      let myParams = {
        coopStatus: status,
        documentId: record.documentId
      }
      if (status === 104) {
        this.setrefuseId(myParams.documentId)
        this.$emit('hideModal', 3)
      } else {
        this.pageConfig.updateCoordinateList(myParams).then(res => {
          console.log(res)
        })
      }
    }

  }

}
</script>

<style lang="less" scoped>
</style>
