<template>
  <ElInput v-model="hostsPath" disabled />
  <ElInput v-model="hostsText" disabled type="textarea" resize="none" />
  <!-- <input v-model="hostsPath" type="text" class="form-control" disabled />
  <textarea v-model="hostsText" class="form-control" disabled></textarea> -->
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { onMounted, ref } from 'vue'
const hostsText = ref<string>('')
const hostsPath = ref<string>('')
onMounted(async () => {
  await getHosts()
})

async function getHosts() {
  const hosts = await window.api.hostsInvoke.GetOriginHosts()
  hostsText.value = hosts.txt
  hostsPath.value = hosts.path
}

defineExpose({ getHosts })
</script>
