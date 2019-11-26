<template>
  <div>
      <BackBtn/>
      <div>
        <a-form class="form">
          <a-card :bordered="false">
            <a-row>
              <h3>基本信息</h3>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :xl="6" :lg="6" :md="12" :sm="24">
                <a-form-item label="订单号:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{backInfo.waybillCode}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item label="客户名称:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{backInfo.partnerName}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item label="客户单号:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{backInfo.clientCode}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item label="手工单号:"  :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{backInfo.manualCode}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :xl="6" :lg="6" :md="12" :sm="24">
                <a-form-item label="运输方式:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{backInfo.transportTypeName}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item label="车长:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                  {{backInfo.truckLength}}
                </a-form-item>
              </a-col>
               <a-col :xl="6" :lg="6" :md="12" :sm="24">
                <a-form-item label="车辆类型:" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{backInfo.truckTypeName}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item label="载重:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                  {{backInfo.truckLoad}}
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
          <a-card class="card" :bordered="false">
            <a-row >
              <a-col :xs="12">
                <a-card :bordered="false">
                  <h2>发货方信息</h2>
                  <a-row :gutter="24">
                    <a-col :xs="12">
                       <a-form-item label="发货方名称:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.sdName}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item label="发货方联系人:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.sdContact}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :xs="12">
                       <a-form-item label="发货方手机号:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.sdMobile}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item label="发货方座机号：" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.sdTel}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                     <a-col :xs="12">
                       <a-form-item label="发货区域:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.sdAddressArea}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item label="自定义区:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.sdCustomArea}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :xs="12">
                       <a-form-item label="发货方地址:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.sdAddress}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">

                    </a-col>
                  </a-row>
                </a-card>
              </a-col>
              <a-col  :xs="12">
                <a-card :bordered="false">
                  <h2>收货方信息</h2>
                  <a-row :gutter="24">
                    <a-col :xs="12">
                       <a-form-item label="收货方名称:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.rvName}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item label="收货方联系人:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.rvContact}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :xs="12">
                       <a-form-item label="收货方手机号:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.rvMobile}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item label="收货方座机号：" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.rvTel}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                     <a-col :xs="12">
                       <a-form-item label="收货区域:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.rvAddressArea}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item label="自定义区:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.rvCustomArea}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :xs="12">
                       <a-form-item label="收货方地址:" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{backInfo.rvAddress}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">

                    </a-col>
                  </a-row>
                </a-card>

              </a-col>
            </a-row>

          </a-card>

          <a-card  :bordered="false">
            <h2>货物信息</h2>
            <table>
              <thead>
                <tr class="thead">
                  <th v-for="(item,index) in cargoInfo" :key="index" :index="index">
                    {{item.title}}
                  </th>
                </tr>
              </thead>
              <tbody class="tbody">
                <tr v-for="(item,index) in backInfo.consignments" :key="index" :index="index">

                  <td>{{index+1}}</td>
                  <td >{{item.consignmentName}}</td>
                  <td >{{item.consignmentCode}}</td>
                  <td >{{item.packageTypeName}}</td>
                  <td >{{item.packageType}}</td>
                  <td >{{item.orderAmount}}</td>
                  <td >{{item.orderTargetWeight}}</td>

                  <td >{{item.orderTargetVolume}}</td>

                  <td >{{item.unitPrice}}</td>

                  <td >{{item.unitVolume}}</td>
                  <td >{{item.totalPrice}}</td>
                  <td >{{item.deliveryCode}}</td>
                  <td >{{item.remark}}</td>

                </tr>
              </tbody>
            </table>
          </a-card>
          <a-card  :bordered="false">
            <h2>时间信息</h2>
            <a-row :gutter="16">
              <a-col :xs='6'>
                  <a-form-item :label="timeLabelInfo.requestTime" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{backInfo.reqDeliveryDate}}
                  </a-form-item>
              </a-col>
               <a-col  :xs='6'>
                  <a-form-item :label="timeLabelInfo.timeKeep" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{backInfo.timeLimit}}

                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>
                  <a-form-item  label="要求送货时间" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{backInfo.reqArrivalDate}}

                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>
                  <a-form-item :label="timeLabelInfo.checktime" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{backInfo.transportDate}}

                  </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card title=""  :bordered="false">
            <h2>回单信息</h2>
            <a-row>
              <a-col :xs='6'>
                  <a-form-item label="回单类型" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{backInfo.receiptTypeName}}

                  </a-form-item>
              </a-col>
               <a-col  :xs='6'>
                  <a-form-item label="回单份数" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{backInfo.receiptAmount}}

                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>
                  <a-form-item label="要求返回时间" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                     {{backInfo.reqReturnDate}}
                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>
                  <!-- <div>
                     {{backInfo.remark}}
                  </div> -->
              </a-col>
            </a-row>
          </a-card>

          <!-- <a-card title="费用信息">
            <a-row>
              <a-col :xs="12">
                  <a-form-item label="费用名称" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{}}
                  </a-form-item>
              </a-col>
               <a-col :xs="12">
                  <a-form-item label="费用金额" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{}}
                  </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :xs="12">
                  <a-form-item label="费用金额" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{}}
                  </a-form-item>
              </a-col>
            </a-row>
            <a-row>
            <a-col :xs="12">
                <a-form-item label="合计" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                  {{}}
                </a-form-item>
            </a-col>
            </a-row>
          </a-card>
          <a-card>
            <a-row>
              <a-col :xs="6">
                <a-form-item label="计费方式" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                  {{}}
                </a-form-item>
              </a-col>
              <a-col :xs="6">
                <a-form-item label="单价" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                  {{}}
                </a-form-item>
              </a-col>
            </a-row>
          </a-card> -->
          <a-card title="" :border="false">
            <h2>备注</h2>
            <div>
              {{backInfo.remark}}
            </div>
          </a-card>
        </a-form>
      </div>

  </div>
</template>
<script>
import BackBtn from '@/components/BackBtn'
import { orderDetail } from '@/api/order/order'

export default {
  name: 'orderdetail',
  data () {
    const { id } = this.$route.params
    return {
      id,
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 },
      formLayout: 'horizontal',
      backInfo: {},
      baseInfo: {
        orderId: '订单号',
        transportWay: '运输方式',
        clientName: '客户名称',
        carLong: '车长',
        clientNumber: '客户单号',
        carType: '车辆类型',
        personorderid: '手工单号',
        weight: '载重（kg）'
      },
      send: {
        GoodName: '发货方名称',
        MobilePhone: '发货方手机号',
        Area: '发货区域',
        Address: '发货方地址',
        Contact: '发货方联系人',
        Phone: '发货方座机号：',
        DefineArea: '自定义区'

      },
      receive: {
        GoodName: '收货方名称',
        MobilePhone: '收货方手机号',
        Area: '收货区域',
        Address: '收货方地址',
        Contact: '收货方联系人',
        Phone: '收货方座机号：',
        DefineArea: '自定义区'
      },
      cargoInfo: {
        num: { title: '序号' },
        cargo: { title: '货物名称' },
        cargoCode: { title: '货物代码' },
        cargoPackage: { title: '货物包装' },
        cargpType: { title: '货物类型' },
        cargoNumber: { title: '件数' },
        weigth: { title: '重量(KG)' },
        volume: { title: '体积（m³）' },
        // totalWay: { title: '计价方式' },
        price: { title: '单价' },
        freight: { title: '运费' },
        freightid: { title: '交货单号' },
        consignmentValue: { title: '申明价值' },
        unitWeight: { title: '单件重量' },
        unitVolume: { title: '单件体积' },
        remark: { title: '备注' }

      },
      timeLabelInfo: {
        requestTime: '要求提货时间',
        timeKeep: '时效',
        checktime: '托运时间'
      }
    }
  },
  components: {
    BackBtn
  },
  mounted () {
    console.log('>>>>>>>>>>', this.id)
    orderDetail({ orderId: this.id }).then(res => {
      this.backInfo = res.data
    })
  }
}
</script>
<style lang='less'>
  .thead{
    th{
      padding-left:20px;
      padding-right:20px;
    }
  }
  .tbody{
    tr{
      td{
        text-align:center;
      }
    }
  }
</style>
