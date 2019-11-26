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
              :lg="8"
              :md="24"
            >
              <a-form-item label="发货城市：">
                <a-select
                  style="max-width:380px"
                  showSearch
                  allowClear
                  placeholder="请输入发货城市"
                  v-model="queryParam.sdCityRgcode"
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
              :md="24"
            >
              <a-form-item label="当前城市：">
                <a-select
                  style="max-width:380px"
                  showSearch
                  allowClear
                  placeholder="请输入当前城市"
                  v-model="queryParam.cuCityRgcode"
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
              :md="24"
            >
              <a-form-item label="收货城市：">
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
              :md="24"
            >
              <a-form-item
                label="要求提货时间："
                :labelCol="{span:5}"
                :wrapperCol="{}"
              >
                <a-range-picker
                  v-model="sDate"
                  :placeholder="['提货开始时间', '提货结束时间']"
                />
              </a-form-item>
            </a-col>

            <a-col
              :lg="8"
              :md="24"
            >
              <a-form-item
                label="要求送达时间："
                :labelCol="{span:5}"
                :wrapperCol="{}"
              >
                <a-range-picker
                  v-model="eDate"
                  :placeholder="['送达开始时间', '送达结束时间']"
                />
              </a-form-item>
            </a-col>

            <a-col
              :lg="8"
              :md="24"
            >
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.lineTable.refresh()"
                  @keyup.enter="$refs.lineTable.refresh()"
                >查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card
      class="card-container"
      :bordered="false"
      style="margin-top:10px;"
    >
      <!-- TABLE OPTIONS -->
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col>
            <a-button
              icon="plus"
              @click="goPreDispatch('goods')"
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

      </s-table>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import TopNav from '@/components/tabs/'
import { goodsTabCol } from '../variable'
import { goodsList } from '@/api/dispatch/dispatch'
import cityCollection from '../mixins/city_collection'
import tabsBase from '../mixins/tabs_base'

export default {
  name: 'GoodsTab',
  mixins: [tabsBase, cityCollection],
  components: {
    STable,
    TopNav
  },
  data () {
    return {
      queryParam: {
        rvCityRgcode: undefined,
        sdCityRgcode: undefined,
        cuCityRgcode: undefined
      },
      sDate: undefined,
      eDate: undefined,
      columns: goodsTabCol,
      tabItems: [
        { key: '1', title: '提货调度', pathName: 'GoodsTab' },
        { key: '2', title: '干线调度', pathName: 'LineTab' },
        { key: '3', title: '配送调度', pathName: 'DeliveryTab' }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      loadData: param => {
        // console.log(parameter, 'queryParam=', this.queryParam)
        this.queryParam.tenantId = this.tenantId
        if (this.eDate && this.eDate.length > 0) {
          this.queryParam.reqArrivalDate = this.eDate[0].format('YYYY-MM-DD HH:mm:ss')
          this.queryParam.reqArrivalDate2 = this.eDate[1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          this.queryParam.reqArrivalDate = ''
          this.queryParam.reqArrivalDate2 = ''
        }
        if (this.sDate && this.sDate.length > 0) {
          this.queryParam.reqDeliveryDate = this.sDate[0].format('YYYY-MM-DD HH:mm:ss')
          this.queryParam.reqDeliveryDate2 = this.sDate[1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          this.queryParam.reqDeliveryDate = ''
          this.queryParam.reqDeliveryDate2 = ''
        }
        console.log(this.queryParam)
        return goodsList(Object.assign(param, this.queryParam)).then(res => {
          console.log('res data==', res)
          return res.data
        })
      }
    }
  },
  created () {
  },
  computed: {

  },
  methods: {
    handleReset () {
      this.sDate = undefined
      this.eDate = undefined
      this.queryParam = {
        rvCityRgcode: undefined,
        sdCityRgcode: undefined,
        cuCityRgcode: undefined
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-content {
  margin-top: 48px;
}
</style>
