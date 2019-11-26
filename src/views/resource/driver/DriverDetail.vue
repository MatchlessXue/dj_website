<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级"/>
    <a-form class="form">
      <a-card class="card" title="司机信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="司机姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{driverRecord.driverName}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{driverRecord.mobile}}
            </a-form-item>
          </a-col>
           <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="司机归属" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{driverRecord.ascriptionName}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="驾驶证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{driverRecord.driverLicense}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <a-form-item label="准驾车型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{driverRecord.driverRankName}}
            </a-form-item>
          </a-col>
          <a-col :xl="{ span: 6 }" :lg="6" :md="12" :sm="24">
            <!-- 100 启用 -->
            <a-form-item label='状态' :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{driverRecord.bizStatusName || (driverRecord.bizStatus === 100 ? '启用' : '停用')}}
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class="card" title="车辆信息" :bordered="false">
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

import { getDriverById } from '@/api/resource/driver'

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
      driverRecord: {},
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
      // console.log(this.driverRecord)
      return this.driverRecord.commonUsedTruckList
    }
  },
  methods: {
    getFormData () {
      if (this.id) {
        getDriverById({ driverId: this.id }).then((res) => {
          // console.log(res)

          this.driverRecord = res.data
          // console.log(this.driverRecord)
          this.$nextTick(() => {
            this.setFileUrl(this.driverRecord)
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
