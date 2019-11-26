<template>
  <div>
    <div>
      <a-form
        :form="form"
        :layout="formLayout"
      >
        <a-row :gutter='10'>
          <a-col :xs='12'>
            <a-form-item label="发货方名称">
              <!-- <a-auto-complete
                            :dataSource="companyNameSource"
                            @search="handleCompanyNameSearch"

                            v-decorator="['sdName',{rules: [{ required: true, message: '请输入发货方名称!' }]}]"
                            placeholder="请输入发货方名称" >
                            <a-select>
                               <a-select-option v-for="item in companyNameSource" :key="item.partnerId" :value="item.partnerId" >
                                {{item.siteName}}
                            </a-select-option>
                            </a-select>
                            <template slot="dataSource">

                                <a-select-option v-for="group in companyNameSource" :key="group.partnerId" :value="group.partnerId">
                                  {{group.siteName}}
                                </a-select-option>

                            </template>
                        </a-auto-complete> -->
              <a-auto-complete
                :dataSource="companyNameSource"
                @select="onSelect"
                @search="handleSearch"
                v-decorator="['sdName',{rules: [{ required: true, message: '请输入发货方名称!' }]}]"
                placeholder="请输入发货方名称"
              />

            </a-form-item>
            <a-form-item label="发货方联系人">
              <a-input
                v-decorator="['sdContact']"
                placeholder="请输入发货方联系人"
              />
            </a-form-item>
          </a-col>
          <a-col :xs='12'>
            <a-form-item label="发货区域"
                         v-if="this.pathName ==='WaybillEdit'">
              <a-cascader :options="regionsMap"
                          expandTrigger="hover"
                          :showSearch="{filter}"
                          changeOnSelect
                          @change="sendGoodAddress"
                          v-decorator="[
                          'sdAddressArea',
                            {rules: [{ required: true, message: '请输入省/市/区/街道!' }]}
                          ]"
                          :placeholder="`请输入省/市/区/街道`" />
            </a-form-item>

            <a-form-item
                         label="发货区域"
                         v-else>
              <a-cascader :options="regionsMap"
                          expandTrigger="hover"
                          :showSearch="{filter}"
                          changeOnSelect
                          @change="sendGoodAddress"
                          v-decorator="[
                          'sdAddressArea',
                            {rules: [{ required: true, message: '请输入省/市/区/街道!' }]}
                          ]"
                          :placeholder="`请输入省/市/区/街道`" />
            </a-form-item>

            <a-form-item label="发货方手机号">
              <a-input
                v-decorator="[
                  'sdMobile',
                  {rules: [{ validator: validatePhoneNumberNoRequired }]}
                ]"
                placeholder="请输入发货方手机号"
              />
            </a-form-item>
            <!--<a-form-item label="发货方座机号">-->
              <!--<a-input-->
                <!--v-decorator="['sdTel']"-->
                <!--placeholder="发货方座机号"-->
              <!--/>-->
            <!--</a-form-item>-->
            <!--<a-form-item label="自定义区">-->
              <!--&lt;!&ndash; <a-input v-decorator="['sdCustomArea']"-->
                       <!--placeholder="请选择自定义区" /> &ndash;&gt;-->
              <!--<a-select-->
                <!--placeholder="请选择自定义区"-->
                <!--style="width: 100%"-->
                <!--v-decorator="['sdCustomArea']"-->
              <!--&gt;-->
                <!--<a-select-option-->
                  <!--v-for="priceUnititem in customAreaMap"-->
                  <!--:key="priceUnititem.dictId"-->
                  <!--style="border-radius: 5px 0 0 5px;"-->
                <!--&gt;{{priceUnititem.dictName}}</a-select-option>-->
              <!--</a-select>-->
            <!--</a-form-item>-->
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-item label="发货方地址">
              <a-input
                v-decorator="[
                        'sdAddress',
                        {rules: [{ required: true, message: '请输入发货方地址!' }]}
                      ]"
                placeholder="请输入发货方地址"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import librariesBase from '@views/mixins/libraries_base'
import { throttle, trim } from 'lodash'
import { selectByPage } from '@/api/resource/siteAddress'
import { formatValue } from '@/utils/util'
import { validatePhoneNumberNoRequired } from '@/utils/validate'
export default {
  name: 'sendgoodinfo',
  mixins: [librariesBase],
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    clientid: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      pathName: this.$route.name,
      companyNameSource: [],
      companyInfoList: [],
      partnerId: '',
      validatePhoneNumberNoRequired,
      sendPartnerName: '',
      sendSdid: '',
      formLayout: 'vertical',
      queryParam: {} // 查询参数
    }
  },
  components: {},
  computed: {},
  created () {
    this.getRegions() // 省市区
  },
  mounted () {
    this.getRegions() // 省市区
    this.getCustomAreaMap() // 自定义区域
    // console.log('customAreaMap', this.customAreaMap)
    this.partnerId = this.clientid
    if (this.partnerId !== '') {
      console.log('id', this.partnerId)
      this.init()
    }
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          console.log('>>>>>>>>>> send', val)
          let aa = formatValue(val)
          let item = [
            { sdName: aa.sdName },
            {
              sdAddressArea: [
                aa.sdProvinceRgcode,
                aa.sdCityRgcode,
                aa.sdDistrictRgcode,
                aa.sdStreetRgcode
              ]
            },
            { sdMobile: aa.sdMobile },
            { sdContact: aa.sdContact },
            { sdTel: aa.sdTel },
            { sdCustomArea: aa.sdCustomArea },
            { sdAddress: aa.sdAddress }
          ]
          for (let i = 0; i < item.length; i++) {
            this.form.setFieldsValue(item[i])
          }
          this.setSendAddress([
            val.sdProvinceRgcode,
            val.sdCityRgcode,
            val.sdDistrictRgcode,
            val.sdStreetRgcode
          ])
        })
      }
    },
    clientid: {
      deep: true,
      handler: function (val) {
        this.partnerId = val
        if (this.partnerId) {
          this.init()
        } else {
          this.companyNameSource = []
        }
      }
    }
  },
  methods: {
    ...mapActions('waybill', ['setSendAddress']),
    init () {
      const self = this

      selectByPage({
        page: '1',
        pageSize: '10',
        siteType: '1',
        partnerId: this.partnerId,
        siteName: ''
      }).then(res => {
        const datas = res.data.records || []
        self.companyInfoList = res.data.records
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach(val => {
          source.push({ value: val.siteId, text: val.siteName })
        })
        this.companyNameSource = source
      })
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    sendGoodAddress (value) {
      console.log(value)
      /**
       * 发货地址的值存起来
       */
      this.setSendAddress(value)
    },
    handleSearch: throttle(async function (v) {
      this.sendSdid = ''
      this.sendPartnerName = ''
      if (this.partnerId === '') {
        return
      }
      const key = trim(v)
      if (v === '') {
        this.init()
        return
      }
      // 重置表单的值
      this.companyInfoList = []
      this.companyNameSource = []
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        await selectByPage({
          page: '1',
          pageSize: '10',
          siteType: '1',
          partnerId: this.partnerId,
          siteName: key
        }).then(res => {
          const datas = res.data.records || []
          self.companyInfoList = res.data.records
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach(val => {
            source.push({ value: val.siteId, text: val.siteName })
          })
          self.companyNameSource = source
        })
      }
    }, 500),
    onSelect (value, option) {
      // this.sendSdid = value
      for (let i = 0; i < this.companyInfoList.length; i++) {
        if (String(value) === this.companyInfoList[i].siteId) {
          this.sendSdid = this.companyInfoList[i].siteId
          console.log(this.companyInfoList[i])
          this.sendPartnerName = this.companyInfoList[i].siteName
          let source = this.companyInfoList[i]
          let item = [
            // { sdName: source.sdName },
            {
              sdAddressArea: [
                source.provinceRgcode,
                source.cityRgcode,
                source.districtRgcode,
                source.streetRgcode
              ]
            },
            { sdMobile: source.mobile },
            { sdContact: source.contact },
            { sdTel: source.tel },
            { sdCustomArea: source.customArea },
            { sdAddress: source.address }
          ]
          for (let i = 0; i < item.length; i++) {
            this.form.setFieldsValue(item[i])
          }

          this.setSendAddress([
            source.provinceRgcode,
            source.cityRgcode,
            source.districtRgcode,
            source.streetRgcode
          ])
        } else {
          // console.log(this.companyInfoList[i].partnerId)
        }
      }
    },
    backSdName () {
      return this.sendPartnerName
    },
    backSdid () {
      return this.sendSdid
    }
  }
}
</script>
<style lang="less" scoped>
</style>
