const fileBase = {
  data () {
    return {
      // fileList: [{
      //   uid: '-1',
      //   name: 'xxx.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      // }],
    }
  },
  methods: {
    // 上传图片相关
    beforeUpload (file) {
      const ftype = file.type || ''
      const isJPG = (ftype === 'image/jpeg' || ftype === 'image/png' || ftype.includes('pdf'))
      // console.log('file====', ftype, file.size / 1024 / 1024)
      if (!isJPG) {
        this.$message.error('只支持jpg、png和pdf!')
      }
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M) {
        this.$message.error('图片必须小于4M!')
      }
      return isJPG && isLt2M
    },
    // fileChange事件
    fileChange (file, fileList, key, fileListKey) {
      if (!this.beforeUpload(file)) return false

      // console.log(file, fileList)
      const {
        response = {}
      } = file
      const {
        code,
        data
      } = response
      if (code === 0 && data) {
        // 设置图片地址
        // console.log('data', data)
        this.form.setFieldsValue({
          [key]: data
        })
      }

      if (file.status !== 'error') {
        this[fileListKey] = fileList
      }
    },
    // 设置文件的值
    setFileList (key, url, fileListKey) {
      this.form && this.form.setFieldsValue({
        [key]: url
      })
      url && (this[fileListKey] = [{
        uid: '-1',
        name: 'file.png',
        status: 'done',
        url: url
      }])
    }
  }
}

export default fileBase
