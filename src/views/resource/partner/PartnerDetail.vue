<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级"/>
    <a-card class="card" title="基础信息" :bordered="false">
      <basicinfo-detail ref="basicinfo"
                        :type="type" :config="basicFormConfig" :detail="partner"/>
    </a-card>
  </div>
</template>

<script>
import BasicinfoDetail from './components/BasicinfoDetail'
import BackBtn from '@/components/BackBtn'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getAllByPartnerId } from '@/api/resource/partner'
import { getBasicFormConfig, getType } from './config'

export default {
  name: 'PartnerDetail',
  mixins: [mixin, mixinDevice],
  components: {
    BackBtn,
    BasicinfoDetail
  },
  data () {
    const { id } = this.$route.params
    const type = getType(this)
    return {
      id,
      type,
      basicFormConfig: getBasicFormConfig(type),
      partner: {}
    }
  },
  created () {
    this.getFormData()
  },
  watch: {
    '$route' (to, from) {
      this.type = getType(this)
      this.basicFormConfig = getBasicFormConfig(this.type)
    }
  },
  methods: {
    getFormData () {
      if (this.id) {
        getAllByPartnerId({ partnerId: this.id }).then((res) => {
          this.partner = res.data
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
