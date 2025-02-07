<template>
  <ElDropdown placement="bottom" style="width: 100%" @command="handleCommand">
    <ElInput v-model="hostsPath" disabled>
      <template #append>
        <ElButton type="primary" :disabled="saveButtonDisabled" @click="save">저장</ElButton>
      </template>
    </ElInput>
    <template #dropdown>
      <ElDropdownItem>
        <ElDropdownItem command="openExplorer">경로 열기</ElDropdownItem>
      </ElDropdownItem>
    </template>
  </ElDropdown>
  <input v-model="hostsOriginText" type="text" disabled style="display: none" />
  <ElInput v-model="hostsText" type="textarea" resize="none"></ElInput>
</template>

<script setup lang="ts">
import { ElButton, ElDropdown, ElDropdownItem, ElInput, ElMessageBox } from 'element-plus'
import { ref, watch } from 'vue'

interface Props {
  selectedFileName?: string
  selectedFilePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedFileName: undefined,
  selectedFilePath: undefined
})

const emit = defineEmits<{
  (event: 'update:selectedFilePath', data: string): void
}>()

const hostsPath = ref<string>('')
const hostsText = ref<string>('')
const hostsOriginText = ref<string>('')
const saveButtonDisabled = ref<boolean>(true)

watch(
  () => props.selectedFileName,
  async (newVal) => {
    if (newVal) {
      const file = await window.api.hostsInvoke.GetHosts(newVal)
      hostsOriginText.value = file.txt
      hostsPath.value = file.path
      hostsText.value = file.txt
      emit('update:selectedFilePath', file.path)
    }
  }
)

watch(
  () => [hostsText.value, hostsOriginText.value],
  async (newVal) => {
    if (!newVal[0].includes('\r')) {
      newVal[0] = newVal[0].replace(/\n/g, '\r\n')
    }
    saveButtonDisabled.value = newVal[0] === hostsOriginText.value
  }
)

async function save() {
  const result = await ElMessageBox.confirm('변경된 내용을 저장하시겠습니까?', {
    type: 'info',
    confirmButtonText: '저장',
    cancelButtonText: '취소'
  })
  if (props.selectedFileName && result === 'confirm') {
    let txt = hostsText.value
    if (!txt.includes('\r')) {
      txt = txt.replace(/\n/g, '\r\n')
    }
    const editResult = await window.api.hostsInvoke.EditHosts(props.selectedFileName, txt)
    if (editResult.success) {
      await ElMessageBox.alert('저장되었습니다.', {
        type: 'success',
        confirmButtonText: '확인'
      })
      hostsOriginText.value = txt
    } else {
      await ElMessageBox.alert('저장에 실패했습니다.', {
        type: 'error',
        confirmButtonText: '확인'
      })
    }
  }
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
</script>
<style lang="css">
.el-input-group__append button {
  background-color: var(--el-color-primary) !important;
  color: var(--el-button-disabled-text-color) !important;
}

.el-input-group__append button.is-disabled {
  background-color: var(--el-button-disabled-bg-color) !important;
  color: var(--el-button-disabled-text-color) !important;
}
</style>
