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
                <a-form-item :label="baseInfo.orderId" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{infor.waybillCode}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item :label="baseInfo.transportWay" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{infor.transportTypeName}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item :label="baseInfo.clientName" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{infor.partnerName}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item :label="baseInfo.carLong"  :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{infor.truckLengthName}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :xl="6" :lg="6" :md="12" :sm="24">
                <a-form-item :label="baseInfo.clientNumber" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{infor.clientCode}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item :label="baseInfo.carType" :labelCol="{ span: 8 }" :wrapperCol="wrapperCol">
                  {{infor.truckTypeName}}
                </a-form-item>
              </a-col>
               <a-col :xl="6" :lg="6" :md="12" :sm="24">
                <a-form-item :label="baseInfo.personorderid" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  {{infor.manualCode}}
                </a-form-item>
              </a-col>
              <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
                <a-form-item :label="baseInfo.weight" :labelCol="{ span: 8 }" :wrapperCol="wrapperCol">
                  {{infor.truckLoad}}
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
                       <a-form-item :label="send.GoodName" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.sdName}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item :label="send.Contact" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.sdContact}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :xs="12">
                       <a-form-item :label="send.MobilePhone" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.sdMobile}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item :label="send.Phone" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.sdTel}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                     <a-col :xs="12">
                       <a-form-item :label="send.Area" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.sdAddressArea}}
                      </a-form-item>
                    </a-col>
                    <a-col :xs="12">
                       <a-form-item :label="send.DefineArea" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.sdCustomAreaName}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                     <a-col :xs="24">
                       <a-form-item label="发货方地址" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.sdAddress}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-card>
              </a-col>
              <a-col  :xs="12">
                <a-card  :bordered="false" >
                    <h2>收货方信息</h2>
                    <a-row :gutter="24">
                      <a-col :xs="12">
                        <a-form-item :label="receive.GoodName" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                          {{infor.rvName}}
                        </a-form-item>
                      </a-col>
                      <a-col :xs="12">
                        <a-form-item :label="receive.Contact" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                          {{infor.rvContact}}
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :xs="12">
                        <a-form-item :label="receive.MobilePhone" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                          {{infor.rvMobile}}
                        </a-form-item>
                      </a-col>
                      <a-col :xs="12">
                        <a-form-item :label="receive.Phone" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                          {{infor.rvTel}}
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :xs="12">
                        <a-form-item :label="receive.Area" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                          {{infor.sdAddressArea}}
                        </a-form-item>
                      </a-col>
                      <a-col :xs="12">
                        <a-form-item :label="receive.DefineArea" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                          {{infor.rvCustomAreaName}}
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                     <a-col :xs="24">
                       <a-form-item label="收货方地址" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                        {{infor.rvAddress}}
                      </a-form-item>
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
                  <th v-for="(item,index) in cargoInfo" :key="index">
                    {{item.title}}
                  </th>
                </tr>
              </thead>
              <tbody style="text-align:center;">
                <tr v-for="(item,index) in cargoInfo2" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{item.consignmentName}}</td>
                  <td>{{item.consignmentCode}}</td>
                  <td>{{item.packageTypeName}}</td>
                  <td>{{item.consignmentTypeName}}</td>
                  <td>{{item.actualAmount}}</td>
                  <td>{{item.actualWeight}}</td>
                  <td>{{item.actualVolume}}</td>
                  <td>{{item.consignmentName}}</td>
                  <td>{{item.unitPrice}}</td>
                  <td>{{item.totalPrice}}</td>
                  <td>{{item.deliveryCode}}</td>
                  <td>{{item.remark}}</td>
                </tr>
              </tbody>
            </table>
          </a-card>
          <a-card  :bordered="false">
            <h2>时间信息</h2>
            <a-row :gutter="16">
              <a-col :xs='6'>
                  <a-form-item :label="timeLabelInfo.requestTime" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{infor.reqDeliveryDate}}
                  </a-form-item>
              </a-col>
               <a-col  :xs='6'>
                  <a-form-item :label="timeLabelInfo.timeKeep" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{infor.timeLimit}}
                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>
                  <a-form-item :label="timeLabelInfo.requestTime" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{infor.reqArrivalDate}}
                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>
                  <a-form-item :label="timeLabelInfo.checktime" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{infor.transportDate}}
                  </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card title=""  :bordered="false">
            <h2>回单信息</h2>
            <a-row>
              <a-col :xs='6'>
                  <a-form-item label="回单类型" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{infor.receiptTypeName}}
                  </a-form-item>
              </a-col>
               <a-col  :xs='6'>
                  <a-form-item label="回单份数" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{infor.receiptAmount}}
                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>
                  <a-form-item label="要求返回时间" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
                    {{infor.returnDate}}
                  </a-form-item>
              </a-col>
              <a-col  :xs='6'>

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
              {{infor.remark}}
            </div>
          </a-card>
        </a-form>
      </div>

  </div>
</template>
<script>
import BackBtn from '@/components/BackBtn'
import { receiptDetail } from '@/api/receipt/receipt.js'
export default {
  name: 'receiptDetail',
  data () {
    const { id } = this.$route.params
    return {
      id,
      infor: '',
      cargoInfo2: [],
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 },
      formLayout: 'horizontal',
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
        weigth: { title: '重量' },
        volume: { title: '体积（m）' },
        totalWay: { title: '计价方式' },
        price: { title: '单价' },
        freight: { title: '运费' },
        freightid: { title: '交货单号' },
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
  created () {
    this.getFormData()
    // console.log(this.$route)
    // console.log(this.id);
  },
  methods: {
    getFormData () {
      if (this.id) {
        receiptDetail({ waybillId: this.id }).then(res => {
          // console.log(res);
          this.infor = res.data
          this.cargoInfo2 = res.data.consignments
        })
      }
    }
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
</style>
