<template>
  <ElDropdown placement="bottom" style="width: 100%" @command="handleCommand">
    <ElInput v-model="hostsPath" disabled />
    <template #dropdown>
      <ElDropdownItem>
        <ElDropdownItem command="openExplorer">경로 열기</ElDropdownItem>
      </ElDropdownItem>
    </template>
  </ElDropdown>
  <ElInput v-model="hostsText" disabled type="textarea" resize="none" />
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { onMounted, ref } from 'vue'
interface Props {
  selectedFilePath?: string
}

withDefaults(defineProps<Props>(), {
  selectedFilePath: undefined
})

const emit = defineEmits<{
  (event: 'update:selectedFilePath', data: string): void
}>()

const hostsText = ref<string>('')
const hostsPath = ref<string>('')

onMounted(async () => {
  await getHosts()
})

async function getHosts() {
  const hosts = await window.api.hostsInvoke.GetOriginHosts()
  hostsText.value = hosts.txt
  hostsPath.value = hosts.path
  emit('update:selectedFilePath', hosts.path)
}

function handleCommand(command: string) {
  if (command === 'openExplorer') {
    openFolder()
  }
}

function openFolder() {
  const path = hostsPath.value.split('\\').slice(0, -1).join('\\')
  window.api.windowInvoke.OpenShellWindow(path)
}

defineExpose({ getHosts })
</script>
