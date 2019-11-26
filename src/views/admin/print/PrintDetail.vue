<template>
  <print-edit-template
    ref="PrintEditTemplateRef"
    :printtemplateId="printtemplateId"
    @success="PrintEditTemplateSuccess"></print-edit-template>
</template>

<script>
import { PrintEditTemplate } from 'dj_print'
export default {
  name: 'printDetail',
  components: {
    PrintEditTemplate
  },
  data () {
    return {
    }
  },
  created () {
    console.log(this.printtemplateId)
  },
  methods: {
    PrintEditTemplateSuccess () {
    }
  },
  computed: {
    printtemplateId () { return this.$route.params.printtemplateId }
  }
}
</script>

<style scoped>

</style>
