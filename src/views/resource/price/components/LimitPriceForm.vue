// 3区间价格表单
<template>
  <div class="price-item">
    <a-form :form="form" layout="inline" >
      <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['priceId']"/></a-form-item>
        <a-form-item label="区间" class="inline-between">
          <span>
            <a-input
              v-decorator="['lowerLimit', {rules: [{required: true, message: '请输入下限'}]}]"
              placeholder="请输入下限" maxLength="8"
              style="width: 40%; margin-right: 2%;"
            />
            <a-input
              v-decorator="['upperLimit', {rules: [{required: !isShowAdd, message: '请输入上限'}]}]"
              placeholder="请输入上限" maxLength="8"
              style="width: 40%; margin-right: 2%;"
            />
          </span>
        </a-form-item>
        <a-form-item label="价格类型">
          <a-select
            placeholder="请选择价格类型"
            v-decorator="[ 'computeType', {rules: [{required: true, message: '请选择价格类型'}]} ]">
            <a-select-option v-for="value in priceTypesMap" :key="value.code">
              {{value.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="价格">
          <a-input-number :min="0" :max="999999.999" decimalSeparator="." :precision="2"
            v-decorator="['price']"
            placeholder="请输入价格" />
        </a-form-item>
        <div class="options-col small">
          <a v-if="isShowDel" class="option-col" href="javascript:;" @click="deleteLimitPrice">删除</a>
          <a v-if="isShowAdd" class="option-col" href="javascript:;" @click="addNew">新增</a>
        </div>
    </a-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
    },
    isShowDel: {
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
    this.$nextTick(() => {
      this.form.setFieldsValue(this.info)
    })
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
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
      'priceTypesMap'
    ])
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
      this.$emit('addNew')
    },
    // 删除价格区间
    deleteLimitPrice () {
      this.$emit('delete', this.info)
    }
  }
}
</script>
<style lang="less">
  .price-item {
    padding: 5px 18px 0;
    .ant-select-selection--single {
      min-width: 145px;
    }
    .options-col.small {
      display: inline-block;
      .option-col{
        height: 52px;
        line-height: 52px;
        margin-right: 5px;
      }
    }
  }
</style>
