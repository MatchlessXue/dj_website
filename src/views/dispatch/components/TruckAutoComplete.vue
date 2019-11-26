<template>
  <a-auto-complete
          placeholder="请输入车牌号"
          optionLabelProp="value"
          :filterOption="filterOption"
          dropdownClassName="truck-auto-select"
          :dropdownMatchSelectWidth="false"
          :dropdownStyle="{width: '380px'}"
          @change="change"
          @select="truckSelect"
        >
          <template slot="dataSource">
            <a-select-option v-for="opt in truckOptions" :key="opt.truckId" :value="opt.plateNumber">
            <div class="truck-auto-item">
              <div>{{ opt.plateNumber }}</div>
              <div>{{ opt.truckTypeName }}</div>
              <div>{{ opt.ascriptionName }}</div>
              <div>{{ '车长(m):'+opt.truckLength }}</div>
              <div>{{ '载重(kg):'+opt.weightLoad }}</div>
              <div>{{ '载方(m³):'+opt.volumeLoad }}</div>
            </div>
            </a-select-option>
          </template>
          <a-input>
            <a-icon
              slot="suffix"
              type="search"
              class="certain-category-icon"
            />
          </a-input>
        </a-auto-complete>
</template>

<script>
import pick from 'lodash.pick'

export default {
  name: 'TruckAutoComplete',
  data () {
    return {}
  },
  props: {
    truckOptions: {
      type: Array,
      default: null
    },
    form: {
      type: Object
    }
  },
  created () {},
  computed: {},
  methods: {
    change (val) {
      this.$emit('change', val)
    },
    // 选择车辆下拉
    truckSelect (v, op) {
      let tid = op.key
      let selectedOb = this.truckOptions.filter(i => { return i.truckId === tid })
      this.form.setFieldsValue(pick(selectedOb[0], 'truckType', 'truckLength', 'weightLoad', 'volumeLoad'))
    },
    filterOption (input, option) {
      return (
        option.componentOptions.propsData.value
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style lang="less" scoped>
.truck-auto-select {
  .truck-auto-item {
    display: flex;
    flex-wrap: wrap;
    & > div {
      width: 33%;
    }
  }
}
</style>
