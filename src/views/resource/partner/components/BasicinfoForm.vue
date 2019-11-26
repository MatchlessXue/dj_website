<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-form-item class="hide-form-item">
      <a-input type="hidden" v-decorator="['partnerId']"></a-input>
    </a-form-item>
    <a-row class="form-row" :gutter="16">
      <!-- 名称 -->
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item :label="config.partnerName">
          <a-auto-complete
            :dataSource="dataSource"
            @select="onSelect"
            @change="handlePartnerNameChange"
            v-decorator="[
              'partnerName',
              {rules: [
                { required: true, message: `请输入${config.partnerName}`, whitespace: true},
                { message: '最多可输入50个字符', whitespace: true, max: 50},
                { message: '只支持中文、字母和数字', validator: validateCompanyName }
              ]}
            ]"
            maxLength="50"
            :placeholder="`请输入${config.partnerName}`"
          />
        </a-form-item>
      </a-col>
      <!-- 编码 -->
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item :label="config.partnerCode">
          <a-input v-decorator="['partnerCode']" :placeholder="`请输入${config.partnerCode}`" maxLength="20"/>
            <!-- <a-input v-decorator="['partnerCode',
              {rules: [
                { required: true, message: `请选择${config.partnerCode}`},
                { message: '最多可输入20个字符', whitespace: true, max: 20},
                { message: '只支持数字和字母', validator: validateNumLetter }
              ]}]"
                   :placeholder="`请输入${config.partnerCode}`" maxLength="20"/> -->
        </a-form-item>
      </a-col>
      <!-- 业务类型 -->
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item
          :label="config.partnerIndustry">
          <a-select allowClear :placeholder="`请选择${config.partnerIndustry}`" v-decorator="['partnerProperty']">
            <a-select-option v-for="value in customBizTypesMap" :key="value.dictId">{{value.dictName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <!-- 联系人姓名 -->
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item :label="config.contactName">
          <a-input v-decorator="['contactName',
              {rules: [
                { message: '最多可输入10个字符', whitespace: true, max: 10}
              ]}]"
                   :placeholder="`请输入${config.contactName}`" maxLength="10"/>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <!-- 联系人手机号 -->
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item :label="config.contactMobile">
          <a-input v-decorator="['contactMobile',
              {rules: [{ validator: validatePhoneNumberNoRequired}]}]"
                   :placeholder="`请输入${config.contactMobile}`" maxLength="11"/>
        </a-form-item>
      </a-col>
      <!-- 联系人座机号 -->
      <a-col :xl="6" :lg="6" :md="12" :sm="24" v-if="type === 'customer'">
        <a-form-item :label="config.contactTel">
          <a-input v-decorator="['contactTel']"
                   :placeholder="`请输入座机号（含区号）`" maxLength="20"/>
        </a-form-item>
      </a-col>
      <!-- 联系人邮箱 -->
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item :label="config.contactMail">
          <a-input v-decorator="['contactMail',
              {rules: [{ validator: validateEmailNoRequired}]}]"
                   :placeholder="`请输入${config.contactMail}`"/>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item :label="config.remark">
          <a-textarea
            v-decorator="['remark', {rules: [{ message: `最多可输入20个字符`, whitespace: true, max: 20}]}]"
            placeholder="请输入备注" :autosize="{ minRows: 1 }" maxLength="20"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row
      v-if="type === 'customer'"
      class="form-row" :gutter="16">
      <a-col :lg="18" :md="18" :sm="24">
        <a-table
          style="margin-bottom: 24px;"
          :columns="projectColumns"
          :dataSource="projectList"
          :pagination="false"
          :bordered="true"
          :rowKey='record => projectList.findIndex(project => project.projectName === record.projectName)'>
          <span slot="projectName" slot-scope="text, record">
            <a-input v-model="record.projectName" placeholder="请输入项目名称"></a-input>
          </span>
          <span slot="bizStatus" slot-scope="text">
            {{ djConsts.ENABLE_STATUS_CONST[text] }}
          </span>
          <span slot="action" slot-scope="text, record, index">
            <span v-if="(index === projectList.length - 1) && projectList.length < 10">
              <a @click="handleAddProject(record, index)">添加</a>
              <a-divider type="vertical"/>
            </span>
            <a @click="handleToggleProjectStatus(record)">
              {{ djConsts.ENABLE_STATUS_CONST.getToggleName(record.bizStatus) }}
            </a>
            <a-divider v-if="isedit" type="vertical"/>
          <a v-if="isedit" @click="$refs.congifModal.edit(record)">配置人员</a>
          </span>
        </a-table>
      <config-model ref="congifModal" @ok="handleOk"></config-model>
      </a-col>
    </a-row>
    <template v-if="type === 'carrier'">
      <a-row class="form-row" :gutter="16" v-for="(driver, driverIndex) in driverList" :key="driverIndex">
        <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
          <a-form-item :label="'省市区：'" :required="true">
            <a-cascader
              v-model="driver.adcode"
              :options="regionsMap"
              expandTrigger="hover"
              :showSearch="{filter}"
              changeOnSelect
              :placeholder="`请选择省市区`"/>
          </a-form-item>
        </a-col>
        <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
          <a-form-item :label="'地址：'" :required="true">
            <a-input :maxLength="60" v-model="driver.detailAddress" :placeholder="`请输入详情地址`"/>
          </a-form-item>
        </a-col>
        <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
          <a-form-item style="margin-top: 40px">
            <span class="driverInfoDelete" v-if="driverIndex !== 0"
                  @click="AddressDelete(driver, driverIndex)"><a-icon type="minus-circle" :style="{ fontSize: '26px' }"/></span>
            <span class="driverInfoAdd"
                  @click="AddressAdd(driver, driverIndex)" ><a-icon type="plus-circle" :style="{ fontSize: '26px' }"/></span>
          </a-form-item>
        </a-col>
      </a-row>
    </template>

  </a-form>
</template>

<script>
// import { getPartnerAllStatus, getCustomTypes, getCarrierTypes } from '@/api/resource/partner'
import { getCustomerBizTypeList, getCarrierBizTypeList } from '@/api/libraries'
import { globalMap } from '@/api/global'
import { validateCompanyName, validateNumLetter, validateEmail, validatePhoneNumber, validatePhoneNumberNoRequired, validateEmailNoRequired, validateTelNoRequired } from '@/utils/validate'
import ConfigModel from '@/views/resource/project/components/ConfigModel'
import librariesBase from '@views/mixins/libraries_base'
import amapBase from '@/views/mixins/amap_base'
import { getRegionInfo, getRegionInfoArr } from '@/utils/util'

export default {
  name: 'BasicinfoForm',
  mixins: [librariesBase, amapBase],
  components: {
    ConfigModel
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    config: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 校验相关
      validateEmail,
      validatePhoneNumber,
      validatePhoneNumberNoRequired,
      validateEmailNoRequired,
      validateCompanyName,
      validateNumLetter,
      validateTelNoRequired,
      isedit: false,
      projectList: this.info.projectList || [{
        projectName: '',
        bizStatus: this.djConsts.ENABLE_STATUS_CONST.ENABLED
      }],
      statusEnable: globalMap.statusEnable, // 启用状态
      form: this.$form.createForm(this),
      // partnerAllStatusMap: [], // 状态列表
      customTypeMap: [], // 客户类型列表
      customBizTypesMap: [], // 业务类型列表
      driverList: [{
        adcode: undefined,
        detailAddress: undefined
      }], // 承运商地址列表
      dataSource: [],
      projectColumns: [
        {
          title: '项目名称',
          dataIndex: 'projectName',
          scopedSlots: { customRender: 'projectName' }
        },
        {
          title: '状态',
          dataIndex: 'bizStatus',
          width: '100px',
          scopedSlots: { customRender: 'bizStatus' }
        },
        {
          title: '人员',
          dataIndex: 'accountListName'
        },
        {
          title: '操作',
          width: '160px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted () {
    this.init()
    this.getRegions() // 省市区
  },
  watch: {
    info: {
      deep: false,
      handler: function (val) {
        this.$nextTick(() => {
          const { partnerId, partnerName, partnerCode, partnerProperty, contactName, contactMobile, contactTel, contactMail,
            remark } = val
          this.form.setFieldsValue({ partnerId,
            partnerName,
            partnerCode,
            partnerProperty,
            contactName,
            contactMobile,
            contactTel,
            contactMail,
            remark })
          this.projectList = val.projectList || [{ bizStatus: 100, projectName: partnerName }]
          let arr = val.carrierAreaList
          if (arr && arr.length > 0) {
            this.driverList = arr
          }
          this.isedit = true
        })
      }
    }
  },
  computed: {
    adcodeVal () {
      return getRegionInfoArr(this.info)
    }
  },
  methods: {
    AddressDelete (driver, driverIndex) {
      this.driverList.splice(driverIndex, 1)
    },
    AddressAdd (driver, driverIndex) {
      if (!driver.adcode) {
        this.$message.warning('请先选择省市区！')
        return
      }
      this.driverList.push({
        adcode: undefined,
        detailAddress: undefined
      })
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    init () {
      this.getCustomBizTypesMap()
    },
    handleOk () {
      this.$router.push({ name: 'partnerCustomer' })
    },
    onSelect (value) {
      console.log('onSelect', value)
    },
    // 获取业务类型列表
    getCustomBizTypesMap () {
      // console.log('type==', this.type)

      if (this.type === 'carrier') {
        getCarrierBizTypeList().then((res) => {
          this.customBizTypesMap = res.data
        })
      } else {
        getCustomerBizTypeList().then((res) => {
          this.customBizTypesMap = res.data
        })
      }
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('bif=>values', values)
          // this.$notification['error']({
          //   message: 'Received values of form:',
          //   description: values
          // })
        }
      })
    },
    validate (rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        // callback('需要以 user- 开头')
      }
      callback()
    },
    handleToggleProjectStatus (record) {
      // console.log('handleToggleProjectStatus (record)', record)
      record.bizStatus = this.djConsts.ENABLE_STATUS_CONST.getToggleCode(record.bizStatus)
      // console.log('this.projectList', this.projectList)
    },
    handleAddProject (record, index) {
      // console.log('handleAddProject (record)', record)
      if (!record.projectName) {
        this.$message.error('项目名称不能为空')
      } else if (index !== this.projectList.findIndex(project => project.projectName === record.projectName)) {
        this.$message.error(`项目名称${record.projectName}已存在`)
      } else {
        this.projectList.push({
          projectName: '',
          bizStatus: this.djConsts.ENABLE_STATUS_CONST.ENABLED
        })
      }
    },
    handlePartnerNameChange (value) {
      // console.log('handlePartnerNameChange>value', this.projectList)
      if (this.projectList && this.projectList.length === 1) {
        this.projectList[0].projectName = value
      }
    },
    getCurrentProjectList () {
      return this.projectList ? this.projectList.filter(p => !!p.projectName) : this.projectList
    },
    getCurrentAddressList () {
      return this.driverList
    },
    resetCurrentProjectList () {
      this.projectList = [{
        projectName: '',
        bizStatus: this.djConsts.ENABLE_STATUS_CONST.ENABLED
      }]
    }
  }
}
</script>

<style lang="less" scoped>
  .driverInfoDelete,.driverInfoAdd {
    width: 23px;
    height: 23px;
    font-size: 26px;
    cursor: pointer;
  }

  .driverInfoDelete {
    color: #FF3535;
    margin-right: 5px;
  }

  .driverInfoAdd {
    color: #2797FF;
  }

</style>
