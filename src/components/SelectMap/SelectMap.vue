<template>
  <a-modal
    title="地址经纬度修改"
    :visible="visible"
    :centered="false"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    width="888px"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
    </template>
    <a-form :form="form">
      <a-row class="form-row">
        <a-col :lg="8" :md="8" :sm="8">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="当前区域"
          >{{addressObj.currentArea}}</a-form-item>
        </a-col>
        <a-col :lg="16" :md="16" :sm="16">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
            <a-input-search
              v-decorator="['address',
                {rules: [{ required: true, message: '地址不能为空' }]}]"
              placeholder="请输入地址"
              @search="onSearch"
              enterButton="定位"
              :maxLength="60"
              size="large"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row">
        <a-col :lg="24" :md="24" :sm="24">
          <div id="addMapContainer" class="map"></div>
        </a-col>
      </a-row>
      <a-row class="form-row">
        <a-col :lg="12" :md="12" :sm="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="GPS经度">
            <a-input v-decorator="['longitude']" :disabled="true" placeholder/>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="GPS纬度">
            <a-input v-decorator="['latitude']" :disabled="true" placeholder/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import amapBase from '@/views/mixins/amap_base'
export default {
  mixins: [amapBase],
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    currentArea: {
      type: String,
      default () {
        return ''
      }
    },
    currentAddress: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      visible: this.isShow,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      addressObj: { currentArea: this.currentArea, currentAddress: this.currentAddress },
      form: this.$form.createForm(this),
      mapContainerEleId: 'addMapContainer'
    }
  },
  watch: {
    isShow (val) {
      this.visible = val
      this.$nextTick(() => {
        this.init()
      })
    },
    currentArea (val) {
      console.log('currentArea(val)', val)
      this.addressObj.currentArea = val
    },
    currentAddress (val) {
      console.log('currentAddress(val)', val)
      this.addressObj.currentAddress = val
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initMap(this)

      this.form.setFieldsValue({ address: this.addressObj.currentAddress })
      // this.map = new AMap.Map('addMapContainer', {
      //   resizeEnable: true
      // })
      // //为地图注册click事件获取鼠标点击出的经纬度坐标
      // this.map.on('click', e => {
      //   console.log('map====', e.lnglat.getLng() + ',' + e.lnglat.getLat())
      //   this.$emit('setMapLngLat', e.lnglat.getLng(), e.lnglat.getLat())
      // })
      // var auto = new AMap.Autocomplete({
      //   input: 'tipinput'
      // })
      // AMap.event.addListener(auto, 'select', select) //注册监听，当选中某条记录时会触发
      // function select(e) {
      //   if (e.poi && e.poi.location) {
      //     this.map.setZoom(15)
      //     this.map.setCenter(e.poi.location)
      //   }
      // }
    },
    onSearch (value) {
      console.log(value)
      this.search(value)
    },
    // 获取搜索信息
    search (keywords) {
      console.log('keywords', keywords)
      this.getLocationByAddress(
        this,
        keywords,
        function (res, context) {
          var lnglat = res.geocodes[0].location
          console.log('lnglat', lnglat)
          context.setMapLngLat(context, lnglat)
          context.marker.setPosition(lnglat)
          context.map.setFitView(context.marker)
        },
        function (res, context) {
          console.log('res, context', res, context)
          context.$message.error(`地址【${keywords}】获取不到经纬度！`)
          context.setMapLngLat(context, {})
        }
      )
    },

    // modal相关
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.handleCancel()
    },
    handleCancel (e) {
      var address = this.form.getFieldValue('address')
      var lng = this.form.getFieldValue('longitude')
      var lat = this.form.getFieldValue('latitude')
      console.log('address', address, lng, ',', lat)
      // if(address.indexOf(this.addressObj.currentArea)==0){
      this.visible = false
      this.$emit('hideMap', address, lng, lat)
      // }else{//地址不在当前区域内
      //   this.$message.error(`地址无效，原因：不在当前区域【${this.addressObj.currentArea}】内！`)
      // }
    }
  }
}
</script>
<style lang="less">
#addMapContainer {
  width: 100%;
  height: 300px;
}
</style>
