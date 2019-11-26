<template>
  <div>
    <a-form
      :form="form"
      :layout="formLayout"
    >
      <a-row :gutter="10">
        <a-col :xs='6'>
          <a-form-item label="运单号">
            <a-input
              v-decorator="['waybillId']"
              placeholder="运单号根据新增运单信息自动生成"
              :disabled="true"
            />
          </a-form-item>
        </a-col>
        <a-col :xs='6'>
          <a-form-item label="客户名称">
            <!--<a-auto-complete-->
              <!--:dataSource="clientNameMap"-->
              <!--@search="ClientNameChange"-->
              <!--@select="clientSelect"-->
              <!--v-decorator="['partnerName',{rules: [{ required: true, message: '请选择客户名称!' }]}]"-->
              <!--placeholder="请选择客户名称"-->
            <!--/>-->

            <a-select placeholder="请选择客户名称"
                      showSearch
                      allowClear
                      @change="handlePartnerChange"
                      @select="clientSelect"
                      :filterOption="filterOption"
                      v-decorator="['partnerId',{rules: [{ required: true, message: '请选择客户名称!' }]}]">
              <a-select-option v-for="value in clientNameList"
                               :key="value.partnerId">{{value.partnerName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs='6'>
          <a-form-item label="项目名称">
            <!--<a-auto-complete-->
              <!--:dataSource="projectNameMap"-->
              <!--@search="ClientProjectChange"-->
              <!--@select="projectSelect"-->
              <!--v-decorator="['projectId',{rules: [{ required: true, message: '请选择项目名称!' }]}]"-->
              <!--placeholder="请选择项目名称"-->
            <!--/>-->
            <a-select placeholder="请选择项目名称"
                      showSearch
                      allowClear
                      @select="projectSelect"
                      :filterOption="filterOption"
                      v-decorator="['projectId',{rules: [{ required: true, message: '请选择项目名称!' }]}]">
              <a-select-option v-for="value in projectNameList"
                               :key="value.projectId">{{value.projectName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
          <a-form-item label="运输方式">
            <a-select
              placeholder="请选择运输方式"
              v-decorator="['transportType',{initialValue:1}]"
              @change="transportWayChange"
            >
              <a-select-option
                v-for="item in transportTypeMap"
                :value="item.dictId"
                :key="item.dictId"
              >
                {{item.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :xs='6'>
          <a-form-item label="手工单号">
            <a-input
              v-decorator="['manualCode']"
              placeholder="请输入手工单号"
            />
          </a-form-item>
        </a-col>
        <a-col :xs='6'>
          <a-form-item label="客户单号">
            <a-input
              v-decorator="['clientCode']"
              placeholder="请输入客户单号"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="6" v-if="carShow">
          <a-form-item label="车长(m)">
            <a-select
              placeholder="请选择车长"
              v-decorator="['truckLength']"
              @change="CaptainChange"
            >
              <a-select-option
                v-for="item in truckLongsMap"
                :key="item.catalogId"
                :value="item.dictId"
              >
                {{item.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="6" v-if="carShow">
          <a-form-item label="车辆类型">
            <a-select
              v-decorator="['truckType']"
              placeholder="请选择车辆类型"
              @change="carTypeChange"
            >
              <a-select-option
                v-for="item in truckTypeMap"
                :catid="item.catalogId"
                :key="item.dictId"
              >
                {{item.dictName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>

</template>
<script>
import { mapActions } from 'vuex'
import { throttle, trim } from 'lodash'

import librariesBase from '@views/mixins/libraries_base'
import { getAllPartners } from '@/api/resource/partner.js'
import { getProjectList } from '@/api/resource/project.js'
import { formatValue } from '@/utils/util'
export default {
  name: 'baseinfo',
  mixins: [librariesBase],
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formLayout: 'vertical',
      partnerId: '',
      partnerName: '',
      projectId: '',
      projectName: '',
      carShow: true,
      clientNameMap: [],
      clientNameList: [],
      projectNameMap: [],
      projectNameList: [],
      formValue: {
        orderNumber: '',
        transportType: '',
        partnerName: '',
        projectName: '',
        truckLength: '',
        clientCode: '',
        truckType: '',
        manualCode: '',
        truckLoad: ''
      }
    }
  },
  computed: {},
  mounted () {
    this.getTransportTypeMap()
    this.getTruckLongsMap()
    this.getTruckTypeByDataStatusMap()
    this.init()
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          let aa = formatValue(val)
          console.log('baseinfo', aa)
          this.partnerId = aa.partnerId
          if (this.partnerId) { this.initProject() }
          if (aa.transportType !== 2 && aa.transportType !== 3) {
            this.carShow = false
          }
          this.partnerName = aa.partnerName
          this.projectId = aa.projectId
          this.projectName = aa.projectName
          const { partnerId, projectId, transportType, manualCode, clientCode, truckLength, truckType } = aa
          this.form.setFieldsValue({ partnerId, projectId, transportType, manualCode, clientCode, truckLength, truckType })
          this.form.setFieldsValue({ waybillId: aa.waybillCode })
          /**
           * 存储合同匹配相关信息
           */
          this.settransportWay(val.transportType)
        })
      }
    }
  },
  created () {
    if (!this.$route.params.id) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ transportType: 1 })
        this.settransportWay(1)
        this.carShow = false
      })
    }
  },
  methods: {
    ...mapActions('waybill', ['setPartnerId', 'settransportWay', 'setTruckLength']),
    handlePartnerChange (value) {
      this.form.setFieldsValue({ projectId: undefined })
    },
    init () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        const datas = res.data || []
        this.clientNameList = res.data
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach(val => {
          source.push({
            value: val.partnerId,
            text: val.partnerName,
            some: val
          })
        })
        this.clientNameMap = source
      })
    },
    initProject () {
      if (!this.partnerId) {
        this.$message.error('请选择客户名称')
        return
      }
      getProjectList({ partnerId: this.partnerId }).then(res => {
        const datas = res.data || []
        this.projectNameList = res.data
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach(val => {
          source.push({
            value: val.projectId,
            text: val.projectName,
            some: val
          })
        })
        this.projectNameMap = source
        if (datas && datas.length === 1) {
          this.form.setFieldsValue({ projectId: datas[0].projectId })
          this.projectName = datas[0].projectName
          this.projectId = datas[0].projectId
          this.$emit('showprojectid', datas[0].projectId)
        }
      })
    },
    chknum (value) {
      var val = value.target.defaultValue
      if (
        value.type === 'change' &&
        val !== undefined &&
        value !== null &&
        value !== '' &&
        !isNaN(val) &&
        val.length > 0
      ) {
        var num = parseFloat(val).toFixed(0)
        if (num < 0) {
          num = 0
        } else if (num > 999999) {
          num = 999999
        } else {
        }
        value.target.value = num + ''
      }
    },
    ClientNameChange: throttle(async function (v) {
      this.form.setFieldsValue({ projectId: '' })
      this.projectNameMap = []
      this.projectId = ''
      this.projectName = ''
      this.$emit('showprojectid', '')
      this.partnerId = ''
      this.partnerName = ''
      this.setPartnerId('')
      this.$emit('showpartnerid', '')
      /**
       * 删除了客户名称后，将客户名称的id清空
       */
      if (v === '') {
        this.init()
        return
      }
      const key = trim(v)
      // 重置表单的值
      // this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        await getAllPartners({ partnerName: key, partnerTypes: 1 }).then(
          res => {
            const datas = res.data || []
            self.clientNameList = res.data
            // 用于级联的下拉列表的显示只能是如下格式
            let source = []
            datas.forEach(val => {
              source.push({
                value: val.partnerId,
                text: val.partnerName,
                some: val
              })
            })
            self.clientNameMap = source
          }
        )
      }
    }, 500),
    ClientProjectChange: throttle(async function (v) {
      if (!this.partnerId) {
        this.$message.error('请选择客户名称')
        return
      }
      this.projectId = ''
      this.projectName = ''
      /**
       * 删除了项目名称后，将项目名称的id清空
       */
      if (v === '') {
        this.initProject()
        return
      }
      const key = trim(v)
      // 重置表单的值
      // this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        await getProjectList({ projectName: key, partnerId: this.partnerId }).then(
          res => {
            const datas = res.data || []
            self.projectNameList = res.data
            // 用于级联的下拉列表的显示只能是如下格式
            let source = []
            datas.forEach(val => {
              source.push({
                value: val.projectId,
                text: val.projectName,
                some: val
              })
            })
            self.projectNameMap = source
          }
        )
      }
    }, 500),
    transportWayChange (value) {
      if (value === 2 || value === 3) {
        this.carShow = true
      } else {
        this.form.setFieldsValue({ truckLength: '' })
        this.form.setFieldsValue({ truckType: '' })
        this.setTruckLength(undefined) // 清空整车车长
        this.carShow = false
      }
      console.log(value)
      /**
       * 将运输方式存储
       */
      this.settransportWay(value)
    },
    clientSelect (value, option) {
      this.partnerId = option.key
      this.initProject()
      /**
       * 存入相关的客户id
       */
      this.setPartnerId(this.partnerId)
      this.$emit('showpartnerid', option.key)
      for (let i = 0; i < this.clientNameList.length; i++) {
        if (String(value) === this.clientNameList[i].partnerId) {
          this.partnerName = this.clientNameList[i].partnerName
          console.log('11111', this.partnerName)
        }
      }
    },
    projectSelect (value, option) {
      this.projectId = option.key
      this.$emit('showprojectid', option.key)
      for (let i = 0; i < this.projectNameList.length; i++) {
        if (String(value) === this.projectNameList[i].projectId) {
          this.projectName = this.projectNameList[i].projectName
        }
      }
    },
    CaptainChange (value) {
      console.log('CaptainChange (value:', value)
      /**
       * 将整车车长 存起来
       */
      this.setTruckLength(value)
    },
    carTypeChange (value) {},
    backPartnerId () {
      return this.partnerId
    },
    backPartnerName () {
      return this.partnerName
    },
    backProjectId () {
      return this.projectId
    },
    backProjectName () {
      return this.projectName
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style lang="less" scoped>
.fl_left {
  float: left;
  margin-right: 60px;
}
</style>
