<template>
  <div>
    <content-layout title="客户结算" :descriptionArr="descriptionArr">
      <div slot="indicativePicture" :style="{ textAlign: 'center', padding: '8%' }">
        <img src="@/assets/indexFlowPic.png" :style="{ width: '80%', height: '80%' }"/>
      </div>
    </content-layout>
  </div>
</template>

<script>
import ContentLayout from '@/views/manual/components/ContentLayout'
export default {
  name: 'ManualWorkbench',
  components: {
    ContentLayout
  },
  data () {
    return {
      descriptionArr: [
        '1）新建订单',
        '2）创建运单',
        '3）派车',
        '4）提货确认',
        '5）送达确认',
        '6）回单确认'
      ]
    }
  }
}
</script>
