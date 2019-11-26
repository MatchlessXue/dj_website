<template>
  <div class="form-layout-body">
    <a-modal
      :width="800"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      okText="确认导入"
      @ok="handleOk"
      @cancel="handleCancel"
    >
    <template slot="title">
      {{title}}
      <!-- 写了放弃-产品统一说改了 -->
      <!-- <a v-if="moduleType === 1"  href="javascript:;" @click="showHelp = true" style="margin-left: 10px;border-bottom: 1px solid #1890ff;">帮助</a> -->
    </template>
    <!-- 2019年05月13日18:10:13 -->
    <!-- <a-modal
      title="导入注意事项"
      :visible="showHelp"
      @cancel="showHelp = false"
      @ok="showHelp = false"
      >
        <p v-for="(desc, descIndex) in descriptionArr" :key="descIndex">{{ desc }}</p>
      <div></div>
    </a-modal> -->
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="form">
        <a-card v-if="descriptionArr.length>0" style="background-color: transparent; margin-bottom: 10px;" title="导入注意事项" :bordered="false">
          <p v-for="(desc, descIndex) in descriptionArr" :key="descIndex">{{ desc }}</p>
        </a-card>
        <div class="clearfix" style="margin-left: 40px;margin-bottom: 20px;text-align:center;">
          <a-upload
            :fileList="fileList"
            :beforeUpload="beforeUpload"
          >
            <a-button style="background-color: #1890ff;border-color: #1890ff;">
              <a-icon type="upload" style="color:#ffffff"/>
              <span style="color:#ffffff">导入文件</span>
            </a-button>
            <span style="margin-left:30px;">单次只能上传一个文件，仅支持扩展名：.xls.xlsx</span>
          </a-upload>
        </div>
        <!-- 2019年05月13日15:25:47-类型为1，需要两排 -->
        <div v-if="moduleType === 1" style="display: flex;flex-direction: column;align-items: center;">
          <!-- 导入表格和选择模板 -->
          <div>
            <span style="margin-left: 10px;">导入表格：</span>
            <a-select
              allowClear
              placeholder="请选择导入文件的sheet表"
              style="width: 220px"
              @change="sheetChange"
              v-model="sheetNo"
            >
              <a-select-option
                v-for="value in tableMap"
                :key="value.sheetNo"
              >{{value.name}}
              </a-select-option>
            </a-select>
            <span style="display:inline-block;width:20px"></span>
            <span>选择模板：</span>
            <a-select
              allowClear
              placeholder="请选择以保持的模板"
              style="width: 220px"
              @change="tempChange"
              v-model="tempId"
            >
            <a-select-option
              v-for="value in tempMap"
              :key="value.tempId">
              {{value.tempName}}
            </a-select-option>
            </a-select>
          </div>
          <!-- 客户名称和项目 -->
          <div style="margin:20px 0;">
            <span style="color: red"> * </span><span>客户名称：</span>
            <a-select
              allowClear
              showSearch
              placeholder="请选择客户名称"
              optionFilterProp="children"
              style="width: 220px"
              @change="partnerChange"
              v-model="partnerId"
              :filterOption="exportFilterOption"
            >
              <a-select-option v-for="partner in allPartnerList" :key="partner.partnerId">{{partner.partnerName}}</a-select-option>
            </a-select>
            <span style="display:inline-block;width:35px"></span>
            <span style="color: red"> * </span><span>项目：</span>
            <a-select
              allowClear
              showSearch
              placeholder="请选择项目"
              optionFilterProp="children"
              style="width: 220px"
              v-model="projectId"
              @change="projectChange"
              :filterOption="exportFilterOption"
            >
              <a-select-option v-for="project in projectNameList" :key="project.projectId">{{project.projectName}}</a-select-option>
            </a-select>
          </div>
        </div>
        <div v-else>
          <a-form-item label="选择表格"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
            <a-select placeholder="请选择导入文件的sheet表"
                      v-model="sheetNo"
                      allowClear
                      @change="sheetChange">
              <a-select-option
                v-for="value in tableMap"
                :key="value.sheetNo"
              >{{value.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="选择模板"
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol">
            <a-select placeholder="请选择已保存的模板"
                      allowClear
                      v-model="tempId"
                      @change="tempChange">
              <a-select-option
                v-for="value in tempMap"
                :key="value.tempId">
                {{value.tempName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <a-table :columns="columns"
                 rowKey="fieldCode"
                 :dataSource="data"
                 :pagination="false"
                 :scroll="{ x: scrollX, y: 400 }"
                 bordered>
          <template v-for="col in ['fieldCode', 'fieldName', 'customFieldName']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-select placeholder="请选择表格列名"
                        allowClear
                        showSearch
                        v-if="col === 'customFieldName'"
                        v-model="record.customFieldName"
                        :filterOption="exportFilterOption"
                        @change="e => handleChange(e, record.fieldCode, col)">
                <a-select-option
                  v-for="value in customFieldMap"
                  :key="value.customFieldName"
                >{{value.customFieldName}}
                </a-select-option>
              </a-select>
              <template v-else><span v-if="record.required" style="color: red"> * </span>{{text}}</template>
            </div>
          </template>
        </a-table>
        <div class="table-page-option-wrapper">
          <a-row>
            <a-col style="text-align: right;margin-top: 20px;text-decoration:underline">
              <span>
                  <a @click="saveTemplate()">另存为模板</a>
              </span>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
  <a-modal
    title="另存为模板"
    centered
    :visible="confirmVisible"
    @ok="confirmHandleOk"
    :confirmLoading="loading"
    @cancel="confirmHandleCancel"
  >
    <a-form class="form">
      <a-form-item label="模板名称"
                   :labelCol="labelCol"
                   :wrapperCol="wrapperCol">
        <a-input v-model="templateName" placeholder="请输入模板名称"  maxLength="20"/>
      </a-form-item>
    </a-form>
  </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { countCollumnsWidth } from '@/utils/util'
import { getTemplateBase, readExcelFile, getTemplateList, getTemplateMapByTempId, dataImport, templateSave } from '@/api/import/import'
import { getProjectList } from '@/api/resource/project.js'
export default {
  name: 'importTemplate',
  props: {
    // 2019年05月13日11:41:19-黄雪峰
    // 哪个模块调用的，用于区分业务逻辑
    moduleType: {
      type: Number,
      required: false,
      default: 0 // 默认0，1：运单
    },
    // 客户名称列-运单导入专属
    allPartnerList:{
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    // 显示帮助-已废弃
    showHelp: false,
    templateType: {
      type: Number,
      required: true,
      default : 0
    },
    templateSubType: {
      type: Number,
      required: true,
      default : 0
    },
    title: {
      type: String,
      default : '导入模板'
    },
    contractId: {
      default : ''
    },
    descriptionArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // 2019年05月14日12:01:04-黄雪峰-项目列表-运单专属
      projectNameList:[],
      partnerId: undefined,
      partnerName: '',
      projectId: undefined,
      projectName: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmVisible: false,
      confirmLoading: false,
      loading: false,
      form: this.$form.createForm(this),
      fileList: [],
      uploading: false,
      templateName: undefined,
      tempId: undefined,
      sheetNo: undefined,
      excelFileList: [],
      tableMap: [],
      tempMap: [],
      customFieldMap: [],
      columns: [{
        title: '系统字段名称',
        dataIndex: 'fieldName',
        width: '20%',
        scopedSlots: { customRender: 'fieldName' }
      }, {
        title: '表格字段名称',
        dataIndex: 'customFieldName',
        width: '25%',
        scopedSlots: { customRender: 'customFieldName' }
      }],
      data: []
    }
  },
  computed: {
    ...mapGetters(['tenantId']),
    scrollX () {
      return countCollumnsWidth(this.columns)
    },
    // 是否是合同？
    isAgreement () { return this.templateType === 1}
  },
  mounted () {
    // this.getTemplateBase()
  },
  methods: {
    // 根据客户id切换，获取项目列表-1.2.1-运单专属，因为是联动的，所以添加到内部
    partnerChange(value) {
      this.partnerId = value
      this.allPartnerList.forEach(item => {
        if (item.partnerId === value) {
          this.partnerName = item.partnerName
        }
      })
      // console.log(value) // 客户id
      getProjectList({ partnerId: value }).then(res => {
        // const datas = res.data || []
        this.projectNameList = res.data
        // 如果只有一个，就直接显示项目
        if(this.projectNameList.length === 1) {
          this.projectId = this.projectNameList[0].projectId
          this.projectName = this.projectNameList[0].projectName
        }
      })
    },
    // 用户切换，会自动更新用户下属项目列-1.2.1-提交数据接口待开发
    projectChange (value){
      this.projectId = value
      this.projectNameList.forEach(item => {
        if (item.projectId === value) {
          this.projectName = item.projectName
        }
      })
    },
    confirmHandleOk () {
      if (!this.templateName) {
        this.$message.error('模板名称不能为空')
        return false
      }
      var template = {}
      template.list = this.data
      // 小勇需要去掉这个值
      // template.tempId = this.tempId
      template.tempName = this.templateName
      template.tempSubType = this.templateSubType
      template.tempType = this.templateType
      this.loading = true
      templateSave(template).then(res => {
        this.getTemplateList()
        this.confirmVisible = false
      }).finally(() => {
        this.loading = false
      })
    },
    confirmHandleCancel () {
      this.confirmVisible = false
    },
    handleOk () {
      if(!this.checkData()){ // 必填校验
        return false
      }
      const { fileList } = this
      const formData = new FormData()
      formData.append('file', fileList[0])
      // 合同的时候导入合同id
      let dataList = this.data.slice(0)
      if (this.isAgreement && this.contractId) {
        dataList.push({
          fieldCode: 'contractId',
          required: false,
          customFieldName: this.contractId
        })
      }
      formData.append('mapListJson', JSON.stringify(dataList))
      var template = {}
      template.templateId = this.tempId
      template.templateSubType = this.templateSubType
      template.templateType = this.templateType
      template.sheetNo = this.sheetNo

      // moduleType === 1  运单；要求：客户和项目不能为空
      if(this.moduleType === 1) {
        if(!this.partnerId && !this.partnerName) {
          this.$message.error('客户名称不能为空')
          return
        }
        if(!this.projectId && !this.projectName) {
          this.$message.error('项目名称不能为空')
          return
        }
        template.partnerId = this.partnerId
        template.partnerName = this.partnerName
        template.projectId = this.projectId
        template.projectName = this.projectName
      }

      console.log('提交数据')
      console.log(this.data)

      this.confirmLoading = true
      dataImport(template, formData).then(res => {
        // if (!res.status) {
        //   this.$message.error(res.message)
        //   return false
        // }
        if (res.code === 0){
          let meg = res.data.message
          if (meg){
            if (res.data.isok) {
              this.$notification.success({
                description: meg,
                message: '导入完成',
                duration: null
              })
            } else {
              this.$notification.error({
                description: meg,
                message: '导入完成',
                duration: null
              })
            }

          }
          this.confirmLoading = false
          this.$emit('success', res)
          this.handleCancel()
        }
      }).catch(() => {
        this.confirmLoading = false
        this.$emit('error')
      })
    },
    handleCancel () {
      this.$emit('close')
      this.visible = false
    },
    showModal () {
      this.getTemplateBase()
      this.sheetNo = undefined
      this.tempId = undefined
      this.templateName = undefined
      this.fileList = []
      this.excelFileList = []
      this.tableMap = []
      this.tempMap = []
      this.customFieldMap = []
      this.visible = true
      this.projectId = undefined
      this.projectName = ''
      this.partnerId = undefined
      this.partnerName = ''
    },
    // handleRemove (file) {
    //   const index = this.fileList.indexOf(file)
    //   const newFileList = this.fileList.slice()
    //   newFileList.splice(index, 1)
    //   this.fileList = newFileList
    // },
    beforeUpload (file) {
      const fileName = file.name
      var suffix = fileName.substr(fileName.lastIndexOf('.'))
      if (!fileName) {
        this.$message.error('请选择需要导入的Excel文件')
        return false
      }
      if (suffix !== '.xls' && suffix !== '.xlsx') {
        this.$message.error('仅支持扩展名为xls、xlsx的表格')
        return false
      }
      this.fileList = []
      this.fileList = [...this.fileList, file]
      this.handleUpload()
      return false
    },
    handleUpload () {
      const { fileList } = this
      const formData = new FormData()
      formData.append('file', fileList[0])
      readExcelFile({templateType: this.templateType, templateSubType: this.templateSubType},formData).then(res => {
        this.excelFileList = res.data
        let source = []
        res.data.forEach(val => {
          source.push({ sheetNo: val.sheetNo, name: val.name })
        })
        this.tableMap = source
        if (source.length > 0) {
          this.sheetNo = source[0].sheetNo
          this.initCustomFieldMap(this.sheetNo)
          this.getTemplateList()
          this.updateCustomIntervals()
        }
      })
    },
    // 更新动态字段
    updateCustomIntervals () {
      this.removeDiyField()
      // 只有是合同的时候才动态处理字段
      if (!this.isAgreement) return false
      // 如果选过模板了  就不动态添加字段，用模板的字段
      if (this.tempId) return false
      // 如果没有任何字段，也不做任何处理
      if (this.data.length === 0) return false
      if (this.sheetNo) {
        const currentSheet = this.excelFileList.find(item => item.sheetNo === this.sheetNo)
        console.log('查看sheet', currentSheet)
        if (currentSheet && currentSheet.customIntervals && currentSheet.customIntervals.length) {
          currentSheet.customIntervals.forEach((item, index) => {
            let fieldItem = {
              fieldCode: item,
              customFieldName: undefined,
              required: false,
              fieldName: '区间' + (index + 1),
              diy: true
            }
            this.addFieldValue(fieldItem)
          })
        }
      }
    },
    // 动态添加一条字段
    addFieldValue (fieldItem) {
      const isHave = this.data.some(item => item.fieldCode === fieldItem.fieldCode)
      console.log('添加查看:', isHave)
      if (!isHave) this.data.push(fieldItem)
    },
    // 删除所有的动态字段
    removeDiyField () {
      this.data = this.data.filter(item => item.diy !== true)
    },
    handleChange (val, code, column) {
      const newData = [...this.data]
      const target = newData.filter(item => code === item.fieldCode)[0]
      if (target) {
        target[column] = val
        this.data = newData
      }
    },
    tempChange () {
      if (!this.sheetNo) {
        this.$message.error('请选择表格')
        return false
      }
      this.getTemplateMapById()
    },
    getTemplateMapById () {
      this.data.forEach(item => {item.customFieldName = undefined })
      getTemplateMapByTempId({ tempId: this.tempId }).then(res => {
        var tempData = res.data
        if(!tempData || tempData.length === 0){
            return
        }
        tempData.forEach(tempVal => {
          const newData = [...this.data]
          const target = newData.find(item => tempVal.fieldCode === item.fieldCode)
          if (target) {
            const customMap = [...this.customFieldMap]
            const fieldTarget = customMap.find(item => tempVal.customFieldName == item.customFieldName)
            if(fieldTarget){
              target['customFieldName'] = tempVal.customFieldName
              target['mapId'] = tempVal.mapId
              this.data = newData
            }
          }
        })
      })
    },
    initCustomFieldMap (v) {
      const target = this.excelFileList.filter(item => v === item.sheetNo)[0]
      if (target) {
        let source = []
        target.heads.forEach((val, i) => {
          source.push({ customFieldName: val })
        })
        this.customFieldMap = source
      }
    },
    sheetChange (v) {
      this.initCustomFieldMap(v)
      this.updateCustomIntervals()
      this.getTemplateMapById()
    },
    getTemplateBase () {
      getTemplateBase({ templateType: this.templateType, templateSubType: this.templateSubType }).then(res => {
        let source = []
        res.data.forEach(val => {
          source.push({ fieldCode: val.code, fieldName: val.name, required: val.required, customFieldName: undefined })
        })
        this.data = source
        console.log('查看template，', this.data)
        this.updateCustomIntervals()
      })
    },
    getTemplateList () {
      getTemplateList({ templateType: this.templateType, templateSubType: this.templateSubType }).then(res => {
        this.tempMap = res.data
      })
    },
    saveTemplate () {
      if(this.checkData()){
        this.confirmVisible = true
      }
    },
    checkData () {
      if (!this.data || this.data.length === 0) {
        return false
      }
      if (!this.fileList || this.fileList.length === 0) {
        this.$message.error('请上传模板文件')
        return false
      }
      if (!this.sheetNo) {
        this.$message.error('请选择表格')
        return false
      }
      for (let i = 0; i < this.data.length; i++) {
        var val = this.data[i]
        if (val.required && !val.customFieldName) {
          this.$message.error(val.fieldName + '不能为空')
          return false
        }
      }
      return true
    },
    exportFilterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style scoped>
</style>
