<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal
      :title="`${info.siteId ? '修改' : '新建'}中转站`"
      :visible="visible"
      :maskClosable="false"
      @ok="handleadd"
      @cancel="handleaddCancel"
    >
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="hidden" v-decorator="['siteId']"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="中转站名称">
          <a-input  :maxLength="50"  v-decorator="['siteName', {rules: [{ required: true, message: '中转站名称不能为空' }]}]"
                    placeholder="请输入中转站名称"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="中转站区域">
          <a-cascader
            v-decorator="['adcode', {rules: [{ required: true, message: '中转站区域不能为空' }], initialValue: adcodeVal}]"
            :options="regionsList" expandTrigger="hover"  placeholder="请输入中转站区域"
            :showSearch="{filter}" changeOnSelect
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="中转站地址">
          <a-row>
            <a-col>
              <a-input :maxLength="60"
                v-decorator="['address',
                {rules: [{ required: true, message: '中转站地址不能为空' }]}]"
                placeholder="请输入中转站地址"
              />
            </a-col>
            <!-- <a-col v-if="isShowMapGetBtn">
              <a class="get-map" href="javascript:void(0)" @click="showMap">地图获取</a>
            </a-col> -->
          </a-row>

          <!--<a-row hidden class="form-row">
            <a-col :lg="24" :md="24" :sm="24">
              <div id="addMapContainerForHidden" class="map"></div>
            </a-col>
          </a-row>-->
        </a-form-item>

        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="自定义区">
          <a-select placeholder="请输入自定义区" v-decorator="['customArea']">
            <a-select-option v-for="value in customAreaMap" :key="value.areaId">{{value.areaName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="经度">
          <a-input v-decorator="['longitude']" :disabled="true" placeholder/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="纬度">
          <a-input v-decorator="['latitude']" :disabled="true" placeholder/>
        </a-form-item> -->

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人姓名">
          <a-input :maxLength="30" v-decorator="['contact']" placeholder="请输入联系人姓名"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人手机号">
          <a-input :maxLength="11" v-decorator="['mobile',{
            rules: [{ message: '请输入正确的手机号码!'},
              {validator: validatePhoneNumberNoRequired}]}]" placeholder="请输入联系人手机号"/>
        </a-form-item>
        <a-form-item label="中转站类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['siteType', {initialValue: 3}]">
            <a-radio v-for="item in siteIdMap" :key="item.code" :value="item.code">{{item.name}}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入备注"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
<!--        <select-map
          :isShow="isShowMap"
          :currentArea="currentArea"
          :currentAddress="currentAddress"
          @setMapLngLat="setMapLngLat"
          @hideMap="hideMap"
        />-->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getAllPartners } from '@/api/resource/partner'
import librariesBase from '@views/mixins/libraries_base'
// import amapBase from '@/views/mixins/amap_base'
import { saveSiteAddress } from '@/api/resource/siteAddress'
import { getRegionInfo, getRegionInfoArr } from '@/utils/util'
// import SelectMap from '@/components/SelectMap'
import { validatePhoneNumberNoRequired } from '@/utils/validate'

export default {
  name: 'SiteAddressForm',
  mixins: [librariesBase],
  components: {},
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
    // customAreaMap: {
    //   type: Array,
    //   default () {
    //     return []
    //   }
    // }
  },
  data () {
    return {
      visible: this.isShow,
      validatePhoneNumberNoRequired,
      form: this.$form.createForm(this),
      isSubmit: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },

      allPartnerList: [], // 客户名称列表
      siteIdMap: [
        { code: 3, name: '自有' },
        { code: 4, name: '租用' },
        { code: 5, name: '外部' }
      ]
    }
  },
  mounted () {
    this.init()
    // console.log('info515', this.info)
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        // console.log('watchinfo515', val)
        const { siteId, siteName, provinceRgcode, cityRgcode, districtRgcode, streetRgcode, address, contact, mobile, siteType, remark } = val
        this.$nextTick(() => {
          this.form.setFieldsValue({ siteId,
            siteName,
            adcode: [
              provinceRgcode, cityRgcode, districtRgcode, streetRgcode
            ],
            address,
            contact,
            mobile,
            siteType: Number(siteType),
            remark })
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
    adcodeVal () {
      return getRegionInfoArr(this.info)
    }
  },
  methods: {
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    init () {
      this.getAllPartnerList()
      // this.initMap(this)
    },
    // 新增浮层确认事件
    handleadd (e) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // values.siteType = this.siteType
          const region = getRegionInfo(values.adcode)
          console.log('values', Object.assign(values, region))
          this.isSubmit = true
          saveSiteAddress(Object.assign(values, region))
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
</style>
