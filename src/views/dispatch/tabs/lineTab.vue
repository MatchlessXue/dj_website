<template>
  <div class="page-container">
    <a-card
      :bordered="false"
      class="card-container"
    >
      <top-nav :items='tabItems'></top-nav>
    </a-card>
    <!-- QUERY FROM -->
    <a-card
      :bordered="false"
      style="margin-top:10px;"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col
              :lg="6"
              :md="8"
              :sm="24"
            >
              <a-form-item label="发货站点：">
                <a-select
                  showSearch
                  allowClear
                  placeholder="请输入发货站点"
                  v-model="queryParam.siteACode"
                  optionFilterProp="children"
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="site in siteOptions" :key="site.siteId">{{ site.siteName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col
              :lg="6"
              :md="8"
              :sm="24"
            >
              <a-form-item label="收货区域：">
                <a-select
                  style="max-width:380px"
                  showSearch
                  allowClear
                  placeholder="请输入收货区域"
                  v-model="queryParam.rvCityRgcode"
                  optionFilterProp="children"
                  :filterOption="filterOption"
                >
                  <a-select-option
                    v-for="city in cityOptions"
                    :key="city.regionId"
                  >{{ city.regionName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col
              :lg="8"
              :md="8"
              :sm="24"
            >
              <a-form-item label="要求送达时间：" :labelCol="{span:5}" :wrapperCol="{span:19}">
                <a-range-picker
                  v-model="eDate"
                  :showTime="{ format: 'HH:mm:ss' }"
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="['送达开始时间', '送达结束时间']"
                />
              </a-form-item>
            </a-col>

            <a-col
              :lg="5"
              :md="16"
              :sm="24"
            >
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.lineTable.refresh()"
                  @keyup.enter="$refs.lineTable.refresh()"
                >查询</a-button>
              </span>

            </a-col>

          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card class="card-container"
      :bordered="false"
      style="margin-top:10px;"
    >
      <!-- TABLE OPTIONS -->
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col>
            <a-button
              icon="plus"
              @click="goPreDispatch('line')"
              type="primary"
            >预调度</a-button>
          </a-col>
        </a-row>
      </div>
      <!-- LINE TABLE -->
      <s-table
        ref="lineTable"
        :data="loadData"
        :columns="columns"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :rowKey='record => record.waybillId'
      >
        <span
          slot="lineRoad"
          slot-scope="text,record"
        >
          {{`${record.sdAddressName}-${record.rvAddressName}`}}
        </span>

      </s-table>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import TopNav from '@/components/tabs/'
import { lineTabCol } from '../variable'
import { lineList } from '@/api/dispatch/dispatch'
import cityCollection from '../mixins/city_collection'
import siteCollection from '../mixins/site_collection'
import tabsBase from '../mixins/tabs_base'

export default {
  name: 'lineTab',
  mixins: [tabsBase, cityCollection, siteCollection],
  components: {
    STable,
    TopNav
  },
  data () {
    return {
      queryParam: {
        reqArrivalDate: undefined,
        siteACode: undefined,
        rvCityRgcode: undefined
      },
      eDate: undefined,
      columns: lineTabCol,
      tabItems: [
        { key: '1', title: '提货调度', pathName: 'GoodsTab' },
        { key: '2', title: '干线调度', pathName: 'LineTab' },
        { key: '3', title: '配送调度', pathName: 'DeliveryTab' }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      loadData: param => {
        this.queryParam.tenantId = this.tenantId
        if (this.eDate) {
          this.queryParam.reqArrivalDate = this.eDate[0] ? this.eDate[0].format('YYYY-MM-DD HH:mm:ss') : null
          this.queryParam.reqArrivalDate2 = this.eDate[1] ? this.eDate[1].format('YYYY-MM-DD HH:mm:ss') : null
        }
        return lineList(Object.assign(param, this.queryParam)).then(
          res => {
            console.log('res data==', res)
            return res.data
          }
        )
      }
    }
  },
  created () {
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.search-content {
  margin-top: 48px;
}
</style>
