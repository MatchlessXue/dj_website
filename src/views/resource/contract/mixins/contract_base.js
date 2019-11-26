const contractBase = {
  data () {
    return {}
  },
  methods: {
    getBase64IdPack (contractId, isDetail, isFromRoadLineEdit, regionKeyOnRoadLineEdit) {
      const jsonObj = { contractId, isDetail, isFromRoadLineEdit, regionKeyOnRoadLineEdit }
      return btoa(JSON.stringify(jsonObj))
    },
    getJsonObjectFromIdPack (idPack) {
      return JSON.parse(atob(idPack))
    },
    // 过滤
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}

export default contractBase
