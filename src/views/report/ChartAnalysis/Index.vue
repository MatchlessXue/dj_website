<template>
  <div class="page-container">
    <a-row :gutter="16">
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <chart-analysis-card title="收支统计" ref="incomeOutcomeStatChart"
                             @dateTypeChange="handleIncomeDateTypeChange($event)">
          <div id="incomeOutcomeStatChart" style="height:300px"></div>
        </chart-analysis-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <chart-analysis-card title="线路统计" ref="roadLineStatChart"
                             @dateTypeChange="handleRoadLineDateTypeChange($event)">
          <div id="roadLineStatChart" style="height:300px"></div>
        </chart-analysis-card>
      </a-col>
    </a-row>
    <br>
    <a-row :gutter="16">
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <chart-analysis-card title="运单统计" ref="waybillStatChart"
                             @dateTypeChange="handleWaybillDateTypeChange($event)">
          <div id="waybillStatChart" style="height:300px"></div>
        </chart-analysis-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <chart-analysis-card title="异常分析" ref="abnormalAnalysisChart"
                             @dateTypeChange="handleAbnormalDateTypeChange($event)">
          <div id="abnormalAnalysisChart" style="height:300px"></div>
        </chart-analysis-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ChartAnalysisCard from './components/ChartAnalysisCard'
import { getIncomeOutcomeData, getRoadLineStatData, getAbnormalStatData, getWaybillStatData } from '@/api/report/report'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// var echarts = require('echarts')

// 引入饼状图组件
require('echarts/lib/chart/line')

// 引入柱状图组件
require('echarts/lib/chart/bar')

// 引入饼状图组件
require('echarts/lib/chart/pie')

// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')

export default {
  name: 'ChartAnalysis',
  mixins: [],
  components: {
    ChartAnalysisCard
  },
  data () {
    return {
      // echarts,
      waybillStatData: {
        partners: [],
        waybills: []
      },
      abnormalAnalysisLegend: [],
      abnormalAnalysisData: [],
      countForAbnormalAnalysisData: 0,
      incomeOutcomeStatData: [],
      roadLineStatData: [],
      countForRoadLineStatData: 0,
      roadLineLegend: [],
      currentDateTypeForWayBillStat: 1,
      currentDateTypeForIncomeOutcomeStat: 1,
      currentDateTypeForRoadLineStat: 1,
      currentDateTypeForAbnormalAnalysis: 1
    }
  },
  created () {
    // this.queryIncomeOutcomeData()
    // this.queryRoadLineStatData()
  },
  computed: {
    // 基于准备好的dom，初始化echarts实例
    waybillStatChart () {
      return echarts.init(document.getElementById('waybillStatChart'))
    },
    abnormalAnalysisChart () {
      return echarts.init(document.getElementById('abnormalAnalysisChart'))
    },
    incomeOutcomeStatChart () {
      return echarts.init(document.getElementById('incomeOutcomeStatChart'))
    },
    roadLineStatChart () {
      return echarts.init(document.getElementById('roadLineStatChart'))
    },
    colorSpace () {
      return ['rgba(58,160,255,1)', 'rgba(54,203,203,1)', 'rgba(80,209,255,1)', 'rgba(250,211,55,1)',
        'rgba(242,99,123,1)', 'rgba(151,95,228,1)', 'rgba(250,211,55,0.6)', 'rgba(242,99,123,1)', 'rgba(0,0,0,0.45)']
    },
    roadLineBorderWidth () {
      return this.roadLineStatData.length > 1 ? 5 : 0
    },
    abnormalBorderWidth () {
      return this.abnormalAnalysisData.length > 1 ? 5 : 0
    },
    pieCommonTitle () {
      return {
        textStyle: {
          color: '#B5B5B5',
          fontSize: 14,
          lineHeight: 27
        },
        subtextStyle: {
          fontSize: 24,
          color: ['#262626'],
          lineHeight: 19,
          align: 'center'
        },
        x: 'center',
        y: 'center'
      }
    },
    pieCommonToolTip () {
      return {
        ...this.allChartCommonToolTip,
        // 使用回调函数
        formatter: function (params) {
          return `${params.marker}&nbsp;${params.name}&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;${params.value}%</span>`
        }
      }
    },
    allChartCommonToolTip () {
      return {
        backgroundColor: 'rgba(255,255,255,0.9)',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffsetY: 2,
        borderRadius: 3,
        textStyle: {
          color: '#000'
        }
      }
    }
  },
  watch: {},
  mounted () {
    this.drawWaybillStatChart()
    this.drawAbnormalAnalysisChart()
    this.drawRoadLineStatChart()
    this.drawIncomeOutcomeStatChart()
    this.$nextTick(() => {
      this.queryWaybillStatData()
      this.queryRoadLineStatData()
      this.queryAbnormalStatData()
      this.queryIncomeOutcomeData()
      // window.onresize = function () {
      //   this.waybillStatChart.resize()
      //   this.abnormalAnalysisChart.resize()
      //   this.incomeOutcomeStatChart.resize()
      //   this.roadLineStatChart.resize()
      // }
    })
  },
  methods: {
    drawWaybillStatChart () {
      console.log('waybillStatChart', this.waybillStatChart)
      // 绘制图表
      this.waybillStatChart.setOption({
        color: this.colorSpace,
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (myParams) {
            const params = myParams[0]
            return `${params.name} <br>${params.marker}&nbsp;运单数&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;${params.value}</span>`
          },
          ...this.allChartCommonToolTip
        },
        legend: {
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.waybillStatData.partners
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            lineStyle: {
              color: '#000',
              shadowBlur: 12,
              shadowColor: 'rgb(33,148,246,0.9)',
              shadowOffsetX: 1,
              shadowOffsetY: 1
            },
            data: this.waybillStatData.waybills
          }
        ]
      })
    },
    drawIncomeOutcomeStatChart () {
      console.log('incomeOutcomeStatChart', this.incomeOutcomeStatChart)
      // 绘制图表
      this.incomeOutcomeStatChart.setOption({
        color: this.colorSpace,
        legend: {
          x: 'right'
        },
        tooltip: {
          formatter: function (params) {
            return `${params.name} <br>${params.marker}&nbsp;${params.seriesName}&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;${params.value[params.seriesIndex + 1]}</span>`
          },
          ...this.allChartCommonToolTip
        },
        dataset: {
          source: this.incomeOutcomeStatData
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      })
    },
    drawAbnormalAnalysisChart () {
      console.log('abnormalAnalysisChart', this.abnormalAnalysisChart)
      // 绘制图表
      this.abnormalAnalysisChart.setOption({
        color: this.colorSpace,
        title: {
          text: '异常运单',
          subtext: this.countForAbnormalAnalysisData,
          ...this.pieCommonTitle
        },
        tooltip: {
          ...this.pieCommonToolTip
        },
        legend: {
          ...this.pieCommonLegend(this.abnormalAnalysisData),
          data: this.abnormalAnalysisLegend
        },
        series: [
          {
            name: '异常分析',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            itemStyle: { // 图形样式
              normal: {
                borderColor: '#ffffff',
                borderWidth: this.abnormalBorderWidth
              }
            },
            data: this.abnormalAnalysisData
          }
        ]
      })
    },
    drawRoadLineStatChart () {
      // 绘制图表
      this.roadLineStatChart.setOption({
        color: this.colorSpace,
        title: {
          text: '运单总数',
          subtext: this.countForRoadLineStatData,
          ...this.pieCommonTitle
        },
        tooltip: {
          ...this.pieCommonToolTip
        },
        legend: {
          ...this.pieCommonLegend(this.roadLineStatData),
          data: this.roadLineLegend
        },
        series: [
          {
            name: '线路统计',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { // 图形样式
              normal: {
                borderColor: '#ffffff',
                borderWidth: this.roadLineBorderWidth
              }
            },
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [...this.roadLineStatData]
          }
        ]
      })
    },
    queryIncomeOutcomeData () {
      getIncomeOutcomeData({ type: this.currentDateTypeForIncomeOutcomeStat }).then(res => {
        // console.log('queryIncomeOutcomeData', res.data)
        this.incomeOutcomeStatData = res.data
        this.drawIncomeOutcomeStatChart()
      })
    },
    queryRoadLineStatData () {
      getRoadLineStatData({ type: this.currentDateTypeForRoadLineStat }).then(res => {
        console.log('queryRoadLineStatData', res)
        this.roadLineLegend = []
        this.roadLineStatData = []
        this.countForRoadLineStatData = res.data.total
        res.data.dataSource && res.data.dataSource.length > 0 && res.data.dataSource.forEach(item => {
          this.roadLineLegend.push(item.province)
          this.roadLineStatData.push({
            value: item.percentage,
            name: item.province || '-'
          })
        })
        this.$nextTick(() => this.drawRoadLineStatChart())
        console.log('this.roadLineLegend, this.roadLineStatData', this.roadLineLegend, this.roadLineStatData)
      })
    },
    queryAbnormalStatData () {
      getAbnormalStatData({ type: this.currentDateTypeForAbnormalAnalysis }).then(res => {
        console.log('queryAbnormalStatData', res)
        this.abnormalAnalysisLegend = []
        this.abnormalAnalysisData = []
        this.countForAbnormalAnalysisData = res.data.total
        res.data.dataSource && res.data.dataSource.length > 0 && res.data.dataSource.forEach(item => {
          this.abnormalAnalysisLegend.push(item.exception)
          this.abnormalAnalysisData.push({
            value: item.percentage,
            name: item.exception || '-'
          })
        })
        this.drawAbnormalAnalysisChart()
      })
    },
    queryWaybillStatData () {
      console.log('queryWaybillStatData515', this.$refs.waybillStatChart)
      getWaybillStatData({ type: this.currentDateTypeForWayBillStat }).then(res => {
        console.log('queryWaybillStatData', res)
        this.waybillStatData = res.data
        this.drawWaybillStatChart()
      })
    },
    handleIncomeDateTypeChange (currentDateType) {
      this.currentDateTypeForIncomeOutcomeStat = currentDateType
      this.queryIncomeOutcomeData()
    },
    handleRoadLineDateTypeChange (currentDateType) {
      this.currentDateTypeForRoadLineStat = currentDateType
      this.queryRoadLineStatData()
    },
    handleWaybillDateTypeChange (currentDateType) {
      this.currentDateTypeForWayBillStat = currentDateType
      this.queryWaybillStatData()
    },
    handleAbnormalDateTypeChange (currentDateType) {
      this.currentDateTypeForAbnormalAnalysis = currentDateType
      this.queryAbnormalStatData()
    },
    pieCommonLegend (data) {
      return {
        icon: 'circle',
        orient: 'vertical',
        x: '70%',
        y: 'center',
        itemWidth: 8,
        itemHeight: 8,
        align: 'left',
        textStyle: {
          fontSize: 14,
          color: 'rgba(0,0,0,0.45)'
        },
        formatter: function (name) {
          let target
          for (let i = 0, l = data.length; i < l; i++) {
            if (data[i].name === name) {
              target = data[i].value
            }
          }
          return `${name}  |  ${target}%`
        }
      }
    }
  }
}
</script>

<style>
</style>
