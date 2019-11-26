<template>
  <div class="page-container">
    <!-- QUERY FROM -->
    <a-card :bordered="false" class="card-container" v-if="isListMode">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="发货城市：" class="labelCol" >
                <a-select
                  showSearch
                  allowClear
                  placeholder="请输入发货城市"
                  v-model="queryParam.sdCityRgcode"
                  optionFilterProp="children"
                  :filterOption="filterOption">
                  <a-select-option v-for="city in cityOptions" :key="city.regionId">{{ city.regionName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="当前城市：" class="labelCol" >
                <a-select
                  showSearch
                  allowClear
                  placeholder="请输入当前城市"
                  v-model="queryParam.siteCity"
                  optionFilterProp="children"
                  :filterOption="filterOption">
                  <a-select-option v-for="city in cityOptions" :key="city.regionId">{{ city.regionName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="收货城市：" class="labelCol" >
                <a-select
                  showSearch
                  allowClear
                  placeholder="请输入收货区域"
                  v-model="queryParam.rvCityRgcode"
                  optionFilterProp="children"
                  :filterOption="filterOption">
                  <a-select-option v-for="city in cityOptions" :key="city.regionId">{{ city.regionName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="要求提货时间：" class="labelCol" >
                <a-range-picker v-model="sDate" :placeholder="['提货开始时间', '提货结束时间']"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="要求送达时间：" class="labelCol" >
                <a-range-picker v-model="eDate" :placeholder="['送达开始时间', '送达结束时间']"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.table.refresh()"
                  @keyup.enter="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
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
      style="margin-top:10px;">
      <!-- TABLE OPTIONS -->
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-checkbox :defaultChecked="siteChecked" @change="onChangeSite">设置中转站</a-checkbox>
            <a-select
              v-show="siteChecked"
              placeholder="请选择中转站"
              allowClear
              showSearch
              v-model="currentSiteSelect"
              style="width: 135px"
              optionFilterProp="children"
              :filterOption="filterOption"
              @change="siteSelectChange">
              <a-select-option :value="site.siteId" v-for="site in sites" :key="site.siteId">{{site.siteName}}</a-select-option>
            </a-select>
            <template v-if="isListMode">
              <a-button class="ml15" type="primary" @click="appointCar">指派车辆</a-button>
              <a-button class="ml15" type="primary" @click="appointCar(true)">指派承运商</a-button>
            </template>
          </a-col>
          <a-col :md="12" :sm="24" style="text-align: right">
            <a-select
              placeholder="批量选择"
              allowClear
              v-model="currentBatchSelect"
              style="width: 135px"
              @change="batchSelectChange">
              <a-select-option value="1">同一发货城市</a-select-option>
              <a-select-option value="2">同一收货城市</a-select-option>
              <a-select-option value="3">同一当前城市</a-select-option>
            </a-select>
            <CheckboxMulty :plainOptions="columnsOption"
                           :defaultCheckedList="defaultCheckList"
                           @change="handleCheked"
                           cardWidth="420px"
                           :itemCount="3"
                           ref="selectColRef"
                           style="margin-left:10px;"
                           title="自定义列"></CheckboxMulty>
          </a-col>
        </a-row>
      </div>
      <s-table
        ref="table"
        :data="loadData"
        bordered
        class="lineTable"
        :scroll="{x:scrollX}"
        :columns="selectedColumns"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps }"
        :rowKey='record => record.routeId'>
        <span slot="amount" slot-scope="text">{{text > 0 ? text : 0}}</span>
        <span slot="weight" slot-scope="text">{{text > 0 ? text : 0}}</span>
        <span slot="volume" slot-scope="text">{{text > 0 ? text : 0}}</span>
        <span slot="action" slot-scope="text,record">
          <Confirm-Info v-if="record.dispatchStatus === 2" :title="'是否要退回此单号？'" :content="'退回'" @onconfirm="remove(record)"/>
        </span>
        <span slot="station" slot-scope="text,record">
          <a-select
            placeholder="请选择中转站"
            allowClear
            showSearch
            v-model="record.station"
            style="width: 135px"
            optionFilterProp="children"
            :filterOption="filterOption">
              <a-select-option :value="site.siteId" v-for="site in sites" :key="site.siteId">{{site.siteName}}</a-select-option>
            </a-select>
        </span>
        <div slot="waybillCode" slot-scope="text,record" class="waybillCodeBox">
          {{text}}
          <img src="../../assets/dd.png" v-if="record.dispatchLabel === 1">
        </div>

      </s-table>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import { goodsTabCol } from './variable'
import { goodsList, linereturn } from '@/api/dispatch/dispatch'
import { selectAll } from '@/api/resource/siteAddress'
import cityCollection from './mixins/city_collection'
import CheckboxMulty from '@/components/CheckboxMulty'
import ConfirmInfo from '@/components/ListConfirm/ConfirmInfo'
import tabsBase from './mixins/tabs_base'

export default {
  name: 'RoadLineList',
  mixins: [tabsBase, cityCollection],
  components: {
    STable,
    CheckboxMulty,
    ConfirmInfo
  },
  props: {
    isListMode: {
      type: Boolean,
      default: true
    }
    // disabledIds: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data () {
    return {
      queryParam: {
        rvCityRgcode: undefined,
        sdCityRgcode: undefined,
        siteCity: undefined
      },
      scrollX: 0,
      sDate: undefined,
      eDate: undefined,
      columns: goodsTabCol,
      siteChecked: false, // 设置中转站选项是否选中
      currentBatchSelect: undefined, // 批量选择的数据
      currentSiteSelect: undefined, // 选择中转站
      selectedColumns: [], // 需要显示的列
      tableDataCatch: [],
      locaPage: 1,
      goodsList,
      sites: [],
      loadData: param => {
        // console.log(parameter, 'queryParam=', this.queryParam)
        // siteCity
        if (this.eDate && this.eDate.length > 0) {
          this.queryParam.reqArrivalDate = this.eDate[0].format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.reqArrivalDate2 = this.eDate[1].format('YYYY-MM-DD') + ' 23:59:59'
        } else {
          this.queryParam.reqArrivalDate = ''
          this.queryParam.reqArrivalDate2 = ''
        }
        if (this.sDate && this.sDate.length > 0) {
          this.queryParam.reqDeliveryDate = this.sDate[0].format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.reqDeliveryDate2 = this.sDate[1].format('YYYY-MM-DD') + ' 23:59:59'
        } else {
          this.queryParam.reqDeliveryDate = ''
          this.queryParam.reqDeliveryDate2 = ''
        }

        // 每次翻页重置批量选择
        if (this.locaPage !== param.page) {
          this.currentBatchSelect = undefined
        }
        this.locaPage = param.page

        console.log(this.queryParam)
        this.$emit('loadData', this)
        console.log('加载查看keys', this.selectedRowKeys, this.disabledIds)
        return goodsList(Object.assign(this.queryParam, param)).then(res => {
          console.log('res data==', res)
          // 缓存分页数据
          this.tableDataCatch[param.page - 1] = res.data.records
          return res.data
        })
      },
      // disabled的id
      disabledIds: []
    }
  },
  activated () {
    let pageCatch = this.$ls.get('pageCatch')
    if (pageCatch) {
      this.$refs.table.refresh()
    } else {
      this.handleReset(true)
    }
    this.selectedRowKeys = []
    this.disabledIds = []
    this.$ls.remove('pageCatch')
  },
  created () {
    let cols = this.$ls.get('DDLinesSelectedCols_1')
    console.log('查看缓存的cols', typeof cols, cols)
    if (cols && cols.length) {
      this.selectedColumns = cols
    } else {
      this.selectedColumns = this.columns.filter(col => col.defaultShow)
    }
    // 选择模式过滤到操作
    if (!this.isListMode) {
      this.selectedColumns = this.selectedColumns.filter(item => item.key !== 'action')
    }
    console.log('查看selectedColumns', this.selectedColumns)
    // this.selectedColumns = this.columns.slice(0)
    this.updateColumnWidth()

    selectAll().then(res => {
      this.sites = res.data || []
    })
  },
  computed: {
    columnsOption () {
      return this.columns.map(function (item) {
        // console.log({ label: item.title, value: item.key, disabled: item.fixed });
        // return { label: item.title, value: item.key, disabled: item.fixed }，
        return { label: item.title, value: item.key }
      })
    },
    defaultCheckList () {
      let catchCols = this.$ls.get('DDLinesSelectedCols_1')
      let defaultCols = this.columns.reduce((res, item) => {
        if (item.defaultShow) res.push(item.key)
        return res
      }, [])
      if (catchCols && catchCols.length) {
        defaultCols = catchCols.reduce((res, item) => {
          res.push(item.key)
          return res
        }, [])
      }
      return defaultCols
    },
    tableData () {
      if (this.$refs.table && this.$refs.table.localDataSource && this.$refs.table.localDataSource.length) {
        return this.$refs.table.localDataSource
      }
      return []
    },
    rowSelection () {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: this.getCheckboxProps
      }
    }
  },
  methods: {
    tableAjaxBefore (vmTable) {
      if (this.eDate && this.eDate.length > 0) {
        this.queryParam.reqArrivalDate = this.eDate[0].format('YYYY-MM-DD')
        this.queryParam.reqArrivalDate2 = this.eDate[1].format('YYYY-MM-DD')
      } else {
        this.queryParam.reqArrivalDate = ''
        this.queryParam.reqArrivalDate2 = ''
      }
      if (this.sDate && this.sDate.length > 0) {
        this.queryParam.reqDeliveryDate = this.sDate[0].format('YYYY-MM-DD')
        this.queryParam.reqDeliveryDate2 = this.sDate[1].format('YYYY-MM-DD')
      } else {
        this.queryParam.reqDeliveryDate = ''
        this.queryParam.reqDeliveryDate2 = ''
      }
      vmTable.setParams(this.queryParam)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log('当前选中的中转站', this.currentSiteSelect)
      if (this.currentSiteSelect) {
        this.tableData.forEach(tableItem => {
          if (selectedRowKeys && selectedRowKeys.includes(tableItem.routeId)) {
            this.$set(tableItem, 'station', this.currentSiteSelect)
          }
        })
      }
      console.log('当前table数据源', this.tableData)
    },
    getCheckboxProps (record) {
      if (this.isListMode) return { props: {} }
      let hasRoute = this.disabledIds.includes(record.routeId)
      return {
        props: {
          disabled: hasRoute,
          name: record.name
        }
      }
      /*
      if (this.isListMode) {
        let rows = this.getSelectedRows()
        let isDispatchIng = rows.some(row => row.dispatchLabel === 1)
        return {
          props: {
            disabled: isDispatchIng,
            name: record.name
          }
        }
      } else {
        let hasRoute = this.disabledIds.includes(record.routeId)
        return {
          props: {
            disabled: hasRoute,
            name: record.name
          }
        }
      }
      */
    },
    handleReset (pageOne) {
      this.sDate = undefined
      this.eDate = undefined
      this.queryParam = {
        rvCityRgcode: undefined,
        sdCityRgcode: undefined,
        siteCity: undefined
      }
      this.$refs.table.refresh(pageOne)
    },
    handleCheked (checkList) {
      this.selectedColumns = this.columns.filter(function (item) {
        if (checkList.includes(item.key)) {
          return item
        }
      })
      this.$ls.set('DDLinesSelectedCols_1', this.selectedColumns)
      this.updateColumnWidth()
    },
    updateColumnWidth () {
      this.scrollX = this.selectedColumns.reduce((res, col) => {
        return (res += col.width)
      }, 0)
      console.log('scrollX值更新', this.scrollX)
    },
    // 退回一条数据
    remove (record) {
      var params = {
        routeId: record.routeId,
        waybillId: record.waybillId
      }
      console.log(params)
      linereturn(params).then(data => {
        this.$message.success('退回成功')
        this.$refs.table.refresh()
      })
    },
    batchSelectChange () {
      if (this.tableData.length === 0) return
      let codeType = null
      if (this.currentBatchSelect === '1') { codeType = 'sdCityRgcode' }
      if (this.currentBatchSelect === '2') { codeType = 'rvCityRgcode' }
      if (this.currentBatchSelect === '3') { codeType = 'departCityRgcode' }
      console.log('查看code', codeType)
      if (codeType !== null) {
        let firstCode = this.tableData[0][codeType]
        if (firstCode) {
          console.log('第一个城市ID', firstCode)
          // 选中符合条件的
          this.tableData.filter(item => item[codeType] === firstCode).forEach(item => {
            if (!this.selectedRowKeys.includes(item.routeId)) {
              this.selectedRowKeys.push(item.routeId)
            }
          })
          // 取消勾选
          this.tableData.filter(item => item[codeType] !== firstCode).forEach(item => {
            let index = this.selectedRowKeys.indexOf(item.routeId)
            if (index !== -1) this.selectedRowKeys.splice(index, 1)
          })
        }
      }
    },
    siteSelectChange () {
      this.tableData.forEach(item => {
        if (this.selectedRowKeys.includes(item.routeId)) {
          this.$set(item, 'station', this.currentSiteSelect)
        }
      })
      // 让中转站的列显示
      var stationColName = 'station'
      var findCol = this.selectedColumns.find(col => col.key === stationColName)
      console.log(findCol)
      if (!findCol) {
        var col = this.columns.find(col => col.key === stationColName)
        this.selectedColumns.splice(4, 0, col)
        var keyList = this.selectedColumns.map(item => item.key)
        if (this.$refs.selectColRef) {
          this.$refs.selectColRef.setCol(keyList)
        }
      }
    },
    onChangeSite (e) {
      this.siteChecked = e.target.checked
    },
    getSelectedRows () {
      // selectedRowKeys
      return this.tableDataCatch.reduce((res, tableDataArr) => {
        this.selectedRowKeys.forEach(itemKey => {
          let find = tableDataArr.find(item => item.routeId === itemKey)
          if (find) res.push(find)
        })
        return res
      }, [])
    },
    // 设置选中
    setSelectedRows (ids) {
      this.selectedRowKeys = ids
      this.disabledIds = ids
    },
    appointCar (type) {
      let rows = this.getSelectedRows()
      if (rows.length === 0) {
        this.$message.error('请选择一个运单!')
        return false
      }
      let find = rows.find(row => row.dispatchLabel === 1)
      if (find) {
        this.$message.error(`${find.waybillCode}运单未签收，无法调度`)
        return false
      }

      var name = 'assignedVehicle'
      if (type === true) name = 'assignedShop'
      this.$router.push({ name: name })
      this.$ls.set('AssignedVehicle', rows)
    }

  }
}
</script>

<style lang="less" >
  .search-content {
    margin-top: 48px;
  }
  .ml15 {
    margin-left: 15px;
  }
  .lineTable td{
    position: relative;
  }
  .waybillCodeBox{
    text-align: left;
    padding-left: 25px;
    img{
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }
</style>
