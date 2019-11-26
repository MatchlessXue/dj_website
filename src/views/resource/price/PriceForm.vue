<template>
  <div class="form-layout-body price-form-container">
    <back-btn title="返回上一级"/>
    <a-card class="card" title="基础信息" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :form="form" class="form">
          <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['termId']"></a-input></a-form-item>
          <a-form-item class="hide-form-item"></a-form-item>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="价格名称">
                <a-input v-decorator="['termName', {rules: [
                        { required: true, message: `请输入价格名称`, whitespace: true},
                        { message: '最多可输入50个字符', whitespace: true, max: 50}
                    ]}]"
                    placeholder="请输入价格名称" maxLength="50"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同编码">
                <a-select
                  placeholder="请选择合同编码"
                  showSearch
                  :filterOption="filterContractOption"
                  v-decorator="[ 'contractId', {rules: [{ required: true, message: '请选择合同编码'}]} ]">
                  <a-select-option v-for="value in contractListMap" :key="value.contractId">
                    {{value.contractCode}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="运输类型">
                <a-select
                    :disabled="transportDisabled"
                    placeholder="请选择运输类型"
                    @change="handleTranportTypeChange"
                    v-decorator="[ 'transportType', {rules: [{ required: true, message: '请选择运输类型'}]} ]">
                    <a-select-option v-for="value in transportTypeMapN" :key="value.dictId">{{value.dictName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="是否启用重抛比">
                <a-radio-group v-decorator="['enableDensityRate', {initialValue: 0}]" @change="enDensityRateChange">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="0">不启用</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="重抛比（公斤/立方米）">
                <a-input-number :min="0" :max="999999.999" decimalSeparator="." :precision="2"
                  :disabled="!enDensityRate"
                  placeholder="请输入数值"
                  v-decorator="[ 'densityRate' ]" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="重抛类型">
                <a-select
                  :disabled="enDensityRate"
                  placeholder="请选择重抛类型"
                  v-decorator="[ 'densityType' ]">
                  <a-select-option v-for="value in densityTypeMap" :key="value.dictId">{{value.dictName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <!-- 线路价格信息列表 -->
    <line-price-list ref="linePriceList" :loading="loading" @beforeAddLineHandle="handleSaveContractRoute" :isShowDetail="false"/>

    <!-- fixed footer toolbar -->
    <footer-tool-bar align="center" :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <a-button @click="cancelSubmit">取消</a-button> &nbsp;&nbsp;
      <a-button type="primary"
                @click="handleSaveContractRoute"
                :loading="loading">保存</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BackBtn from '@/components/BackBtn'
import FooterToolBar from '@/components/FooterToolbar'
import LinePriceList from '../contract/components/LinePriceList'
import { mixin, mixinDevice } from '@/utils/mixin'

import { getPriceFileDetail, savePrice } from '@/api/resource/price'
import { getAllContractList } from '@/api/resource/contract'
import librariesBase from '@views/mixins/libraries_base'
import { globalMap } from '@/api/global'

export default {
  name: 'PriceForm',
  mixins: [mixin, mixinDevice, librariesBase],
  components: {
    BackBtn,
    FooterToolBar,
    LinePriceList
  },
  data () {
    const { id } = this.$route.params
    return {
      // Id，区分是新增还是修改
      id,
      visible: false,
      form: this.$form.createForm(this),
      enableDensityRate: 0,
      loading: false,

      nameDataSource: [],
      priceTypesMap: [], // 价格类型
      contractListMap: [],
      contractTerm: {} // 表单数据对象
    }
  },
  computed: {
    // 是否启用重抛比
    enDensityRate () {
      console.log(this.enableDensityRate)
      return (this.enableDensityRate === 1)
    },
    // 能否选择运输类型
    transportDisabled () {
      // existRoute 是否有线路 (1：有  0：无)
      // const { transportType, existRoute } = this.contractTerm
      // return transportType === globalMap.transportType_zc && existRoute === 1
      const { existRoute } = this.contractTerm
      return existRoute === 1
    },
    // 运输类型列表
    transportTypeMapN () {
      const { transportType, existRoute } = this.contractTerm
      if (existRoute) {
        return this.transportTypeMap.filter((val) => {
          if (transportType === globalMap.transportType_zc) {
            // 整车
            return val.dictId === globalMap.transportType_zc
          } else {
            // 非整车
            return val.dictId !== globalMap.transportType_zc
          }
        })
      } else {
        return this.transportTypeMap
      }
    }
  },
  created () {
    // 方法在mixin中
    this.getDensityTypeMap() // 重抛类型
    this.getTransportTypeMap() // 运输类型
    // this.getRegions() //
    this.getAllContractListMap() // 合同列表
    this.getFormData()
  },
  methods: {
    ...mapActions('price', ['setContractTerm']),
    getFormData () {
      if (this.id) {
        getPriceFileDetail({ termId: this.id }).then(res => {
          this.contractTerm = res.data
          this.setContractTerm(this.contractTerm)
          this.$nextTick(() => {
            this.form.setFieldsValue(this.contractTerm)
            this.enableDensityRate = this.contractTerm.enableDensityRate
          })
        })
      } else {
        this.setContractTerm({})
      }
    },
    // 合同下拉选项
    getAllContractListMap () {
      getAllContractList().then((res) => {
        this.contractListMap = res.data
      })
    },
    // 保存合同价格表单
    handleSaveContractRoute (cb) {
      if (this.loading) return
      this.form.validateFields((err, values) => {
        console.log('values=====', values)
        if (!err) {
          this.loading = true
          savePrice(values).then(res => {
            this.$message.success(`保存成功`)
            this.contractTerm = res.data
            this.setContractTerm(this.contractTerm)
            this.form.setFieldsValue(this.contractTerm)

            if (typeof cb === 'function') {
              cb(res.data)
            } else {
              // 跳转到列表页
              this.$router.push({ name: 'priceList' })
            }
          }).catch(() => {
            // this.$message.error(`保存失败`)
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    cancelSubmit () {
      this.$router.back(-1)
    },
    // 选择价格有效期
    onDateChange (date, dateString) {
      console.log(date, dateString)
    },
    filterContractOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 是否启用重抛比change
    enDensityRateChange (e) {
      this.enableDensityRate = e.target.value
      this.form.setFieldsValue({ densityRate: '', densityType: undefined })
    },
    handleTranportTypeChange (val) {
      this.$refs.linePriceList.toggleColumns(val)
    }
  }
}
</script>

<style lang="less">
.price-form-container {
    .inner-search {
        .ant-card-body {
            padding-left: 0;
        }
    }
}
</style>
