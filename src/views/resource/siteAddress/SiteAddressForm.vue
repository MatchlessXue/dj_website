<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :visible="visible" :maskClosable="false" @ok="handleadd" @cancel="handleaddCancel">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="客户名称">
              <a-select showSearch allowClear placeholder="请选择客户名称" optionFilterProp="children" @focus="handleFocus" @blur="handleBlur" @change="handleChange"
                        :filterOption="filterOption" v-decorator="['partnerId', {rules: [{ required: true, message: '客户名称不能为空' }]}]">
                <a-select-option  v-for="partner in allPartnerList" :key="partner.partnerId" >{{partner.partnerName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.siteName">
              <a-input :maxLength="50" v-decorator="['siteName', {rules: [{ required: true, message: `${config.siteName}不能为空` }]}]"
                       :placeholder="`请输入${config.siteName}`"/>
            </a-form-item>
            <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="外部编号">
              <a-input placeholder="请输入外部编号" v-decorator="['externalCode']"/>
            </a-form-item> -->
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.adcode">
              <a-cascader
                v-decorator="['adcode', {rules: [{ required: true, message: `${config.adcode}不能为空` }], initialValue: adcodeVal}]"
                :options="regionsList" expandTrigger="hover" @change="handleRegionChange" :placeholder="`请输入${config.adcode}`"
                :showSearch="{filter}" changeOnSelect
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.address">
              <a-row>
                <a-col>
                  <a-input :maxLength="60" v-decorator="['address',
                {rules: [{ required: true, message: `${config.address}不能为空` }]}]"
                           :placeholder="`请输入${config.address}`"/>
                </a-col>
                <!-- <a-col v-if="isShowMapGetBtn">
                  <a class="get-map" href="javascript:void(0)" @click="showMap">地图获取</a>
                </a-col> -->
              </a-row>

           <!--   <a-row hidden class="form-row">
                <a-col :lg="24" :md="24" :sm="24">
                  <div id="addMapContainerForHidden" class="map"></div>
                </a-col>
              </a-row>-->
            </a-form-item>

            <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="经度">
              <a-input v-decorator="['longitude']" :disabled="true" placeholder/>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="纬度">
              <a-input v-decorator="['latitude']" :disabled="true" placeholder/>
            </a-form-item> -->
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.contact">
              <a-input v-decorator="['contact']" :placeholder="`请输入${config.contact}`"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.mobile">
              <a-input :maxLength="11" v-decorator="['mobile',{
            rules: [{ message: '请输入正确的手机号码!'},
              {validator: validatePhoneNumberNoRequired}]}]" :placeholder="`请输入${config.mobile}`"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.tel">
              <a-input :maxLength="20" v-decorator="['tel']" :placeholder="`请输入座机号（含区号）`"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form  v-for="(relatedMobileObj, relatedMobileIndex) in relatedMobileList" :form="relatedMobileObj.form"
                 :key="relatedMobileObj.relatedMobile"
                 class="form">
          <a-row :gutter="16">
            <a-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
              <a-form-item :labelCol="labelCol"
                           :style="{ marginLeft: getRalatedMobileMarginLeft(relatedMobileIndex) }"
                           :wrapperCol="wrapperCol"
                           :label="getRelatedMobileLabel(relatedMobileIndex)">
                <a-input :maxLength="11"
                  v-decorator="['relatedMobile',{ rules: [{ message: '请输入正确的手机号码!'},
                  {validator: validatePhoneNumberNoRequired}],initialValue:relatedMobileObj.relatedMobile}]"
                  style="width: 244px"
                  @change="handleRelatedMobileChange(relatedMobileObj, relatedMobileIndex, $event)"
                  :placeholder="`用于登录微信小程序查单`"/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
              <div style="margin-top: 5px">
                <span class="relatedMobileDelete"
                      v-show="relatedMobileIndex !== 0"
                      @click="handleRelatedMobileDelete(relatedMobileObj, relatedMobileIndex)">
                  <a-icon type="minus-circle" :style="{ fontSize: '26px' }"/></span>
                <span class="relatedMobileAdd"
                      @click="handleRelatedMobileAdd(relatedMobileObj, relatedMobileIndex)" >
                  <a-icon type="plus-circle" :style="{ fontSize: '26px' }"/>
                </span>
              </div>
            </a-col>
          </a-row>
        </a-form>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.tel">
          <a-input v-decorator="['tel']" :placeholder="`请输入${config.tel}`"/>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="config.remark">
          <a-textarea
            v-decorator="['remark']"
            :placeholder="`请输入${config.remark}`"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item> -->
        <a-form-item style="height:0;">
          <a-input type="hidden" v-decorator="['siteId']"/>
        </a-form-item>
        <!--<select-map :isShow="isShowMap" :currentArea="currentArea" :currentAddress="currentAddress" @setMapLngLat="setMapLngLat"
          @hideMap="hideMap"/>-->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getAllPartners } from '@/api/resource/partner'
import librariesBase from '@views/mixins/libraries_base'
import amapBase from '@/views/mixins/amap_base'
import { saveSiteAddress } from '@/api/resource/siteAddress'
import { getRegionInfo, getRegionInfoArr } from '@/utils/util'
// import SelectMap from '@/components/SelectMap'
import { getBasicFormConfig } from './config'
import { validatePhoneNumberNoRequired, validateTelNoRequired } from '@/utils/validate'
export default {
  name: 'SiteAddressForm',
  mixins: [librariesBase, amapBase],
  components: {
    // SelectMap
  },
  props: {
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    heading: {
      type: String,
      default () {
        return ''
      }
    },
    type: {
      type: String,
      default: 'send'
    },
    siteType: {
      type: Number,
      default: 1
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    regionsList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      config: getBasicFormConfig(this.type),
      visible: this.isShow,
      validatePhoneNumberNoRequired,
      validateTelNoRequired,
      form: this.$form.createForm(this),
      isSubmit: false,
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      relatedMobileList: [],
      allPartnerList: [] // 客户名称列表
    }
  },
  watch: {
    type (val) {
      this.config = getBasicFormConfig(val)
    },
    info: {
      deep: true,
      handler: function (val) {
        console.log('info515', val)
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
          if (!val.relateMobile) {
            this.relatedMobileList = [{
              form: this.$form.createForm(this),
              relatedMobile: undefined
            }]
          } else {
            this.relatedMobileList = []
            val.relateMobile.split(';').forEach(relatedMobile => {
              this.relatedMobileList.push({
                form: this.$form.createForm(this),
                relatedMobile: relatedMobile
              })
            })
          }
        })
      }
    },
    isShow (val) {
      this.visible = val
      if (val) {
        this.form.resetFields()
      }
    }
  },
  computed: {
    title () {
      return `${this.info.siteId ? '修改' : '新增'}${this.config.title}`
    },
    adcodeVal () {
      return getRegionInfoArr(this.info)
    }
  },
  mounted () {
    this.init()
    // console.log('this.relatedMobileList>mounted', this.relatedMobileList)
    // this.relatedMobileList.forEach(relatedMobileItem => {
    //   relatedMobileItem.form.setFieldsValue({ relatedMobile: relatedMobileItem.relatedMobile })
    // })
  },
  methods: {
    handleRelatedMobileChange (relatedMobileObj, relatedMobileIndex, event) {
      const newValue = event.target.value
      console.log('handleRelatedMobileChange (relatedMobileObj, relatedMobileIndex, newValue', relatedMobileObj, relatedMobileIndex, newValue)
      relatedMobileObj.form.setFieldsValue({ relatedMobile: newValue })
      // this.$set(relatedMobileObj, 'relatedMobile', newValue)
    },
    handleRelatedMobileDelete (relatedMobileObj, relatedMobileIndex) {
      this.relatedMobileList.splice(relatedMobileIndex, 1)
    },
    handleRelatedMobileAdd (relatedMobileObj, relatedMobileIndex) {
      relatedMobileObj.form.validateFields((err, values) => {
        if (!err) {
          console.log('values515add', values)
          this.relatedMobileList.push({
            form: this.$form.createForm(this),
            relatedMobile: undefined
          })
        }
      })
      console.log('this.relatedMobileList', this.relatedMobileList)
    },
    getRalatedMobileLabelCol (relatedMobileIndex) {
      return relatedMobileIndex === 0 ? this.labelCol : { span: 18 }
    },
    getRelatedMobileLabel (relatedMobileIndex) {
      return relatedMobileIndex === 0 ? this.config.relatedMobile : ''
    },
    getRalatedMobileMarginLeft (relatedMobileIndex) {
      return relatedMobileIndex === 0 ? '0px' : '146px'
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    init () {
      this.getAllPartnerList()
      this.initMap(this)
    },
    // 新增浮层确认事件
    handleadd (e) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.siteType = this.siteType
          const region = getRegionInfo(values.adcode)
          console.log('values', Object.assign(values, region))
          let relateMobile = ''
          let relatedMobileValidateResult = true
          this.relatedMobileList.forEach(relatedMobileItem => {
            relatedMobileItem.form.validateFields((err, values) => {
              relatedMobileValidateResult = relatedMobileValidateResult && !err
              console.log('relatedMobileValidateResult', relateMobile, relatedMobileValidateResult)
              if (!err) {
                !!values.relatedMobile && (relateMobile = `${relateMobile}${values.relatedMobile};`)
              }
            })
          })

          console.log('relateMobile', relateMobile, relatedMobileValidateResult)
          values.relateMobile = relateMobile.substr(0, relateMobile.length - 1)
          if (relatedMobileValidateResult) {
            this.isSubmit = true
            relatedMobileValidateResult && saveSiteAddress(Object.assign(values, region))
              .then(res => {
                if (res.code === 0) {
                  this.$message.success('保存成功')
                  this.$emit('handlerefresh')
                  this.handleaddCancel(true)
                } else {
                  this.$message.success('保存失败')
                }
              })
              .finally(() => {
                this.isSubmit = false
              })
          }
        }
      })
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', isRefresh)
    },

    check () {
      this.form.validateFields(err => {
        if (!err) {
          console.info('success')
        }
      })
    },

    // 客户名称选择框事件处理方法
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    }
  }
}
</script>
<style lang="less" scoped>
.site-addr-form-layout {
  .get-map {
    display: inline;
    cursor: pointer;
  }
}

.relatedMobileDelete,.relatedMobileAdd {
  width: 23px;
  height: 23px;
  fontSize: 26px;
  cursor: pointer;
}

.relatedMobileDelete {
  color: #FF3535;
  margin-right: 5px;
}

.relatedMobileAdd {
  color: #2797FF;
}
</style>
