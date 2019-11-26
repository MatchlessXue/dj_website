<template>
  <div class="form-layout-body price-form-container">
    <back-btn title="返回上一级"/>
    <a-card class="card" title="基础信息" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form class="form" layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="价格名称">
                {{detail.termName}}
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="合同编码">
                {{detail.contractCode}}
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="运输类型">
                {{detail.transportTypeName}}
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="重抛类型">
                {{detail.densityTypeName}}
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="是否启用重抛比">
                {{detail.enableDensityRateName}}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <!-- 线路价格信息列表 -->
    <line-price-list :contractTerm="detail"  :isShowDetail="true"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BackBtn from '@/components/BackBtn'
import LinePriceList from '../contract/components/LinePriceList'

import { getPriceFileDetail } from '@/api/resource/price'

export default {
  name: 'PriceForm',
  components: {
    // STable,
    BackBtn,
    LinePriceList
    // ConfirmInfo
  },
  data () {
    const { id } = this.$route.params
    return {
      id,
      detail: {}
    }
  },
  created () {
    this.getFormData()
  },
  methods: {
    ...mapActions('price', ['setContractTerm']),
    getFormData () {
      const { id } = this.$route.params
      if (id) {
        getPriceFileDetail({ termId: id }).then(res => {
          this.detail = res.data
          this.setContractTerm(this.detail)
        })
      }
    }
  }
}
</script>

<style lang="less">

</style>
