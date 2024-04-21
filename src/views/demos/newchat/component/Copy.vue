<!--
* @Component: CopyLabel
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">

import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const id = 'preview-only'

const props = defineProps({
  // Text to copy to clipboard
  text: {
    type: String,
    default: '',
  },
})

const { text } = toRefs(props)
</script>

<template v-slot:activator="{ props }">
  <MdPreview :editorId="id" :modelValue="text" previewTheme="vuepress" class="preview" />
</template>


<style scoped lang="scss">
.preview {
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>

