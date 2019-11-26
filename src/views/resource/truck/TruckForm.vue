<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级"/>
    <a-form :form="form" class="form">
      <a-form-item>
        <a-input type="hidden" v-decorator="['truckId']"/>
      </a-form-item>
      <a-card class="card" title="车辆信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item label="车牌号">
              <a-input
                v-decorator="['plateNumber', {rules: [{ required: true, message: '请输入正确的车牌号', whitespace: true, validator: validateCarNumber }]}]"
                placeholder="请输入车牌号" maxlength="10" :disabled="!!id"/>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 5, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item label="车辆归属">
              <a-select placeholder="请选择车辆归属" v-decorator="['ascription']">
                <a-select-option v-for="value in truckAffiliationsMap" :key="value.dictId">{{value.dictName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 5, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item label="车长">
              <a-select placeholder="请选择车长" v-decorator="['truckLength']">
                <a-select-option v-for="value in truckLongsMap" :key="value.dictId">{{value.dictName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 5, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item label="车辆类型">
              <a-select placeholder="请选择车辆类型" v-decorator="['truckType']">
                <a-select-option v-for="value in truckTypeMap" :key="value.dictId">{{value.dictName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item label="载重（kg）">
              <!-- <a-input v-decorator="['weightLoad']" placeholder="00.0000"/> -->
              <a-input-number step="1" :precision="0" :min="0" v-decorator="['weightLoad']" placeholder="0"/>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 5, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item label="载方（m³）">
              <!-- <a-input v-decorator="['volumeLoad']" placeholder="00.0000"/> -->
              <a-input-number decimalSeparator="." :precision="2" step="1" :min="0" v-decorator="['volumeLoad']" placeholder="00.00"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 5, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item label="车载设备号">
              <a-select placeholder="请选择车载设备号" v-decorator="['gpsDeviceId']">
                <a-select-option v-for="device in gpsListMap" :key="device.deviceId">{{device.deviceNumber}}</a-select-option>
              </a-select>
              <!-- <a-auto-complete
                :dataSource="gpsDataSource"
                v-decorator="['gpsDeviceId']"
                placeholder="请输入车载设备号"
                :filterOption="filterGpsOption"
              />-->
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="备注">
              <a-textarea
                v-decorator="['remark', { rules: [ { message: `最多可输入30个字符`, whitespace: true, max: 30} ]}]"
                placeholder="最多可输入30个字符" maxlength="30" :autosize="{ minRows: 2 }"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <!-- 100 启用 -->
            <a-form-item label="状态">
              <a-radio-group v-decorator="['bizStatus', {initialValue: statusEnable}]">
                <a-radio v-for="item in allStatusMap" :key="item.code" :value="item.code">{{item.name}}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card class="card" title="司机信息" :bordered="false">
        <relevant-driver-form :driversFromParent="initDriverList" ref="drivers"></relevant-driver-form>
      </a-card>

      <!-- fixed footer toolbar -->
      <footer-tool-bar
        align="center"
        :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
      >
        <a-button @click="cancelSubmit">取消</a-button>&nbsp;&nbsp;
        <a-button type="primary" @click="handleSubmit" :loading="loading">{{ id ? '修改' : '提交' }}</a-button>
      </footer-tool-bar>
    </a-form>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import BackBtn from '@/components/BackBtn'
import RelevantDriverForm from './components/RelevantDriverForm'
import { mixin, mixinDevice } from '@/utils/mixin'
import fileBase from '@views/mixins/file_base'
import librariesBase from '@views/mixins/libraries_base'
import moment from 'moment'
import { validateCarNumber } from '@/utils/validate'

import { getUploadPictureUrl } from '@/api/common'
import { saveTrucks, getTruckById } from '@/api/resource/truck'
import { getAllGps } from '@/api/resource/gps'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'TruckForm',
  mixins: [mixin, mixinDevice, fileBase, librariesBase],
  components: {
    FooterToolBar,
    BackBtn,
    RelevantDriverForm
  },
  data () {
    const { id } = this.$route.params
    return {
      // 校验相关
      validateCarNumber,

      // Id，区分是新增还是修改
      id,
      loading: false,
      initData: {},
      submitData: {},
      form: this.$form.createForm(this),
      // gpsDataSource: [],
      gpsListMap: [], // 设备列表

      // 上传图片
      uploadPictureUrl: getUploadPictureUrl(),
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileList2: [],
      fileList3: []
    }
  },
  created () {
    // 方法在mixin中
    this.getTruckAffiliationsMap()
    this.getTruckLongsMap()
    this.getTruckTypeByDataStatusMap()
    this.getStatusMap()
    this.getAllGpsMap()
    // Promise.all([p1, p2, p3, p4]).then(() => {
    //   this.$nextTick(() => {
    //     this.getFormData()
    //   })
    // }).catch(() => {
    //   this.getFormData()
    // })
    this.getFormData()
  },
  watch: {},
  computed: {
    initDriverList () {
      return this.initData.driverTruckMaps
    }
  },
  methods: {
    getAllGpsMap () {
      return getAllGps({ deviceType: 2 }).then(res => {
        const datas = res.data || []
        if (datas.length) {
          datas.unshift({ deviceId: '0', deviceNumber: '无' })
        }
        this.gpsListMap = datas
        // let source = []
        // datas.forEach(val => {
        //   source.push({
        //     value: val.deviceId || '',
        //     text: val.deviceNumber || ''
        //   })
        // })
        // this.gpsDataSource = source
      })
    },
    filterGpsOption (input, option) {
      const obj = option.componentOptions.children[0]
      if (!obj || !obj.text) return ''
      return obj.text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    getFormData () {
      if (this.id) {
        getTruckById({ truckId: this.id }).then(res => {
          const { licenseExpireDate = '', registerDate = '' } = res.data
          // 格式化日期
          licenseExpireDate &&
            (res.data.licenseExpireDate = moment(licenseExpireDate))
          registerDate && (res.data.registerDate = moment(registerDate))

          this.initData = res.data
          this.$nextTick(() => {
            this.form.setFieldsValue(this.initData)
            this.setFileUrl(this.initData)
          })
        })
      }
    },
    cancelSubmit () {
      // 确认要取消吗
      this.$confirm({
        title: '提示',
        content: '确定要取消吗？',
        onOk: () => {
          this.$router.push({ name: 'truck' })
        },
        onCancel () {}
      })
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.formatData(values)
          // console.log('handleSubmit>values', values)
          values.driverTruckMaps = this.$refs.drivers.getCurrentDriverList()
          saveTrucks(values).then(res => {
            // console.log('res', res)
            this.$router.push({ name: 'truck' })
          })
        } else {
          return false
        }
      })
    },
    formatData (values) {
      // 格式化日期
      const { licenseExpireDate = '', registerDate = '' } = values
      licenseExpireDate &&
        (values.licenseExpireDate = licenseExpireDate.format('YYYY-MM-DD'))
      registerDate && (values.registerDate = registerDate.format('YYYY-MM-DD'))
    },
    // 上传图片相关
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) {
      this.fileChange(file, fileList, 'vehicleLicenseUrl', 'fileList')
    },
    handleChange2 ({ file, fileList }) {
      this.fileChange(file, fileList, 'serviceLicenseUrl', 'fileList2')
    },
    handleChange3 ({ file, fileList }) {
      this.fileChange(file, fileList, 'trnasportLicenseUrl', 'fileList3')
    },
    setFileUrl (detail = {}) {
      const {
        vehicleLicenseUrl,
        serviceLicenseUrl,
        trnasportLicenseUrl
      } = detail
      this.setFileList('vehicleLicenseUrl', vehicleLicenseUrl, 'fileList')
      this.setFileList('serviceLicenseUrl', serviceLicenseUrl, 'fileList2')
      this.setFileList('trnasportLicenseUrl', trnasportLicenseUrl, 'fileList3')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
