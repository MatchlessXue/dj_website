<template>
  <a-auto-complete

    placeholder="请输入司机姓名"
    optionLabelProp="value"
    :filterOption="filterOption"
    :dropdownMatchSelectWidth="false"
    @change="change"
    @select="driverSelect"
  >
    <template slot="dataSource">
      <a-select-option
        v-for="opt in driverOptions"
        :key="opt.driverId"
        :value="opt.driverName"
      >
        <span style="display:inline-block;width:100px;">{{ opt.driverName }}</span><span>{{ opt.mobile }}</span>
      </a-select-option>
    </template>
  </a-auto-complete>
</template>

<script>
import pick from 'lodash.pick'

export default {
  name: 'DriverAutoComplete',
  data () {
    return {}
  },
  props: {
    driverOptions: {
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
    // 选择司机下拉
    driverSelect (v, op) {
      let did = op.key
      let selectedOb = this.driverOptions.filter(i => { return i.driverId === did })
      this.form.setFieldsValue(pick(selectedOb[0], 'mobile'))
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
