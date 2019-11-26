<template>
  <a-auto-complete
    :dataSource="data"
    :style="{width:width}"
    @search="_handleSearch"
    @select="_handleSelect"
    @focus="_handleFocus"
    @blur="_handleBlur"
    :filterOption="_filterOption"
    :allowClear="allowClear"
    :placeholder="placeholder"></a-auto-complete>
</template>

<script>
import Select from 'ant-design-vue/es/select/index'
import { trim } from 'lodash'

const props = Object.assign({}, Select.props, {
  // 组件宽度
  width: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  allowClear: {
    type: Boolean,
    default: true
  },
  // 默认选中第一个选项
  defaultActiveFirstOption: {
    type: Boolean,
    default: false
  },
  // true 开启本地筛选，也就是只发一次请求，在缓存数据中查找。false：远程搜索，每次输入都会发请求，拿到最新的数据
  filter: {
    type: Boolean,
    default: false
  },
  // 没有搜到内容的提示文本
  notFoundContent: {
    type: String,
    default: ''
  },
  // 需要动态加载数据的接口方法
  api: {
    type: Function,
    required: true,
    default: function () {}
  },
  value: {
    type: String,
    default: ''
  },
  // {id:1,text:"名字1"}
  // 服务器返回结果的唯一标识
  id: {
    type: String,
    default: 'id'
  },
  // 服务器返回的数据的显示名
  text: {
    type: String,
    default: 'name'
  },
  // 参数
  params: {
    type: Object,
    default: () => {}
  }
})

// 自动完成搜索
export default {
  name: 'SelectAutoComplete',
  props: props,
  components: {
  },
  data () {
    return {
      dValue: this.value,
      data: [],
      timer: null,
      locaParams: this.params,
      catchData: []
    }
  },
  created () {
    this._getOptions()
  },
  computed: {},
  methods: {
    _handleSearch (value) {
      this.$emit('input', value)
      if (this.filter === false) this._getOptions(value)
    },
    _handleSelect (value, a, b) {
      console.log(value)
      console.log(a)
      console.log(b)
      this.$emit('input', value)
    },
    _handleFocus () {
    },
    _handleBlur () {
    },
    _getOptions (value) {
      value = trim(value)
      this._clearTimer()
      this.timer = setTimeout(() => {
        // 搜索之前把参数带进去
        this.$emit('before', value, this)
        this.api(this.locaParams).then(res => {
          var datas = res.data
          if (res.data && res.data.records) {
            datas = res.data.records
          }
          if (datas && datas.length) {
            let arrs = []
            datas.forEach(item => {
              arrs.push({ value: item[this.id], text: item[this.text] })
            })
            console.log('自动补全组件查看数据', arrs)
            this.data = arrs
            // 没有值得时候 需要更新下缓存
            if (value === '' && arrs.length) {
              this._updateCatch(arrs)
            }
            return false
          }
          this.data = []
        }).catch(err => {
          this.data = []
          console.log(err)
        })
      }, 300)
    },
    _clearTimer () {
      clearTimeout(this.timer)
      this.timer = null
    },
    // 空字符串获取所有的数据，需要缓存一下
    _updateCatch (data) {
      this.catchData = data
    },
    // 设置需要的参数
    setParams (params) {
      this.locaParams = params
    },
    // 过滤
    _filterOption (input, option) {
      if (this.filter === false) return null
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style lang="less" scoped>

</style>
