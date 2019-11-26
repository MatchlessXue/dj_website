// 2 车长车型费用
<template>
  <div class="truck-cost-item">
    <a-form :form="form" layout="inline" >
      <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['filterId']"/></a-form-item>
      <a-form-item label="车长">
        <a-select
          allowClear
          v-if="truckLongsMap"
          placeholder="请选择车长"
          v-decorator="[ 'truckLength' ]">
          <a-select-option v-for="value in truckLongsMapN" :key="value.dictId">
            {{value.dictName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="车辆类型">
        <a-select
          allowClear
          placeholder="请选择车辆类型"
          defaultValue="1"
          v-decorator="[ 'truckType' ]">
          <a-select-option v-for="value in truckTypeMapN" :key="value.dictId">
            {{value.dictName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="费用类型">
        <a-select
          disabled
          placeholder="费用类型"
          v-decorator="[ 'costType', { initialValue: 1 } ]">
          <a-select-option v-for="value in costTypeMapN" :key="value.dictId">
            {{value.dictName}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="载重（吨）">
        <a-input-number :min="0"
          v-decorator="['weightLoad']"
          placeholder="请输入载重" maxLength="9"/>
      </a-form-item>
      <a-form-item label="价格">
        <a-input-number :min="0"
          v-decorator="['truckPrice']"
          placeholder="请输入价格" maxLength="9"/>
      </a-form-item>
      <div class="options-col">
        <a class="option-col" href="javascript:;" @click="deleteNew">删除</a>
        <a v-if="isShowAdd" class="option-col" href="javascript:;" @click="addNew">新增</a>
      </div>
    </a-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import { getContractRoutePriceType } from '@/api/resource/price'

export default {
  name: 'LimitPriceForm',
  components: {

  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    isShowAdd: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  mounted () {
    // this.form.setFieldsValue({ costType: 1 })
    this.$nextTick(() => {
      this.form.setFieldsValue(this.info)
    })
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          console.log('info update...')

          this.form.setFieldsValue(val)
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
  computed: {
    ...mapGetters('price', [
      'truckLongsMap',
      'truckTypeMap',
      'costTypeMap'
    ]),
    truckLongsMapN () {
      return [
        // { dictId: 0, dictName: '无' },
        ...this.truckLongsMap
      ]
    },
    truckTypeMapN () {
      return [
        { dictId: 0, dictName: '无' },
        ...this.truckTypeMap
      ]
    },
    costTypeMapN () {
      return [
        { dictId: 0, dictName: '无' },
        ...this.costTypeMap
      ]
    }
  },
  methods: {
    // 新增浮层确认事件
    getAllData () {
      let subData = {}
      let isRight = true
      this.form.validateFields((err, values) => {
        if (!err) {
          subData = values
        } else {
          isRight = false
        }
      })
      return isRight === false ? isRight : subData
    },
    addNew () {
      console.log('this.costTypeMap', this.costTypeMap)
      this.$emit('addNew')
    },
    // 删除整车价格区间
    deleteNew () {
      this.$emit('delete', this.info)
    }
  }
}
</script>
<style lang="less" >
  .truck-cost-item {
    padding: 0 22px;
    .ant-form-inline .ant-form-item > .ant-form-item-control-wrapper {
      display: inline-block;
    }
    .ant-select-selection--single {
      min-width: 130px;
    }
    .options-col {
      display: inline-block;
      .option-col{
        height: 52px;
        line-height: 52px;
        margin-right: 5px;
      }
    }
  }
</style>
