<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级"/>
    <a-form class="form">
      <a-card class="card" title="车辆信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item label="车牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{detail.plateNumber}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="车辆归属" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{detail.ascriptionName}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="车长" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{detail.truckLengthName}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="车辆类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{detail.truckTypeName}}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item label="载重（kg）" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{detail.weightLoad}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="载方（m³）" :labelCol="{ span: 9 }" :wrapperCol="wrapperCol">
              {{detail.volumeLoad}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="车载设备号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{detail.gpsDeviceName}}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item label="备注" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18, offset: 1 }">
              {{detail.remark}}
            </a-form-item>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <!-- 100 启用 -->
            <a-form-item label='状态' :labelCol="{ span: 4 }" :wrapperCol="wrapperCol">
              {{detail.bizStatusName || (detail.bizStatus === 100 ? '启用' : '停用')}}
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="card" title="司机信息" :bordered="false">
        <relevant-driver-detail :driversFromParent="initDriverList" ref="drivers"></relevant-driver-detail>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
import RelevantDriverDetail from './components/RelevantDriverDetail'
import { mixin, mixinDevice } from '@/utils/mixin'
import fileBase from '@views/mixins/file_base'

import { getTruckById } from '@/api/resource/truck'

export default {
  name: 'TruckDetail',
  mixins: [mixin, mixinDevice, fileBase],
  components: {
    BackBtn,
    RelevantDriverDetail
  },
  data () {
    const { id } = this.$route.params
    return {
      // 客户Id，区分是新增还是修改
      id,
      loading: false,
      detail: {},
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 },

      // fileList: [{
      //   uid: '-1',
      //   name: 'xxx.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      // }],
      previewImage: '',
      previewVisible: false,
      fileList: [],
      fileList2: [],
      fileList3: []
    }
  },
  created () {
    this.getFormData()
    // console.log(this.$route)
  },
  watch: {
  },
  computed: {
    initDriverList () {
      return this.detail.driverTruckMaps
    }
  },
  methods: {
    getFormData () {
      if (this.id) {
        getTruckById({ truckId: this.id }).then((res) => {
          const { licenseExpireDate = '', registerDate = '' } = res.data
          // 格式化日期
          licenseExpireDate && (res.data.licenseExpireDate = licenseExpireDate.join('-'))
          registerDate && (res.data.registerDate = registerDate.join('-'))

          this.detail = res.data
          this.$nextTick(() => {
            this.setFileUrl(this.detail)
          })
        })
      }
    },
    // 上传图片相关
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    setFileUrl (detail = {}) {
      const { vehicleLicenseUrl, serviceLicenseUrl, trnasportLicenseUrl } = detail
      // setFileList方法在mixin中
      this.setFileList('vehicleLicenseUrl', vehicleLicenseUrl, 'fileList')
      this.setFileList('serviceLicenseUrl', serviceLicenseUrl, 'fileList2')
      this.setFileList('trnasportLicenseUrl', trnasportLicenseUrl, 'fileList3')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
