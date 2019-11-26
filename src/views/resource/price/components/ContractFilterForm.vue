// 2货物区间表单
<template>
  <div class="price-type-item">
    <a-form :form="form" layout="inline">
      <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['filterId']"/></a-form-item>
      <a-row>
        <a-col :md="4" :sm="12" >
          <a-form-item label="货物类型">
            <a-select
              placeholder="请选择货物类型"
              v-decorator="[ 'cargoType' ]">
              <a-select-option v-for="value in cargoTypeMapN" :key="value.dictId">
                {{value.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- <a-col :md="4" :sm="12" >
          <a-form-item label="收货方名称">
            <a-auto-complete
              :dataSource="companyNameSource"
              @search="handleCompanyNameSearch"
              @select="onSelect"
              v-decorator="['siteId', {rules: [{ message: `最多可输入50个字符`, whitespace: true, max: 50}]}]"
              placeholder="请选择收货方名称" />
          </a-form-item>
        </a-col> -->
        <a-col :md="4" :sm="12" >
          <a-form-item label="费用类型">
            <a-select
              placeholder="请选择费用类型"
              v-decorator="[ 'priceType', {rules: [{required: true, message: '请选择费用类型'}]} ]">
              <a-select-option v-for="value in costTypeMapN" :key="value.dictId">
                {{value.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="12" >
          <a-form-item label="计费单位">
            <a-select
              placeholder="请选择计费单位"
              v-decorator="[ 'priceUnit', {rules: [{required: true, message: '请选择计费单位'}]} ]">
              <a-select-option v-for="value in priceUnitMap" :key="value.dictId">
                {{value.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="4" :sm="12" >
          <a-form-item label="区间类型">
            <a-select
              placeholder="请选择区间类型"
              v-decorator="[ 'intervalType', {rules: [{required: true, message: '请选择区间类型'}]} ]">
              <a-select-option v-for="value in scopeTypeMap" :key="value.code">
                {{value.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="{ span: 1 }" :sm="12" >
          <div class="options-col">
            <a class="option-col" href="javascript:;" @click="deleteFilter">删除</a>
          </div>
        </a-col>
      </a-row>
      <div class="limit-price-list">
        <limit-price-form
          :ref="`limitForm${key}`"
          :key="key"
          v-for="(item, key) in contractPriceList"
          :info="item"
          :isShowAdd="key === contractPriceList.length - 1"
          :isShowDel="contractPriceList.length > 1"
          @addNew="addNewLimitPrice"
          @delete="deleteNewLimitPrice"/>
      </div>
    </a-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import LimitPriceForm from './LimitPriceForm'
import { throttle, trim } from 'lodash'
import { selectByPage } from '@/api/resource/siteAddress'
// import Autocomplete from '@/components/autocomplete/autocomplete'
import { globalMap } from '@/api/global'

export default {
  name: 'ContractFilterForm',
  components: {
    LimitPriceForm
    // Autocomplete
  },
  props: {
    info: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      // siteRecieveListMap: [],
      contractPriceList: [], // 价格区间列表
      form: this.$form.createForm(this),
      companyNameSource: [], // 收货方列表
      key: -1
    }
  },
  created () {
  },
  computed: {
    ...mapGetters('price', [
      'cargoTypeMap',
      'priceUnitMap',
      'scopeTypeMap',
      'costTypeMap',
      'contractTerm'
    ]),
    cargoTypeMapN () {
      return [
        { dictId: 0, dictName: '无' },
        ...this.cargoTypeMap
      ]
    },
    costTypeMapN () {
      let map = [...this.costTypeMap]
      // 整车，排除运费
      if (this.contractTerm.transportType === globalMap.transportType_zc) {
        map = map.filter(costType => costType.dictId !== 1)
      }
      return map
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.contractPriceList = !this.info.contractPriceList ? [] : this.info.contractPriceList.concat()
      this.form.setFieldsValue(this.info.contractFilter)
    })
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        console.log('contractFilter info update..', val)
        this.$nextTick(() => {
          this.contractPriceList = !val.contractPriceList ? [] : val.contractPriceList.concat()
          this.form.setFieldsValue(val.contractFilter)
        })
      }
    },
    isShow (val) {
      this.visible = val
      if (val) {
        this.form.resetFields()
      }
    }
  },
  methods: {
    // 获取表单数据
    getAllData () {
      let subData = { contractPriceList: [] }
      let isRight = true

      // 组装contractFilter
      this.form.validateFields((err, values) => {
        if (!err) {
          subData.contractFilter = values
        } else {
          isRight = false
        }
      })
      // 组装contractPriceList
      for (let i = 0; i < this.contractPriceList.length; i++) {
        const refForm = this.$refs[`limitForm${i}`]
        const filterList = refForm[0].getAllData()
        if (filterList === false) {
          isRight = false
        } else {
          subData.contractPriceList.push(filterList)
        }
      }
      return isRight === false ? isRight : subData
    },
    handleCompanyNameSearch: throttle(async function (v) {
      const key = trim(v)
      // 重置表单的值
      this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        await selectByPage({ page: '1', pageSize: '10', siteType: '1', sitename: key }).then((res) => {
          const datas = res.data.records || []
          self.companyInfoList = res.data.records
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.partnerId, text: val.siteName })
          })
          self.companyNameSource = source
        })
      }
    }, 500),
    // getSiteRecieveListMap () {
    //   selectByPage({ page: '1', pageSize: '10', siteType: '1' }).then((res) => {
    //     this.siteRecieveListMap = res.data || []
    //   })
    // },
    // // 收货方过滤
    // filterOption (input, option) {
    //   return (
    //     option.componentOptions.children[0].text
    //       .toLowerCase()
    //       .indexOf(input.toLowerCase()) >= 0
    //   )
    // },
    deleteFilter () {
      this.$emit('delete', this.info.filterId)
    },
    onSelect (val) {
      console.log('select...', val)
    },
    // 新增价格区间
    addNewLimitPrice () {
      const limitPrice = {
        priceId: this.key--,
        upperLimit: undefined,
        lowerLimit: undefined,
        computeType: undefined,
        price: undefined
      }
      this.contractPriceList.push(limitPrice)
    },
    // 删除价格区间
    deleteNewLimitPrice ({ priceId }) {
      console.log('priceId...', priceId)

      const list = this.contractPriceList.filter(val => val.priceId !== priceId)
      this.contractPriceList = [...list]
    }
  }
}
</script>
<style lang="less">
  .price-type-item {
    .ant-form-inline {
      .ant-row {
        margin-bottom: 4px;
      }
      .ant-form-item > .ant-form-item-control-wrapper {
        display: block;
      }
    }
    .price-item {
      .ant-form-inline .ant-form-item > .ant-form-item-control-wrapper {
        display: inline-block;
      }
    }
    .ant-select-selection--single {
      min-width: 145px;
    }
    .options-col {
      .option-col{
        height: 78px;
        line-height: 78px;
        margin-right: 5px;
      }
    }
  }
</style>
