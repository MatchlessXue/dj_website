<template>
  <div>
    <div>
      <a-form
        :form="form"
        :layout="formLayout"
      >
        <a-row :gutter='16'>
          <a-col :xs='12'>

            <a-form-item
              label="收货方名称"
              v-if="this.pathName ==='WaybillEdit'"
            >
              <a-auto-complete
                :dataSource="getGoodsList"
                @search="handleCompanyNameSearch"
                @select="onSelect"
                v-decorator="['rvName',{rules: [{ required: true, message: '请输入收货方名称!' }]}]"
                placeholder="请输入收货方名称"
              />

            </a-form-item>
            <a-form-item
              label="收货方名称"
              v-else
            >
              <a-auto-complete
                :dataSource="getGoodsList"
                @search="handleCompanyNameSearch"
                @select="onSelect"
                v-decorator="['rvName']"
                placeholder="请输入收货方名称"
              />
              <!-- {{getGoodsList}} -->
            </a-form-item>

            <a-form-item label="收货方手机号">
              <a-input
                v-decorator="['rvMobile']"
                placeholder="请输入收货方手机号"
              />
            </a-form-item>
            <a-form-item
              label="收货区域"
              v-if="this.pathName ==='WaybillEdit'"
            >
              <a-cascader
                :key="1"
                :options="regionsMap"
                expandTrigger="hover"
                v-decorator="['rvAddressArea',{rules: [{ required: true, message: '请选择省/市/区/街道!' }]}]"
                @change="sendGoodAddress"
                :placeholder="`请选择省/市/区/街道!`"
              />
            </a-form-item>
            <a-form-item
              label="收货区域"
              v-else
            >
              <a-cascader
                :key="1"
                :options="regionsMap"
                expandTrigger="hover"
                v-decorator="['rvAddressArea']"
                @change="sendGoodAddress"
                :placeholder="`请输入收货方地址`"
              />
            </a-form-item>

          </a-col>
          <a-col :xs='12'>

            <a-form-item label="收货方联系人">
              <a-input
                v-decorator="['rvContact']"
                placeholder="请输入收货方联系人"
              />
            </a-form-item>
            <a-form-item label="收货方座机号">
              <a-input
                v-decorator="['rvTel']"
                placeholder="收货方座机号"
              />
            </a-form-item>
            <a-form-item label="自定义区">
              <!-- <a-input v-decorator="['rvCustomArea']"
                       placeholder="请选择自定义区" /> -->

              <a-select
                placeholder="请选择自定义区"
                style="width: 100%"
                v-decorator="['rvCustomArea']"
              >
                <a-select-option
                  v-for="priceUnititem in customAreaMap"
                  :key="priceUnititem.dictId"
                  style="border-radius: 5px 0 0 5px;"
                >{{priceUnititem.dictName}}</a-select-option>
              </a-select>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row>
          <a-col>

            <a-form-item
              label="收货方地址"
              v-if="pathName === 'WaybillEdit'"
            >
              <!-- v-model="sendGoodFrom.rvAddress" -->
              <a-input
                v-decorator="['rvAddress',{rules: [{ required: true, message: '请输入收货方地址!' }]}]"
                placeholder="请输入收货方地址"
              />
            </a-form-item>
            <a-form-item
              label="收货方地址"
              v-else
            >
              <!-- v-model="sendGoodFrom.rvAddress" -->
              <a-input
                v-decorator="['rvAddress']"
                placeholder="请输入收货方地址"
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

export default {
  name: 'getgoodinfo',
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
      formLayout: 'vertical',
      pathName: this.$route.name,
      sendPartnerName: '',
      sendRvid: '',
      partnerId: '',
      queryAdcode: [], // 收货方区域选项
      getGoodsList: [],
      companyInfoList: []
    }
  },
  created () {
    this.partnerId = this.clientid
    if (this.partnerId !== '') {
      this.init()
    }
  },
  computed: {},
  mounted () {
    this.getRegions() // 省市区
    this.getCustomAreaMap() // 自定义区域
    // this.partnerId = this.clientid
    // this.init()
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        let bb = formatValue(val)
        this.$nextTick(() => {
          let item = [
            { rvName: bb.rvName },
            {
              rvAddressArea: [
                bb.rvProvinceRgcode,
                bb.rvCityRgcode,
                bb.rvDistrictRgcode,
                bb.rvStreetRgcode
              ]
            },
            { rvMobile: bb.rvMobile },
            { rvContact: bb.rvContact },
            { rvTel: bb.rvTel },
            { rvCustomArea: bb.rvCustomArea },
            { rvAddress: bb.rvAddress }
          ]
          for (let i = 0; i < item.length; i++) {
            this.form.setFieldsValue(item[i])
          }
          this.setgetAddress([
            val.rvProvinceRgcode,
            val.rvCityRgcode,
            val.rvDistrictRgcode,
            val.rvStreetRgcode
          ])
        })
      }
    },
    clientid: {
      deep: true,
      handler: function (val) {
        this.partnerId = val
        this.init()
      }
    }
  },
  methods: {
    ...mapActions('waybill', ['setgetAddress']),
    sendGoodAddress (value) {
      /**
       * 存储收货方地址
       */
      console.log('11', value)
      this.setgetAddress(value)
    },
    init () {
      const self = this
      selectByPage({
        page: '1',
        pageSize: '10',
        siteType: '2',
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
        self.getGoodsList = source
        // console.log('init 返货', self.getGoodsList)
      })
    },
    handleCompanyNameSearch: throttle(async function (v) {
      if (this.partnerId === '') {
        this.$message.error('请先选择客户名称')
        return
      }
      const key = trim(v)
      if (v === '') {
        this.init()
        return
      }
      // 清空已经赋值的数据
      this.sendPartnerName = ''
      this.sendRvid = ''
      this.companyInfoList = []
      this.getGoodsList = []
      // 查询级联列表
      if (!key) {
        this.getGoodsList = []
      } else {
        const self = this
        await selectByPage({
          page: '1',
          pageSize: '10',
          siteType: '2',
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

          self.getGoodsList = source
          // console.log('收货方')
          console.log(self.getGoodsList)
        })
      }
    }, 500),
    onSelect (value, option) {
      console.log(value)

      for (let i = 0; i < this.companyInfoList.length; i++) {
        if (String(value) === this.companyInfoList[i].siteId) {
          console.log(this.companyInfoList[i])
          this.sendRvid = this.companyInfoList[i].siteId
          this.sendPartnerName = this.companyInfoList[i].siteName
          let source = this.companyInfoList[i]
          let item = [
            { rvName: source.siteName },
            {
              rvAddressArea: [
                source.provinceRgcode,
                source.cityRgcode,
                source.districtRgcode,
                source.streetRgcode
              ]
            },
            { rvMobile: source.mobile },
            { rvContact: source.contact },
            { rvTel: source.tel },
            { rvCustomArea: source.customArea },
            { rvAddress: source.address }
          ]
          for (let i = 0; i < item.length; i++) {
            this.form.setFieldsValue(item[i])
          }
        } else {
          // console.log(this.companyInfoList[i].partnerId)
        }
      }
    },
    backRvName () {
      return this.sendPartnerName
    },
    backRvid () {
      return this.sendRvid
    }
  }
}
</script>
<style lang="less" scoped>
</style>
