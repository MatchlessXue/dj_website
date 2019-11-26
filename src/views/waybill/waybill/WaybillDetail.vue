<template>
  <div class="waybill-detail new_antd new_antd_detail">
    <BackBtn />
    <div class="baseinfo_box">
      <a-card class="card" :bordered="false" title="运单详情">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :xs='6'>
              <a-form-item label="运单号">
                {{backInfo.waybillCode}}
              </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="客户名称">
                {{backInfo.partnerName}}
              </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="项目名称">
                {{backInfo.projectName}}
              </a-form-item>
            </a-col>
            <a-col :xs="6">
              <a-form-item label="运输方式">
                {{backInfo.transportTypeName}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs='6'>
              <a-form-item label="手工单号">
                {{backInfo.manualCode}}
              </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="客户单号">
                {{backInfo.clientCode}}
              </a-form-item>
            </a-col>
            <a-col :xs="6" v-if="backInfo.transportType === 2 || backInfo.transportType === 3">
              <a-form-item label="车长(m)">
                {{backInfo.truckLengthName}}
              </a-form-item>
            </a-col>
            <a-col :xs="6" v-if="backInfo.transportType === 2 || backInfo.transportType === 3">
              <a-form-item label="车辆类型">
                {{backInfo.truckTypeName}}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <footer-tool-bar align="center">
        &nbsp;&nbsp;<a-button type="primary"  @click="printDialogShow">打印</a-button>
      </footer-tool-bar>
      <print-dialog ref="PrintDialogRef" :store="$store" title="运单打印" @success="printLoading=false" :printmenuId="1"></print-dialog>
      <detail-nav
        class="detail-nav"
        :items="tabItems"
        @tabActive="tabActive"
        :routerChange="false"></detail-nav>
    </div>
    <div class="detail-main">
      <component :is="tabActiveKey" :waybillId="id" :backInfo="backInfo"></component>
    </div>
  </div>
</template>
<script>
import BackBtn from '@/components/BackBtn'
import { waybillDetail } from '@/api/waybill/waybill'
import detailNav from './../components/Tabs'
import FooterToolBar from '@/components/FooterToolbar'
import { PrintDialog } from 'dj_print'

export default {
  name: 'Waybilldetail',
  data () {
    const { id } = this.$route.params
    return {
      id,
      printLoading: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 7 },
      tabActiveKey: 'goodBaseInfo',
      backInfo: {},
      printData: null,
      tabItems: [
        { key: '1', title: '基本信息', pathName: 'goodBaseInfo' },
        { key: '2', title: '节点信息', pathName: 'goodNodeInfo' },
        { key: '3', title: '调度信息', pathName: 'goodDispatchInfo' },
        { key: '4', title: '结算信息', pathName: 'goodSettleInfo' }
      ]
    }
  },
  components: {
    BackBtn,
    detailNav,
    FooterToolBar,
    PrintDialog,
    'goodBaseInfo': () => import('./../components/goodBaseInfo'),
    'goodNodeInfo': () => import('./../components/goodNodeInfo'),
    'goodDispatchInfo': () => import('./../components/goodDispatchInfo'),
    'goodSettleInfo': () => import('./../components/goodSettleInfo')
  },
  mounted () {
    waybillDetail({ waybillId: this.id }).then(res => {
      // 处理打印数据 深拷贝处理,因为底下会处理consignments  导致每次会打印出合计信息
      let data = {}
      try {
        data = JSON.parse(JSON.stringify(res.data))
      } catch (e) {}
      console.log('getDetail--', data)
      this.printData = data

      this.backInfo = res.data
      var totalPrice = 0
      console.log(this.backInfo)
      if (this.backInfo.businessIncomes) {
        this.backInfo.businessIncomes.forEach(function (item) {
          totalPrice += (item.incomeMoney ? Number(item.incomeMoney) : 0)
        })
        this.backInfo.businessIncomes.push({
          'incomeTypeName': '费用合计',
          'incomeType': 99,
          'incomeMoney': totalPrice,
          'incomeId': null
        })
      }
      if (this.backInfo.consignments) {
        let totalOrderAmount = 0
        let totalOrderTargetWeight = 0
        let totalOrderTargetVolume = 0
        let totalConsignmentValue = 0
        let totalUnitWeight = 0
        let totalUnitVolume = 0
        this.backInfo.consignments.forEach(function (item, i) {
          totalOrderAmount += (item.orderAmount ? Number(item.orderAmount) : 0)
          totalOrderTargetWeight += (item.orderTargetWeight ? Number(item.orderTargetWeight) : 0)
          totalOrderTargetVolume += (item.orderTargetVolume ? Number(item.orderTargetVolume) : 0)
          totalConsignmentValue += Number(item.consignmentValue || 0)
          totalUnitWeight += Number(item.unitWeight || 0)
          totalUnitVolume += Number(item.unitVolume || 0)
        })
        this.backInfo.consignments.push({
          totalCol: true,
          orderAmount: totalOrderAmount,
          orderTargetWeight: totalOrderTargetWeight,
          orderTargetVolume: totalOrderTargetVolume,
          consignmentValue: totalConsignmentValue,
          unitWeight: totalUnitWeight,
          unitVolume: totalUnitVolume
        })
      }
    })
  },
  methods: {
    tabActive (item) {
      this.tabActiveKey = item.pathName
    },
    // 打印
    printDialogShow () {
      this.printLoading = true
      console.log('this.printData', this.printData)
      this.$refs.PrintDialogRef.print([this.printData])
    }
  }
}
</script>
<style lang='less'>
.detail-nav {
  background: #fff;
  margin-top: 10px;
}
// .ant-card-body {
//   padding: 15px;
// }
// .detail-main {
//   background: #fff;
// }
// .ant-card-wider-padding {
//   .ant-card-body {
//     padding: 20px 15px;
//   }
// }
// .thead {
//   th {
//     padding-left: 20px;
//     padding-right: 20px;
//   }
// }
// h3{
//   font-weight:bold
// }
</style>
