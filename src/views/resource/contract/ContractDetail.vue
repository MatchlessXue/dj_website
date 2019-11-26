<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级"/>
    <an-editable-card title="基础信息" :isShowEditButton="isShowEditButtonForBasicInfo" @EditClicked="toggleToEditStatusForBasicInfo">
      <a-form :form="formForContractBasicInfo" class="form">
        <a-form-item>
          <a-input type="hidden" v-decorator="['contractId']"></a-input>
        </a-form-item>
        <div v-show="isShowEditButtonForBasicInfo">
          <a-row>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="合同名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{currentContractBasicInfo.contractName}}
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="合同类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{currentContractBasicInfo.contractTypeName}}
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="合作伙伴" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{currentContractBasicInfo.partnerName}}
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{currentContractBasicInfo.projectName}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row">
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="开始日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{getFormatDate(currentContractBasicInfo.beginDate)}}
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="结束日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{getFormatDate(currentContractBasicInfo.endDate)}}
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="运输类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{currentContractBasicInfo.transportTypeName}}
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="车辆类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{currentContractBasicInfo.truckTypeName}}
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div v-show="!isShowEditButtonForBasicInfo">
          <a-row class="form-row" :gutter="60">
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="合同名称">
                <a-input v-decorator="['contractName',{ rules: [{ required: true, message: '请输入合同名称!' }]}]"
                         maxlength="50" placeholder="请输入合同名称"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="合同类型">
                <a-select :disabled="!!currentContractId" allowClear placeholder="请选择类型" @change="changeContractType" v-decorator="['contractType',{
            rules: [{ required: true, message: '请选择类型!' }]}]">
                  <a-select-option v-for="value in contractTypeData" :key="value.value">{{value.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="合作伙伴">
                <a-select placeholder="请选择合作伙伴" allowClear showSearch @change="changePartnerType"
                          :filterOption="filterOption" v-decorator="['partnerId',{
            rules: [{ required: !isPartnerListDisabled, message: '请选择合作伙伴!' }]}]" :disabled="isPartnerListDisabled">
                  <a-select-option v-for="value in allPartnerDataMap" :key="value.partnerId">{{value.partnerName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="项目">
                <a-select placeholder="请选择项目" allowClear showSearch :filterOption="filterOption" v-decorator="['projectId',{
            rules: [{ required: !isProjectDisabled, message: '请选择所属项目!' }]}]" :disabled="isProjectDisabled">
                  <a-select-option v-for="value in allProjectDataMap" :key="value.projectId">{{value.projectName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="60">
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="合同日期">
                <a-range-picker v-decorator="['contractDate',{
            rules: [{ required: !isPartnerListDisabled, message: '请选择合同有效期!' }]}]" :format="'YYYY-MM-DD'"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="运输类型">
                <a-select placeholder="请选择运输类型" allowClear v-decorator="['transportType',{
            rules: [{ required: true, message: '请选择运输类型!' }]}]">
                  <a-select-option v-for="value in transportTypeMap" :key="value.dictId">{{value.dictName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="12" :sm="24">
              <a-form-item label="车辆类型">
                <a-select placeholder="请选择车辆类型" allowClear v-decorator="['truckType']">
                  <a-select-option v-for="value in truckTypeMap" :key="value.dictId">{{value.dictName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col style="margin-top:43px" :xl="6" :lg="6" :md="12" :sm="24">
              <a-button @click="cancelSubmitForBasicInfo" class="cancelButton">取消</a-button>&nbsp;&nbsp;
              <a-button type="primary" @click="handleSubmitForBasicInfo" class="confirmButton" :loading="loading">确认</a-button>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </an-editable-card>
    <a-card title="线路价格信息" >
      <span href="#" slot="extra" v-show="currentContractRoadLineList.length > 1">
        <span class="roadLineButton" @click="handleAllExpandButton"><a-icon type="fullscreen" />全部展开</span>
        <a-divider type="vertical" />
        <span class="roadLineButton" @click="handleAllCollapseButton" ><a-icon type="fullscreen-exit" />全部折叠</span>
      </span>
      <!-- <a-row v-show="isShowOperationButton"> --><!--前端暂时隐藏-->
      <a-row v-show="isShowOperationButton">
        <a-col>
          <a-button @click="importTem">导入合同线路</a-button>
          <a-button style="margin:10px" @click="importHistory">导入历史</a-button>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" v-show="isShowOperationButton">
        <a-col :span="16">
          <a-button class="addRoadLineButton"
                    icon="plus"
                    @click="handleAddLinePrice"
                    type="dashed">
            添加线路及费用
          </a-button>
        </a-col>
      </a-row>
      <br>
      <!--循环展示已有的分页线路s-->
      <a-form v-for="(item, roadLineIndex) in currentContractRoadLineList" :key="item.regionKey" :form="item.form"
              layout="inline"
              class="add-line-price-form">
        <a-form-item class="hide-form-item">
          <a-input type="hidden" v-decorator="['contractId',
          { initialValue: currentContractBasicInfo.contractId }]"/>
        </a-form-item>
        <a-form-item class="hide-form-item">
          <a-input type="hidden" v-decorator="['regionKey', { initialValue: item.regionKey }]"/>
        </a-form-item>

        <!--线路信息》编辑-->
        <a-card class="roadLineBackgroud" v-show="!getIsShowEditButtonForRoadLinePrice(item)">
          <a-row @dblclick.native="handleRoadLineExpandableButton(item)">
              <a-col :md="5" :sm="24">
                <a-form-item label="发货区域">
                  <a-cascader
                    :showSearch="{filter}"
                    allowClear
                    changeOnSelect
                    :options="regionsMap"
                    expandTrigger="hover"
                    placeholder="请选择发货区域"
                    v-decorator="['sendRegion', {rules: [{required: true, message: '请选择发货区域'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-form-item label="收货区域">
                  <a-cascader
                    :showSearch="{filter}"
                    changeOnSelect
                    allowClear
                    :options="regionsMap"
                    expandTrigger="hover"
                    placeholder="请选择收货区域"
                    v-decorator="['receiveRegion', {rules: [{required: true, message: '请选择收货区域'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="5" :sm="24">
                <a-form-item label="时效(小时)">
                  <a-input-number :min="1"
                                  style="width: 100%"
                                  v-decorator="['timeLimit']"
                                  placeholder="请输入时效" maxLength="9"/>
                </a-form-item>
              </a-col>
<!--              <a-col :md="5" :sm="24" v-if="!isShowTruckCostForm">-->
<!--                <a-form-item label="最低收费">-->
<!--                  <a-input-number :min="1"-->
<!--                                  style="width: 100%"-->
<!--                                  v-decorator="['initPrice']"-->
<!--                                  placeholder="请输入最低收费" maxLength="9"/>-->
<!--                </a-form-item>-->
<!--              </a-col>-->
              <a-col :md="5" :sm="24" v-if="isShowTruckCostForm">
                <a-form-item label="车长(m)">
                  <a-select placeholder="请选择车长"
                            style="width: 200px"
                            v-decorator="['truckLength', {rules: [{required: true, message: '请选择车长'}]}]">
                    <a-select-option v-for="value in truckLongsMap"
                                     :key="value.dictId">{{value.dictName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-form-item label="">
                  <a-icon class="roadLineButton" @click="handleRoadLineExpandableButton(item)"
                          :type="item.isRoadLineExpanded ? 'down' : 'right'"/>
                </a-form-item>
                <a-form-item label="">
                <span class="roadLineButton" @click="handleRoadLinePriceDeleteButton(item, roadLineIndex)">
                  <a-icon type="delete" />删除
                </span>
                </a-form-item>
              </a-col>
            </a-row>
          <div v-show="item.isRoadLineExpanded"
               :key="term.routePriceId"
                v-for="(term, termIndex) in item.otherCosts">
            <a-divider />
            <a-form :form="term.form">
              <a-form-item class="hide-form-item">
                <a-input type="hidden" v-decorator="['routePriceId', { initialValue: term.routePriceId }]"/>
              </a-form-item>
              <div style="display:flex;">
                <a-col style="width:11%">
                  <a-form-item label="费用类型">
                    <a-select
                      style="width: 120px" allowClear
                      placeholder="请选择费用类型"
                      @change="handleCostTypeChange(term, $event)"
                      v-decorator="['priceType', {rules: [{required: true, message: '请选择费用类型'}]} ]">
                      <a-select-option v-for="value in costTypeMapN" :key="value.subDictId">
                        {{value.subDictName}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <!-- 2019年05月14日13:58:08-最低收费-黄雪峰-prd1.2.1 -->
                <a-col style="width:11%" v-if="currentContractBasicInfo.transportTypeName === '零担'">
                  <a-form-item label="最低收费">
                    <a-input-number :min="0" :max="999999.999" decimalSeparator="." :precision="4"
                                    style="width: 120px"
                                    v-decorator="['initPrice']"
                                    placeholder="请输入最低收费"
                                    :disabled="handleCostTypeChangeDisabled(term)"
                                    :formatter='chknum1' :parser='chknum1'/>
                  </a-form-item>
                </a-col>
                <a-col style="width:11%"
                       v-show="!term.isTransportFeeForTruckLength">
                  <a-form-item label="计费方式">
                    <a-select
                      style="width: 120px" allowClear
                      placeholder="请选择计费方式"
                      :disabled="term.isTransportFeeForWeightLoad"
                      v-decorator="['priceUnit', {rules: [{required: !term.isTransportFeeForTruckLength, message:
                      '请选择计费单位'}]} ]">
                      <a-select-option v-for="value in priceUnitMap" :key="value.dictId">
                        {{value.dictName}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col style="width:11%">
                  <a-form-item label="区间类型">
                    <a-select
                      style="width: 120px" allowClear
                      placeholder="请选择区间类型"
                      :disabled="term.isTransportFeeForTruckLength"
                      v-decorator="['intervalType', {rules: [{required: true, message: '请选择区间类型'}]} ]">
                      <a-select-option v-for="value in scopeTypeMap" :key="value.dictId">
                        {{value.dictName}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col style="width:11%">
                  <a-form-item label="区间下限">
                    <a-input
                      style="width: 120px"
                      :disabled="term.isTransportFeeForTruckLength"
                      v-decorator="['lowerLimit', {rules: [{required: true, message: '请输入下限'},{validator: term.isTransportFeeForTruckLength? validMaxNumber : validNumber}]}]"
                      placeholder="请输入下限" maxLength="8"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="width:11%">
                  <a-form-item label="区间上限">
                    <a-input
                      :disabled="term.isTransportFeeForTruckLength" 
                      v-decorator="['upperLimit', {rules: [{required: !term.isTransportFeeForTruckLength, message: '请输入上限'},{validator: term.isTransportFeeForTruckLength? validMaxNumber : validNumber}]}]"
                      :placeholder="term.isTransportFeeForTruckLength ? '无穷' : '请输入上限'" maxLength="8"
                      style="width: 120px"
                    />
                  </a-form-item>
                </a-col>
                <a-col style="width:11%">
                  <a-form-item label="价格类型">
                    <a-select
                      style="width: 120px" allowClear
                      placeholder="请选择价格类型"
                      v-decorator="['computeType', {rules: [{required: true, message: '请选择价格类型'}]} ]">
                      <a-select-option v-for="value in computeTypeMap" :key="value.dictId">
                        {{value.dictName}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col style="width:11%">
                  <a-form-item label="价格">
                    <a-input-number :min="0" :max="999999.999" decimalSeparator="." :precision="6"
                                    style="width:120px"
                                    v-decorator="['price', {rules: [{required: true, message: '请输入价格'}]}]"
                                    placeholder="请输入价格"
                                    :formatter='chknum' :parser='chknum'/>
                  </a-form-item>
                </a-col>
                <a-col style="width:11%">
                  <a-form-item label="" style="margin-top:38px;">
                    <a-form-item label="">
                      <span class="roadLineButton" @click="handleTermDeleteButton(item, roadLineIndex, term,
                      termIndex)">删除</span>
                    </a-form-item>
                    <a-form-item label="" v-if="isShowAddForTerm(item, term, termIndex)">
                      <span class="roadLineButton" @click="handleTermAddButton(item, term)">添加</span>
                    </a-form-item>
                  </a-form-item>
                </a-col>
              </div>
            </a-form>
            <br>
          </div>
          <a-row>
            <a-col :xl="{span:6, offset: 18, push: 1}"
                   :lg="{span:6, offset: 18, push: 1}"
                   :md="{span:12, offset: 12, push: 1}"
                   :sm="{span:24}">
              <a-button @click="cancelSubmitForRoadLinePrice(item)" class="cancelButton">取消</a-button>&nbsp;&nbsp;
              <a-button type="primary"
                        @click="handleSubmitForRoadLinePrice($event, item)"
                        class="confirmButton"
                        :disabled="(!!item.isDisabled)">确认
              </a-button>
            </a-col>
          </a-row>
        </a-card>
        <!--线路信息》展示-->
        <a-card class="roadLineBackgroud" v-show="getIsShowEditButtonForRoadLinePrice(item)">
          <a-row title="双击可以展开或折叠当前线路" @dblclick.native="handleRoadLineExpandableButton(item)">
            <a-col :md="5" :sm="24">
              <a-form-item label="发货区域">
                {{item.routeAgeing.sendRegionAddress}}
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="收货区域">
                {{item.routeAgeing.receiveRegionAddress}}
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="时效(小时)">
                {{item.routeAgeing.timeLimit}}
              </a-form-item>
            </a-col>
<!--            <a-col :md="5" :sm="24" v-if="!isShowTruckCostForm">-->
<!--              <a-form-item label="最低收费">-->
<!--                {{item.routeAgeing.initPrice}}-->
<!--              </a-form-item>-->
<!--            </a-col>-->
            <a-col :md="5" :sm="24" v-if="isShowTruckCostForm">
              <a-form-item label="车长(m)">
                {{item.routeAgeing.truckLengthName}}
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item label="">
                <a-icon class="roadLineButton" @click="handleRoadLineExpandableButton(item)"
                        :type="item.isRoadLineExpanded ? 'down' : 'right'"/>
              </a-form-item>
              <a-form-item label="">
                <span @click="toggleToEditStatusForRoadLinePrice(item,roadLineIndex)"  class="topRightEdit">
                  <a-icon type="edit"/>
                  <span>编辑</span>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
          <div v-show="item.isRoadLineExpanded" :key="termIndex" v-for="(term, termIndex) in item.otherCosts">
            <a-divider />
            <a-row>
              <a-col :md="3" :sm="24">
                <a-form-item label="费用类型">
                  {{term.priceTypeName}}
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24" v-if="term.initPrice">
                <a-form-item label="最低收费">
                  {{term.initPrice}}
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24"
                     v-show="!term.isTransportFeeForTruckLength">
                <a-form-item label="计费方式">
                  {{term.priceUnitName}}
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24">
                <a-form-item label="区间类型">
                  {{getScopeTypeName(term.intervalType)}}
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24">
                <a-form-item label="区间下限">
                  {{term.lowerLimit}}
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24">
                <a-form-item label="区间上限">
                  {{ term.isTransportFeeForTruckLength ? '无穷' : term.upperLimit }}
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24">
                <a-form-item label="价格类型">
                  {{getComputeTypeName(term.computeType)}}
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24">
                <a-form-item label="价格">
                  {{term.price}}
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-form>
      <br>
      <!--分页here-->
      <a-row type="flex" justify="center">
        <a-col :span="12">
          <a-pagination
            @change="handlePageChange"
            @showSizeChange="hanlePageSizeChange"
            v-show="isShowPagination"
            showSizeChanger
            showQuickJumper
            :pageSizeOptions="pageSizeOptions"
            :total="totalContractRouteList"
            :showTotal="(total, range) => `第${range[0]}-${range[1]}条，总共 ${total} 条线路`"
            :pageSize="pagination.pageSize"
            :defaultCurrent="pagination.pages"
          />
        </a-col>
      </a-row>
    </a-card>
    <import-template ref="importTemplateRef"
                     :templateType="1"
                     :templateSubType="currentTransportType"
                     :contractId="currentContractId"
                     @success="importTempSuccess"
                     title="导入合同线路">
    </import-template>
    <import-history ref="importHistoryRef"></import-history>
  </div>
</template>

<script>
import { validateNumLetter, validNumber, validMaxNumber } from '@/utils/validate'
import BackBtn from '@/components/BackBtn'
import moment from 'moment'
import {
  contractdetail,
  contractsave,
  getContractRouteList,
  saveOrUpdateContractRoute,
  getSingleContractRoute,
  deleteContractRoute
} from '@/api/resource/contract'
import AnEditableCard from '@/views/resource/contract/components/EditableCard'
import { getContractType, getFeeList } from '@/api/libraries'
import librariesBase from '@views/mixins/libraries_base'
import contractBase from '@views/resource/contract/mixins/contract_base'
import datumBase from '@views/mixins/datum_base'
import { getInfo } from '@/api/login'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import { globalMap } from '@/api/global'
import ImportTemplate from '@/components/ImportTemplate/'
import ImportHistory from '@/views/resource/components/ImportHistory' // 导入历史

export default {
  name: 'ContractDetail',
  mixins: [librariesBase, datumBase, contractBase],
  components: {
    ACol,
    ARow,
    BackBtn,
    AnEditableCard,
    ImportTemplate,
    ImportHistory
  },
  data () {
    const { contractId, isDetail, isFromRoadLineEdit, regionKeyOnRoadLineEdit } =
      this.getJsonObjectFromIdPack(this.$route.params.id)
    return {
      validNumber,
      validMaxNumber,
      currentContractId: contractId,
      isFromRoadLineEdit,
      regionKeyOnRoadLineEdit,
      isShowEditButton: isDetail,
      isRoadLineExpanded: false,
      isShowPriceForm: false, // 是否显示添加线路及费用弹窗
      isShowEditButtonForBasicInfo: isDetail,
      isShowEditButtonForRoadLinePrice: isDetail,
      isShowAddRoadLinePriceButton: true,
      currentContractBasicInfo: {},
      currentContractRoadLineList: [],
      validateNumLetter,
      loading: false,
      formForNewContractRoadLine: this.$form.createForm(this),
      formForContractBasicInfo: this.$form.createForm(this),
      formsForRoadLinePrice: [],
      isPartnerListDisabled: false,
      isProjectDisabled: false,
      contractTypeData: [], // 合同类型
      labelCol: { span: 8 },
      wrapperCol: { span: 14, offset: 1 },
      pagination: {
        pageSize: 10,
        page: 1
      },
      NewFeeList: []
    }
  },
  computed: {
    cargoTypeMapN () {
      return [
        { dictId: 0, dictName: '无' },
        ...this.cargoTypeMap
      ]
    },
    costTypeMapN () {
      return this.NewFeeList
    },
    // 最低收费
    isShowTruckCostForm () {
      // 2: 整车
      return this.currentContractBasicInfo.transportType === globalMap.transportType_zc
    },
    // 分页
    totalContractRouteList () {
      console.log('totalContractRouteList,', this.currentContractRoadLineList, this.pagination)
      return this.pagination.total
    },
    // 分页显示
    isShowPagination () {
      return !this.isFromRoadLineEdit && (this.pagination.total || 0) > 0
    },
    // 导入合同路线
    isShowOperationButton () {
      return !this.isFromRoadLineEdit && this.isShowAddRoadLinePriceButton
    },
    // 导入合同路线
    currentTransportType () {
      return this.currentContractBasicInfo.transportType
    },
    // 分页配置
    pageSizeOptions () {
      return ['1', '10', '20', '30', '40', '50']
    }
  },
  created () {
    // 获取用户信息
    this.getInfoMap()

    // 获取合同类型
    this.getContractTypeMap()

    // 获取车辆类型
    this.getTruckTypeByDataStatusMap()

    // 获取运输类型
    this.getTransportTypeMap()

    // 获取费用类型
    this.getCostTypeByDataStatusMap()

    // 获取计费单位
    this.getPriceUnitMap()

    // 获取线路区间类型
    this.getRouteIntervalTypeMap()

    // 获取线路价格类型
    this.getRouteComputeTypeMap()

    // 获取车长数据
    this.getTruckLongsMap()

    this.getContractBasicInfoFormData(this.currentContractId)

    this.getContractRoadLinePriceList(this.currentContractId)

    // 获取省市区数据
    this.getRegions()
  },
  methods: {
    // 费用类型切换
    handleCostTypeChange (term, newValue) {
      // term.form.resetFields()
      console.log('this.costTypeMapN515', this.costTypeMapN, term, newValue)
      const item = this.costTypeMapN.filter(costType => costType.subDictId === newValue && costType.expenseTag === 'TRANSPORT')
      console.log('item515', item)
      const isTransportFee = !!item && item.length === 1
      term.isTransportFeeForTruckLength = this.currentTransportType === 2 && isTransportFee
      term.isTransportFeeForWeightLoad = this.currentTransportType === 3 && isTransportFee
      console.log(' handleCostTypeChange (term, newValue)', term.isTransportFeeForTruckLength,
        term.isTransportFeeForWeightLoad)
      // 整车载重下选择运费时 计费方式固定为重量且不让选
      term.isTransportFeeForWeightLoad && term.form.setFieldsValue({ priceUnit: 2 })
      // 整车车长下选择运费时 计费方式隐藏，区间类型为范围区间，区间0-无穷
      term.isTransportFeeForTruckLength && term.form.setFieldsValue({ intervalType: 1, lowerLimit: 0 })
    },
    handleCostTypeChangeDisabled (term) {
      let type = term.form.getFieldsValue()
      let arr = []
      this.costTypeMapN && this.costTypeMapN.forEach(item => {
        if (item.subDictId === type.priceType) {
          arr.push(item)
        }
      })
      // 初始化防止报错
      if (arr.length <= 0) {
        return
      }
      if (arr[0].expenseTag === 'TRANSPORT') {
        return false
      }
      return true
    },
    // 线路信息-全部展开
    handleAllExpandButton () {
      this.expandOrCollapseTermDetails(true)
    },
    // 线路信息-全部折叠
    handleAllCollapseButton () {
      this.expandOrCollapseTermDetails(false)
    },
    expandOrCollapseTermDetails (isExpandOrCollapse) {
      // this.currentContractRoadLineList 线路信息数据列表
      this.currentContractRoadLineList.forEach(route => {
        route.isRoadLineExpanded = isExpandOrCollapse
      })
    },
    // 获取区间类型
    getScopeTypeName (type) {
      let find = this.scopeTypeMap.find(item => item.dictId === type)
      if (find) return find.dictName
      return ''
    },
    // 获取价格类型
    getComputeTypeName (type) {
      let find = this.computeTypeMap.find(item => item.dictId === type)
      if (find) return find.dictName
      return ''
    },
    // 分页page切换
    hanlePageSizeChange (current, size) {
      this.refreshPagingData(current, size)
    },
    // 分页数据切换
    handlePageChange (page, pageSize) {
      this.refreshPagingData(page, pageSize)
    },
    // 刷新分页数据
    refreshPagingData (page, pageSize) {
      console.log('refreshPagingData (page, pageSize)', page, pageSize)
      this.pagination = { ...this.pagination, page, pageSize }
      this.getContractRoadLinePriceList(this.currentContractId)
    },
    // 时效小时后面的删除按钮对应的方法
    handleRoadLinePriceDeleteButton (item, roadLineIndex) {
      console.log('handleRoadLinePriceDeleteButton (item, roadLineIndex)', item, item.regionKey,
        this.currentContractRoadLineList)
      if (item.regionKey === undefined) {
        this.currentContractRoadLineList.splice(roadLineIndex, 1)
        this.isShowAddRoadLinePriceButton = true
      } else {
        // 非单条线路编辑时 执行
        !this.isFromRoadLineEdit && deleteContractRoute({ regionKey: item.regionKey }).then(res => {
          res.code === 0 && (() => {
            this.$message.success('删除成功')
            this.getContractRoadLinePriceList(item.contractId, item.regionKey)
          })()
        })

        // 单条线路时 执行
        this.isFromRoadLineEdit && this.$message.error('单条线路编辑时不允许删除！')
      }
    },
    // 添加
    handleTermAddButton (item, termItem) {
      console.log('handleTermAddButton (termItem:', item, termItem)
      termItem.form.validateFields((err, values) => {
        console.log('handleTermAddButton err:', err)
        err && this.$message.error(`请完善表单！`)
        !err && item.otherCosts.push({
          routePriceId: `index${item.otherCosts.length + 1}`,
          form: this.$form.createForm(this)
        })
      })
    },
    // 删除
    handleTermDeleteButton (item, roadLineIndex, termItem, termItemIndex) {
      console.log('handleTermDeleteButton (termItem:', item, termItem)
      if (item.otherCosts.length > 1) {
        item.otherCosts.splice(termItemIndex, 1)
      } else {
        this.$message.error('至少保留一条价格区间信息')
      }
      console.log('handleTermDeleteButton (termItem:', item, termItem)
    },
    // 线路信息-编辑和展开
    getIsShowEditButtonForRoadLinePrice (item) {
      // console.log('getIsShowEditButtonForRoadLinePrice>item', item)
      return item.isShowEditButtonForRoadLinePrice
    },
    // 线路信息编辑
    handleRoadLineExpandableButton (item) {
      item.isRoadLineExpanded = !item.isRoadLineExpanded
    },
    // 编辑状态切换
    toggleToEditStatusForBasicInfo (isShowEditButtonForBasicInfo = false) {
      this.isShowEditButtonForBasicInfo = isShowEditButtonForBasicInfo
    },
    // 编辑
    toggleToEditStatusForRoadLinePrice (item, index, isShowEditButtonForRoadLinePrice = false) {
      item.isShowEditButtonForRoadLinePrice = isShowEditButtonForRoadLinePrice
      this.setRoadLine(item, index)
    },
    // 是否显示添加
    isShowAddForTerm (item, termItem, termItemIndex) {
      return (item.otherCosts.length - 1) === termItemIndex
    },
    setTerm (term) {
      term.lowerLimit = term.lowerLimit === 0 ? '0' : term.lowerLimit
      const { computeType, intervalType, lowerLimit, price, initPrice, priceType, priceUnit, truckLength, upperLimit, weightLoad } = term
      term.form.setFieldsValue({ computeType, intervalType, lowerLimit, price, initPrice, priceType, priceUnit, truckLength, upperLimit, weightLoad })
    },
    setRoadLine (item, index) {
      item.form.setFieldsValue({
        contractId: item.contractId,
        ...item.routeAgeing,
        sendRegion: item.routeAgeing.sendRegion.map(item => Number(item)),
        receiveRegion: item.routeAgeing.receiveRegion.map(item => Number(item))
      })

      console.log('toggleToEditStatusForRoadLinePrice (item, index) ', item, index, item.form.getFieldsValue())

      item.otherCosts.forEach((cost, index) => {
        console.log('cost515', cost)
        this.handleCostTypeChange(cost, cost.priceType)
        this.setTerm(cost)
      })
    },
    // 添加线路费用
    handleAddLinePrice () {
      // 2019年05月14日10:27:24-prd1.2.1-根据运输类型，展示列表需要添加的信息-运输类型为车长-有一个车长信息-已完成
      if (this.currentContractId) {
        this.isShowAddRoadLinePriceButton = false
        this.currentContractRoadLineList.splice(0, 0, {
          form: this.$form.createForm(this),
          isShowEditButtonForRoadLinePrice: false,
          isRoadLineExpanded: true,
          contractId: this.currentContractBasicInfo.contractId,
          routeAgeing: {},
          otherCosts: [{
            form: this.$form.createForm(this)
          }]
        })
      } else {
        this.$message.warning('请先添加合同！')
      }
    },
    // 隐藏表单
    hidePriceForm (isRefresh) {
      this.isShowPriceForm = false
      if (isRefresh) {
        this.$refs.table.refresh()
      }
    },
    // 切换合同类型
    changeContractType (value) {
      // 切换到其他合同类型时，清除原有选择合作伙伴和项目
      this.formForContractBasicInfo.setFieldsValue({
        partnerId: undefined,
        projectId: undefined
      })

      if (value === 1 || value === 2) {
        value === 1 && (this.isProjectDisabled = false)
        value === 2 && (this.isProjectDisabled = true)
        this.getAllByPrivilegeMap(value)
        this.isPartnerListDisabled = false
      } else {
        this.isPartnerListDisabled = true
        this.isProjectDisabled = true
      }
    },
    // 切换合作伙伴类型
    changePartnerType (value) {
      this.getAllProjectDataMap({ partnerId: value }).then(res => {
        console.log('res515', this.allProjectDataMap)
        if (this.allProjectDataMap.length === 1) {
          this.formForContractBasicInfo.setFieldsValue({ projectId: this.allProjectDataMap[0].projectId })
        }
      })
    },
    /**
       * 获取用户信息
       */
    getInfoMap () {
      return getInfo().then(res => {
        this.userinfo = res.data
      })
    },
    /**
       * 获取合作伙伴-列表
       */
    getAllByPrivilegeMap (value) {
      if (!value || value === '') {
        return []
      }
      this.getAllPartnerDataMap({ partnerTypes: value })
    },
    /**
       * 获取合同类型
       */
    getContractTypeMap () {
      return getContractType({
        catalogId: 16
      }).then(res => {
        var temp = []
        res.data.forEach(function (item, i) {
          temp.push({
            text: item.dictName + '',
            value: item.dictId
          })
        })
        this.contractTypeData = temp
      })
    },
    // 取消
    cancelSubmitForRoadLinePrice (item) {
      console.log('cancelSubmitForRoadLinePrice>item', item)
      if (!item.regionKey) {
        const routeLineIndex = this.currentContractRoadLineList.findIndex(routeLine => routeLine.regionKey ===
          undefined)
        this.currentContractRoadLineList.splice(routeLineIndex, 1)

        this.formForNewContractRoadLine.resetFields()
        this.isShowAddRoadLinePriceButton = !this.isFromRoadLineEdit
        item.isShowEditButtonForRoadLinePrice = false
      } else {
        // 删除新加但是未完成的区间信息
        const termIndex = item.otherCosts.findIndex(cost => cost.routePriceId === undefined)
        termIndex >= 0 && item.otherCosts.splice(termIndex, 1)

        item.isShowEditButtonForRoadLinePrice = true

        // 取消时需要重新获取线路列表
        this.getContractRoadLinePriceList(this.currentContractId)
      }
    },
    // 确认
    handleSubmitForRoadLinePrice (e, item) {
      e.preventDefault()
      item.form.validateFields((err, values) => {
        console.log('handleSubmitForRoadLinePrice((err, costValues)', item, err, values)
        const requestData = {}
        requestData.tenantId = this.userinfo.tenantId
        requestData.departId = this.userinfo.departmentId
        if (!err) {
          const { contractId, sendRegion, receiveRegion, timeLimit, initPrice, truckLength, regionKey } = values
          requestData.contractId = contractId
          requestData.regionKey = regionKey
          requestData.otherCosts = []
          requestData.routeAgeing = {
            sendRegion: sendRegion.join(','),
            receiveRegion: receiveRegion.join(','),
            timeLimit,
            initPrice,
            truckLength
          }
          let costValidateResult = true
          item.otherCosts.forEach(cost => {
            cost.form.validateFields((err, costValues) => {
              console.log('cost.form.validateFields((err, costValues)', err, costValues)
              costValidateResult = costValidateResult && !err
              costValues.routePriceId = (costValues.routePriceId && costValues.routePriceId.indexOf('index') === 0)
                ? undefined : costValues.routePriceId
              costValidateResult && requestData.otherCosts.push(costValues)
            })
          })
          if (costValidateResult) {
            item.isDisabled = true
            saveOrUpdateContractRoute(requestData).then(res => {
              console.log('saveOrUpdateContractRoute(values).then(res =>', res)
              if (res.code === 0) {
                this.$message.success('保存成功')
                this.formForContractBasicInfo.resetFields()
                this.formForNewContractRoadLine.resetFields()
                this.getContractRoadLinePriceList(res.data.contractId)
                this.isShowAddRoadLinePriceButton = true
                item.isShowEditButtonForRoadLinePrice = true
              } else {
                this.isShowAddRoadLinePriceButton = false
                this.$message.success('保存失败')
              }
            }).finally(() => {
              item.isDisabled = false
            })
          } else {
            // 线路提交确认验证失败时，展开详情
            item.isRoadLineExpanded = true
          }
        }
      })
      item.loading = false
    },
    // 取消
    cancelSubmitForBasicInfo () {
      this.isShowEditButtonForBasicInfo = true
    },
    // 确认
    handleSubmitForBasicInfo (e) {
      e.preventDefault()
      this.formForContractBasicInfo.validateFields((err, values) => {
        values.tenantId = this.userinfo.tenantId
        values.departId = this.userinfo.departmentId
        if (!err) {
          var rangeValue = values.contractDate
          if (rangeValue !== undefined && rangeValue !== null) {
            // console.log(rangeValue[0].format('YYYY-MM-DD') + rangeValue[1].format('YYYY-MM-DD'))
            values.beginDate = rangeValue[0].format('YYYY-MM-DD')
            values.endDate = rangeValue[1].format('YYYY-MM-DD')
          }
          // values.signDate = values.signDate.format('YYYY-MM-DD 00:00:00')
          console.log('values', values)
          contractsave(values).then(res => {
            console.log('contractsave(values).then(res =>', res)
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.formForContractBasicInfo.resetFields()
              this.currentContractId = res.data.contractId
              this.getContractBasicInfoFormData(this.currentContractId)
              this.isShowEditButtonForBasicInfo = true
            } else {
              this.$message.success('保存失败')
            }
          })
        }
      })
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 获取合同信息
    getContractBasicInfoFormData (contractId) {
      console.log('getContractBasicInfoFormData>currentContractId', contractId)
      if (contractId) {
        contractdetail({ contractId: contractId }).then((res) => {
          // console.log(res)
          // res.data.beginDate = this.getFormatDate(res.data.beginDate)
          // res.data.endDate = this.getFormatDate(res.data.endDate)

          res.data.contractDate = []
          res.data.contractDate.push(moment(res.data.beginDate))
          res.data.contractDate.push(moment(res.data.endDate))

          this.currentContractBasicInfo = res.data
          // console.log('this.currentContractBasicInfo', this.currentContractBasicInfo)
          getFeeList({
            expenseType: this.currentContractBasicInfo.contractType === 1 ? 'PROJECT' : 'NOVCC',
            notToList: [6, 5, 4],
            typePartId: this.currentContractBasicInfo.contractType === 1 ? this.currentContractBasicInfo.projectId : this.currentContractBasicInfo.partnerId,
            tenantId: this.currentContractBasicInfo.tenantId
          }).then(res => {
            // console.log('项目列表', res)
            this.NewFeeList = res.data.map(v => {
              return {
                subDictName: v.expenseSelfName,
                subDictId: v.tanantNumberId,
                expenseTag: v.expenseTag
              }
            })
          })

          this.changeContractType(this.currentContractBasicInfo.contractType)
          this.changePartnerType(this.currentContractBasicInfo.partnerId)
          this.formForContractBasicInfo.setFieldsValue(this.currentContractBasicInfo)

          this.toggleToEditStatusForBasicInfo(true) // 切换到编辑状态
        })
      }
    },
    // 获取线路列表数据
    getContractRoadLinePriceList (contractId) {
      console.log('getContractRoadLinePriceList>contractId', contractId)
      if (contractId) {
        !this.isFromRoadLineEdit && getContractRouteList({
          contractId: contractId,
          pageSize: this.pagination.pageSize,
          page: this.pagination.page
        }).then((res) => {
          const responseData = res.data.records
          console.log('processRouteList (responseData)', responseData)
          if (responseData && responseData.length) {
            let that = this
            responseData.forEach((item, index) => {
              that.initRoute(item, that)
            })
          }
          this.currentContractRoadLineList = responseData
          const { total, current, pages } = res.data
          this.pagination = { ...this.pagination, total, current, pages }
          this.currentContractRoadLineList.forEach((roadLine, index) => {
            this.toggleToEditStatusForRoadLinePrice(roadLine, index, true)
          })
          console.log('getContractRoadLinePriceList>res', res)
        })

        const that = this
        this.isFromRoadLineEdit && getSingleContractRoute({ contractId, regionKey: this.regionKeyOnRoadLineEdit }).then(res => {
          console.log('getSingleContractRoute>res', res)
          that.currentContractRoadLineList = []
          const contractRoute = res.data
          that.initRoute(contractRoute, that)
          that.currentContractRoadLineList.push(contractRoute)
          that.currentContractRoadLineList.forEach((roadLine, index) => {
            that.toggleToEditStatusForRoadLinePrice(roadLine, index, true)
          })
        })
      }
    },
    initRoute (item, context) {
      item.form = context.$form.createForm(context)
      item.isShowEditButtonForRoadLinePrice = context.isShowEditButtonForRoadLinePrice
      item.isRoadLineExpanded = context.isRoadLineExpanded
      item.otherCosts.forEach(cost => {
        cost.form = context.$form.createForm(context)
      })
      item.routeAgeing.sendRegion = item.routeAgeing.sendRegion.split(',')
      item.routeAgeing.receiveRegion = item.routeAgeing.receiveRegion.split(',')
    },
    getFormatDate (date) {
      if (!date) {
        return undefined
      }
      return moment(date).format('YYYY年MM月DD日')
    },
    // 导入合同线路相关
    importTem () {
      if (!this.currentContractId) {
        this.$message.warning('请先添加合同！')
        return false
      }
      if (this.$refs.importTemplateRef) this.$refs.importTemplateRef.showModal()
    },
    // 导入历史
    importHistory () {
      if (!this.currentContractId) {
        this.$message.warning('请先添加合同！')
        return false
      }
      this.$refs.importHistoryRef.add(1, this.currentTransportType)
    },
    importTempSuccess (res) {
      console.log('导入成功')
      console.log('importTempSuccess (res)', res)

      // 导入成功后 重新获取线路列表数据
      this.getContractRoadLinePriceList(this.currentContractId)
    },
    chknum (value) {
      const reg = /^(-)*(\d+)\.(\d{6}).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) { return (parseFloat(value)).toFixed(6) }
      }
    },
    chknum1 (value) {
      const reg = /^(-)*(\d+)\.(\d{4}).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) { return (parseFloat(value)).toFixed(4) }
      }
    }
  }
}
</script>

<style lang="less">

  .ant-form-item {
    margin-bottom: 10px;
  }

  .topRightEdit {
    width: 28px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(24, 144, 255, 1);
    line-height: 20px;
    cursor: pointer;
  }

  .cancelButton {
    width: 82px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(217, 217, 217, 1);
  }

  .confirmButton {
    width: 82px;
    height: 32px;
    background: rgba(24, 144, 255, 1);
  }

  .addRoadLineButton {
    width: 80%;
    height: 32px;
    border-radius: 4px;
    border: 1px dashed rgba(24, 144, 255, 1);
  }

  .roadLineButton {
    width: 28px;
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(24, 144, 255, 1);
    line-height: 22px;
    cursor: pointer;
  }

  .roadLineBackgroud {
    background-color: transparent;
  }
</style>
