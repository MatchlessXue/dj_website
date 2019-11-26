<template>
  <div>
    <a-drawer
      title="审批详情"
      :width="720"
      :maskClosable="businessType !== 1"
      :maskStyle="{ background: 'rgba(0,0,0,0.65)' }"
      @close="onClose"
      :wrapStyle="{ padding: 0, margin: 0, borderTop: '1px gray solid' }"
      :visible="visible">
      <div
        :style="{ display: 'block', background: '#1890FF', height: '40px', width: '100%', color: 'white' }"
        class="drawerTitleBox">
        <div
          :class="{approveHeadTab:true,approveContentDetail:true,active:currentTabIndex===1 }"
          @click="currentTabIndex=1">内容详情</div>
        <div
          :class="{approveHeadTab:true, approveFlow: true, active:currentTabIndex===2}"
          @click="currentTabIndex=2;handleToggleToApproveFlowClick()">审批流程</div>
      </div>
      <div
        v-show="currentTabIndex === 1">
        <a-collapse
          defaultActiveKey="1"
          @change="changeActivekey"
          :style="{ backgroundColor: 'white', border: 0 }">
          <a-collapse-panel
            key="1">
            <span slot="header" class="approveContentHeaderTitle">{{approveData.approveTitle}}</span>
            <a-row>
              <a-col
                :xl="12"
                :lg="12"
                :md="12"
                :sm="24">审批类型：{{approveData.approveTypeName}}</a-col>
              <a-col
                :xl="12"
                :lg="12"
                :md="12"
                :sm="24">审批单号：{{approveData.approveCode}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :xl="12"
                :lg="12"
                :md="12"
                :sm="24">审批状态：{{approveData.approveStatusName}}</a-col>
              <a-col
                :xl="12"
                :lg="12"
                :md="12"
                :sm="24">发起人：{{approveData.applyUserName}}</a-col>
            </a-row>
            <a-row>
              <a-col
                :xl="24"
                :lg="24"
                :md="24"
                :sm="24">发起时间：{{approveData.approveTime}}</a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
        <a-card
          v-show="isTSF"
          title="特殊费处理"
          :bordered="false">
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">特殊费编号：{{ businessDetailData.expenseCode }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">关联类型：{{ businessDetailData.relationTypeName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">关联单号：<a @click="handleDetail(businessDetailData)">{{ businessDetailData.codeName }}</a></a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">特殊费提交人：{{ businessDetailData.createAccountName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">发生时间：{{ businessDetailData.nodeDate }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">信息来源：{{ businessDetailData.sourceTypeName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">备注：{{ businessDetailData.nodeContent }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24"></a-col>
          </a-row>
          <a-row
            :gutter="16">
            <a-col
              :xl="24"
              :lg="24"
              :md="24"
              :sm="24">
              <viewer
                :images="businessDetailData.picJsons"
                :inline="true">
                <img style="margin-right: 8px;" v-for="(url, index) in businessDetailData.picJsons" :key="index" :src="url" :width="businessDetailData.picWidth">
              </viewer>
            </a-col>
          </a-row>
          <a-divider
            orientation="left">处理信息</a-divider>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">费用类型：{{ businessDetailData.nodeTypeName }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">费用金额：{{ businessDetailData.price }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">运输环节：{{ businessDetailData.transportTypeName }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">结算对象：{{ businessDetailData.settlementName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">结算方式：{{ businessDetailData.settlementTypeName }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">分摊方式：{{ businessDetailData.equalizationMethodName }}</a-col>
          </a-row>
        </a-card>
        <a-card
          v-show="isClaim"
          title="事件处理"
          :bordered="false">
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">事件编号：{{ businessDetailData.expenseCode }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">关联类型：{{ businessDetailData.relationTypeName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">关联单号：<a @click="handleDetail(businessDetailData)">{{ businessDetailData.codeName }}</a></a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">事件添加人：{{ businessDetailData.createAccountName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">添加时间：{{ businessDetailData.nodeDate }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">信息来源：{{ businessDetailData.sourceTypeName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">异常单号：{{ businessDetailData.exceptionCode }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24"></a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="24"
              :lg="24"
              :md="24"
              :sm="24">备注：{{ businessDetailData.remark }}</a-col>
          </a-row>
          <a-divider
            orientation="left">处理信息</a-divider>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">事件类型：{{ businessDetailData.nodeTypeName }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">金额：{{ businessDetailData.price }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">结算对象：{{ businessDetailData.settlementName }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">结算方式：{{ businessDetailData.settlementTypeName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">分摊方式：{{ businessDetailData.equalizationMethodName }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24"></a-col>
          </a-row>
        </a-card>
        <a-card
          v-show="isFinance"
          title="账单详情"
          :bordered="false">
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">账单编号：{{ businessDetailData.documentCode }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">账单名称：{{ businessDetailData.documentName }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="24"
              :lg="24"
              :md="24"
              :sm="24">账单备注：{{ businessDetailData.remark }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">结算对象：{{ businessDetailData.partnerName }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">账单金额：{{ businessDetailData.totalMoney }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">调差金额：{{ businessDetailData.tunedMoney }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">现付金额：{{ businessDetailData.settlementCurrent }}</a-col>
          </a-row>
          <a-row>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">到付金额：{{ businessDetailData.settlementArrival }}</a-col>
            <a-col
              :xl="12"
              :lg="12"
              :md="12"
              :sm="24">月付金额：{{ businessDetailData.settlementMonth }}</a-col>
          </a-row>
        </a-card>
        <div
          style="margin-bottom: 88px">
          <a-divider
            orientation="left">审批意见</a-divider>
          <a-row>
            <a-col
              :xl="24"
              :lg="24"
              :md="24"
              :sm="24"
              v-show="businessType === 1">
              <a-textarea
                v-model="currentApproveSuggest"
                placeholder="审批意见为空时，无法驳回审批单"
                :autosize="{ minRows: 2, maxRows: 6 }" />
            </a-col>
            <a-col
              :xl="24"
              :lg="24"
              :md="24"
              :sm="24"
              v-show="businessType !== 1">
              <div>{{ currentApproveSuggest || '' }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div
        v-show="currentTabIndex === 2">
        <div
          style="margin-top:25px">
          <div
            v-for="(flowData, index) in approveFlowData"
            :key="index">
            <a-row
              class="approveFlowRow">
              <a-col
                :xl="3"
                :lg="3"
                :md="3"
                :sm="3"
                class="approveFlowLeftCol">
                <div
                  class="approveFlowTime">{{ flowData.operationTime.split(' ')[1] }}</div>
                <div
                  class="approveFlowDate">{{ flowData.operationTime.split(' ')[0] }}</div>
              </a-col>
              <a-col
                :xl="3"
                :lg="3"
                :md="3"
                :sm="3"
                class="approveFlowMiddleCol">
                <img v-if="flowData.nodeStatus === 1" src="@assets/approve/approveIcon.png" />
                <img v-else src="@assets/approve/approveIconGray.png" />
              </a-col>
                <a-col
                  :xl="12"
                  :lg="12"
                  :md="12"
                  :sm="12"
                  class="approveFlowRightCol">
                  <span>{{ getApproveFlowNodeDesc(flowData, index, 'approveUser') }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>{{ getApproveFlowNodeDesc(flowData, index, 'ccUser') }}</span>
                </a-col>
            </a-row>
            <a-row
              v-show="index !== approveFlowData.length - 1">
              <a-col
                :xl="3"
                :lg="3"
                :md="3"
                :sm="3"
                class="approveFlowLeftCol">
              </a-col>
              <a-col
                :xl="1"
                :lg="1"
                :md="1"
                :sm="3">
                <a-divider
                  class="splitLineVertically"
                  type="vertical" />
              </a-col>
              <a-col
                :xl="12"
                :lg="12"
                :md="12"
                :sm="12">
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <div
        v-show="businessType === 1"
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          marginTop: '50px',
          background: '#fff',
          textAlign: 'right'
        }">
        <a-popconfirm
          title="确定是否审批驳回?"
          @confirm="handleApproveRejectClick"
          okText="确定"
          :visible = "rejectVisible"
          @visibleChange="handleVisibleChange"
          cancelText="取消">
          <a-button :disabled="!currentApproveSuggest">
            驳回
          </a-button>
        </a-popconfirm>&nbsp;&nbsp;&nbsp;
        <a-popconfirm
          title="确定是否审批通过?"
          @confirm="handleApprovePassClick"
          okText="确定"
          cancelText="取消">
          <a-button
            type="primary">通过</a-button>
        </a-popconfirm>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import {
  getTrackBusinessFeeDetail
} from '@/api/track/track.js'
import {
  approveListBase
} from '../mixins/approve_list_base'
import { getEntityDocumentDetail } from '@/api/settle'
// import { request } from 'https'
export default {
  mixins: [approveListBase],
  props: {
    businessType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {

      form: this.$form.createForm(this),
      visible: false,
      rejectVisible: false,
      approveData: {},
      businessDetailData: {},
      approveFlowData: [],
      currentApproveSuggest: '',
      currentTabIndex: 1
    }
  },
  computed: {
    // true：特殊费 false:其他
    isTSF () {
      const modelCode = this.approveData.modelCode
      return modelCode === 'specialFee'
    },
    // true: 索赔或赔偿 false:其他
    isClaim () {
      const modelCode = this.approveData.modelCode
      return ['claimFee', 'payforFee'].includes(modelCode)
    },
    // true: (司机/客户/承运商对账) false:其他
    isFinance () {
      const modelCode = this.approveData.modelCode
      return ['customerSettle', 'carrierSettle', 'driverSettle'].includes(modelCode)
    },
    approvePartReqData () {
      const {
        approveId,
        businessId
      } = this.approveData
      return {
        approveId,
        businessId,
        approveSuggest: this.currentApproveSuggest
      }
    }
  },
  methods: {
    handleVisibleChange (visible) {
      if (!visible) {
        this.rejectVisible = false
        return
      }
      // Determining condition before show the popconfirm.
      if (!this.currentApproveSuggest) {
        this.rejectVisible = false
      } else {
        this.rejectVisible = true
      }
    },
    handleApproveRejectClick () {
      this.approvePassOrReject({
        operaType: 2,
        ...this.approvePartReqData
      }, this.isIndependent).then(res => {
        this.$message.success('驳回成功！')
        this.$emit('onSuccess', false)
        this.onClose()
      })
    },
    handleApprovePassClick () {
      this.approvePassOrReject({
        operaType: 1,
        ...this.approvePartReqData
      }, this.isIndependent).then(res => {
        this.$message.success('审核通过！')
        this.$emit('onSuccess', true)
        this.onClose()
      })
    },
    getApproveFlowNodeDesc (flowData, index, operatorType) {
      if (index === 0 && operatorType === 'approveUser') {
        return `发起人：${flowData.starterName}`
      } else {
        return operatorType === 'approveUser' ? `审批人：${flowData.approverName}` : flowData.copiederName ? `抄送人：${flowData.copiederName}` : ''
      }
    },
    handleToggleToApproveFlowClick () {
      this.getApproveFlowList({
        approveId: this.approveData.approveId
      }, this.isIndependent).then(res => {
        console.log('handleToggleToApproveFlowClick515', res)
        this.approveFlowData = res || []
      })
    },
    loadBusinessDetailData () {
      if (this.isTSF || this.isClaim) {
        // 获取特殊费或索赔或赔偿详情
        getTrackBusinessFeeDetail({
          expenseId: this.approveData.businessId
        }).then(res => {
          const item = res.data || {}
          this.processBusinessDetailDataItem(item)
          this.businessDetailData = item
        }).catch(() => {
          this.businessDetailData = {}
        })
      } else {
        // 获取
        getEntityDocumentDetail({
          documentId: this.approveData.businessId
        }).then(res => {
          this.businessDetailData = res.data || {}
        }).catch(() => {
          this.businessDetailData = {}
        })
      }
    },
    processBusinessDetailDataItem (item) {
      item.nodeType = String(item.nodeType)
      item.picJsons = JSON.parse(item.picJson)
      if (typeof item.picJsons === 'string') {
        item.picJsons = JSON.parse(item.picJsons)
      }
      if (item.picJsons && item.picJsons.length !== 0) {
        item.picWidth = (item.picJsons.length + 1) * 55
      } else {
        item.picWidth = 0
      }
      console.log('processBusinessDetailDataItem>515', item)
    },
    changeActivekey (key) {
      console.log(key)
    },
    showDrawer (approveData) {
      this.visible = true
      console.log('showDrawer (approveData515', approveData)
      this.approveData = approveData
      this.currentApproveSuggest = this.approveData.approveSuggest
      this.loadBusinessDetailData()
    },
    onClose () {
      this.visible = false
      this.approveData = {}
    }
  }
}
</script>

<style lang="less">

.ant-drawer-body {
  padding: 0;
}

.approveHeadTab {
  line-height: 40px;
  cursor: pointer;
}

.approveContentDetail {
  margin-left: 32px;
}

.drawerTitleBox {
  &>div {
    position: relative;
    display: inline-block;
    width: auto;
    height: 100%;
    padding: 0 10px;

    &.active::before {
      content: " ";
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 1;
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-bottom: 6px solid white;
      border-left: 6px solid transparent;
      transform: translateX(-50%);
    }
  }
}

.ant-collapse>.ant-collapse-item>.ant-collapse-header .arrow {
  left: 95%;
}

.approveContentHeaderTitle {
  height: 22px;
  margin-left: 20px;
  color: #000;
  font-family: PingFangSC-Medium;
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
}

.ant-collapse>.ant-collapse-item>.ant-collapse-header {
  padding-left: 0;
}

.ant-card-body,
.ant-collapse-content>.ant-collapse-content-box {
  padding: 0;
}

.ant-row {
  padding-left: 30px;
  line-height: 30px;
}

.splitLineVertically {
  width: 1px;
  height: 33px;
  background: rgba(24, 144, 255, 1);
}

.ant-divider,
.ant-divider-vertical {
  margin: 0 10px;
}

.approveIcon {
  line-height: 0;
}

.approveFlowRow {
  line-height: 38px;
  // margin-top: 25px;
}

.approveFlowLeftCol {
  margin-right: 15px;
  text-align: center;
  vertical-align: middle;
}

.approveFlowRightCol {
  padding-left: 5px;
  margin: 0;
}

.approveFlowTime {
  height: 22px;
  padding-right: 0;
  color: rgba(0, 0, 0, .65);
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.approveFlowDate {
  height: 22px;
  color: rgba(0, 0, 0, .65);
  font-family: PingFangSC-Regular;
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
}

.approveFlowMiddleCol {
  width: 35px;
  padding: 0;
  margin: 0;
}
</style>
