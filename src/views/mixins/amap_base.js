const amapBase = {
  data () {
    return {
      map: null,
      geocoder: null,
      marker: null,
      mapContainerEleId: 'addMapContainerForHidden',
      infoWindow: null,
      isShowMap: false,
      isShowMapGetBtn: false,
      currentArea: '',
      currentAddress: ''
    }
  },
  methods: {
    initMap (context) {
      var that = context
      if (!document.getElementById(that.mapContainerEleId)) return false
      that.map = new window.AMap.Map(that.mapContainerEleId, {
        resizeEnable: true
      })
      that.marker = new window.AMap.Marker({
        draggable: true
      })
      that.infoWindow = new window.AMap.InfoWindow({
        autoMove: true,
        offset: {
          x: 0,
          y: -30
        }
      })
      that.map.add(that.marker)
      that.marker.on('dragend', function (data) {
        // console.log('data', data)
        // console.log('that.marker.getPosition()', that.marker.getPosition())
        var lnglat = that.marker.getPosition()
        that.setMapLngLat(that, lnglat)
      })

      that.geocoder = new window.AMap.Geocoder({
        city: '全国' // 城市设为北京，默认：“全国”
      })
    },
    getLocationByAddress (context, address, successCallbackFn, errorCallbackFn) {
      var that = context
      that.initMap(that)
      that.geocoder.getLocation(address, function (status, result) {
        if (status === 'complete' && result.geocodes.length) {
          return successCallbackFn(result, that)
          //   console.log("getLocationByAddress", result)
          //   var lnglat = result.geocodes[0].location
          //   document.getElementById('lnglat').value = lnglat;
          //   this.marker.setPosition(lnglat);
          //   map.setFitView(marker);
        } else {
          errorCallbackFn(result, that)
        }
      })
    },
    // 设置地图经纬度
    setMapLngLat (context, lnglat) {
      var that = context

      that.geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.regeocode) {
          var address = result.regeocode.formattedAddress
          that.form.setFieldsValue({
            longitude: lnglat.lng,
            latitude: lnglat.lat/*,
            address: address */
          })
          that.map.setCenter(lnglat)
          that.infoWindow.setContent(`地址：${address}`)
          that.infoWindow.open(that.map, lnglat)
        }
      })
    },
    hideMap (address, lng, lat) {
      this.isShowMap = false
      // console.log('address,lng,lat', address, lng, lat)
      this.form.setFieldsValue({
        longitude: lng,
        latitude: lat,
        address: address
      })
    },
    // 省市区改变后
    handleRegionChange (val, selectedOptions) {
      // console.log('selectedOptions', selectedOptions)
      var currentAreaStr = ''
      if (selectedOptions) {
        selectedOptions.forEach(element => {
          currentAreaStr += element.label
        })
      }
      this.currentArea = currentAreaStr
      // console.log('select==', currentAreaStr)
    },
    handleAddressEnter (e) {
      // console.log('handleAddressEnter(e)', e.target.value)
    },

    // 地图相关
    showMap () {
      this.isShowMap = true
      // console.log('showMap->this.currentAddress', this.currentAddress)
      this.currentAddress = this.form.getFieldValue('address')
    },
    handleAddressBlur (e) {
      // console.log('handleAddressBlur', e.target.value)
      this.getLocationByAddress(
        this,
        e.target.value,
        function (res, context) {
          // console.log('res', res)
          var lnglat = res.geocodes[0].location
          // console.log('lnglat', lnglat)
          context.setMapLngLat(context, lnglat)
          context.isShowMapGetBtn = false
        },
        function (res, context) {
          context.setMapLngLat(context, {})
          var address = context.form.getFieldValue('address')
          if (address) {
            context.isShowMapGetBtn = true
            context.$message.error(`地址【${address}】获取不到经纬度！`)
          } else {
            context.isShowMapGetBtn = false
          }
        }
      )
    }
  }
}

export default amapBase
