<template>
  <!-- 联系人列表，添加删除修改 -->
  <!-- <form :autoFormCreate="(form) => this.form = form"> -->
  <div class="contacts-table-form-container">
    <a-form :form="form">
      <a-table :columns="columns"
               :dataSource="data"
               :pagination="false">
        <template v-for="(col, i) in editColumns"
                  :slot="col"
                  slot-scope="text, record">
          <!-- <a-form-item :key="col"> -->
          <a-cascader :key="col"
                      v-if="col === 'adcode'"
                      :value="text"
                      :options="cityOptions"
                      expandTrigger="hover"
                      @change="(value) => handleChange(value, record.key, col)"
                      :placeholder="columns[i].title" />
          <a-select :key="col"
                    v-else-if="col === 'contactType'"
                    :value="text"
                    :placeholder="columns[i].title"
                    @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="value in contactTypesMap"
                             :key="value.code">{{value.name}}</a-select-option>
          </a-select>
          <a-input :key="col"
                   v-else-if="col === 'contactName'"
                   style="margin: -5px 0"
                   :value="text"
                   :placeholder="columns[i].title"
                   v-decorator="[ `${col}${record.key}`]"
                   @change="e => handleChange(e.target.value, record.key, col)"
                   maxLength="10" />
          <a-input :key="col"
                   v-else-if="col === 'mobile'"
                   style="margin: -5px 0"
                   :value="text"
                   :placeholder="columns[i].title"
                   v-decorator="[ `${col}${record.key}`, {rules: [{ message: `格式错误`, validator: validatePhoneNumber}]} ]"
                   @change="e => handleChange(e.target.value, record.key, col)"
                   maxLength="11" />
          <a-input :key="col"
                   v-else-if="col === 'email'"
                   style="margin: -5px 0"
                   :value="text"
                   :placeholder="columns[i].title"
                   v-decorator="[ `${col}${record.key}`, {rules: [{ message: `格式错误`, validator: validateEmail}]} ]"
                   @change="e => handleChange(e.target.value, record.key, col)" />
          <a-input :key="col"
                   v-else-if="col === 'address'"
                   style="margin: -5px 0"
                   :value="text"
                   :placeholder="columns[i].title"
                   v-decorator="[ `${col}${record.key}`]"
                   @change="e => handleChange(e.target.value, record.key, col)"
                   maxLength="50" />
          <!-- <template v-else>{{ text }}</template> -->
          <!-- </a-form-item> -->
        </template>
        <template slot="operation"
                  slot-scope="record">
          <!-- <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record.key)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record.key)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span> -->
          <span>
            <a-popconfirm title="是否要删除此行？"
                          @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
    </a-form>
    <a-button v-show="data.length < 5"
              style="width: 100%; margin-top: 16px; margin-bottom: 8px"
              type="dashed"
              icon="plus"
              @click="newMember">新增成员</a-button>
  </div>
</template>

<script>
import { getRegions } from '@/api/libraries'
import { getContactTypes } from '@/api/resource/partner'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getRegionInfo, getRegionInfoArr } from '@/utils/util'
import { validateEmail, validatePhoneNumber } from '@/utils/validate'

export default {
  name: 'ConstactsList',
  mixins: [mixin, mixinDevice],
  components: {
  },
  props: {
    info: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // 校验相关
      validateEmail,
      validatePhoneNumber,

      form: this.$form.createForm(this),
      loading: false,
      addKeyVal: 0, // 添加的数据的key，累加-1
      contactTypesMap: [], // 类型列表选项
      editColumns: ['contactType', 'contactName', 'mobile', 'email', 'adcode', 'address'],
      // 城市列表
      cityOptions: [],

      // table
      columns: [
        {
          title: '类型',
          dataIndex: 'contactType',
          key: 'contactType',
          width: '8%',
          selectOptions: this.contactTypesMap,
          scopedSlots: { customRender: 'contactType' }
        },
        {
          title: '姓名',
          dataIndex: 'contactName',
          key: 'contactName',
          width: '10%',
          scopedSlots: { customRender: 'contactName' }
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          width: '15%',
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: '15%',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '省市区',
          dataIndex: 'adcode',
          key: 'adcode',
          width: '20%',
          scopedSlots: { customRender: 'adcode' }
        },
        {
          title: '详细地址',
          dataIndex: 'address',
          key: 'address',
          width: '25%',
          scopedSlots: { customRender: 'address' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: []
    }
  },
  created () {
    // 类型列表
    this.getContactTypesMap()
    // 获取省市区
    this.getRegionsList()
  },
  watch: {
    info: {
      deep: true,
      handler: function (val = []) {
        // console.log('catacts update....', val)
        this.$nextTick(() => {
          if (!val || !val.length) return
          // let allVals = {}
          val.forEach((v) => {
            v.key = v.contactId
            if (v.provinceRgcode) {
              v.adcode = getRegionInfoArr(v)
            }
            // for (let p in v) {
            //   // v[`${p}${v.key}`] = v[p]
            //   allVals[`${p}${v.key}`] = v[p]
            // }
          })
          // 防止组件内部数据修改时重新触发watch
          this.data = JSON.parse(JSON.stringify(val)) //
          // this.data = $.extend(true, {}, val) // val
          // console.log('catacts data....', this.data)
          // this.$nextTick(() => {
          //   this.form = this.$form.createForm(this)
          //   this.form.setFieldsValue(allVals)
          //   console.log('val===', this.data)
          // })
        })
      }
    }
  },
  methods: {
    getRegionsList () {
      getRegions().then((res) => {
        this.cityOptions = res.data || []
      })
    },
    cancelSubmit () {
      // 确认要取消吗
    },
    newMember () {
      const key = this.addKeyVal--
      this.data.push({
        key,
        contactId: '',
        contactType: undefined,
        contactName: '',
        mobile: '',
        email: '',
        city: [],
        address: '',
        adcode: null,
        editable: true,
        isNew: true
      })
      this.$nextTick(() => {
        this.form = this.$form.createForm(this)
      })
    },
    remove (key) {
      console.log('remove===', key)
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      console.log('data===', this.data)
    },
    saveRow (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
    },
    toggle (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    getRowByKey (key, newData) {
      const data = this.data
      return (newData || data).filter(item => item.key === key)[0]
    },
    cancel (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange (value, key, column) {
      console.log('handleChange===', value, column)
      const target = this.data.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        // this.data = newData
        console.log('column', key, value)
      }
      // this.form.validateFields()
      console.log('data===', this.data)
    },
    // 重置数据
    resetData (data) {
      this.$nextTick(() => {
        this.data = data
      })
    },
    getAllData () {
      const datas = [...this.data]
      datas.forEach((val) => {
        // 省市区格式化
        // if (val && val.adcode && val.adcode.length > 0) {
        //   val.adcode = val.adcode.join(',')
        // }
        const region = getRegionInfo(val.adcode)
        val = Object.assign(val, region)
      })
      return datas
    },
    // 获取联系人类型列表
    getContactTypesMap () {
      getContactTypes().then((res) => {
        this.contactTypesMap = res.data || []
      })
    },
    // 提交表单
    async handleSubmit () {
      // e.preventDefault()
      let isOk = true
      await this.form.validateFields((err, values) => {
        if (err) {
          isOk = false
        }
      })
      return isOk
    }
  }
}
</script>

<style lang="less">
.contacts-table-form-container {
  .ant-form-explain {
    display: none;
  }
}
</style>
