<template>
  <ElDialog v-model="localShow" :modal="false">
    <span>hosts 파일 생성</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="localShow = false">Cancel</el-button>
        <el-button type="primary" @click="localShow = false"> Confirm </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'

interface Props {
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

const emit = defineEmits<{
  (event: 'update:show', show: boolean): void
  (event: 'saved'): void
}>()

const localShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

// watch(
//   () => props.show,
//   (newVal) => {
//     if (newVal) {
//       // $('#createHostsModal').modal('show')
//     } else {
//       // $('#createHostsModal').modal('hide')
//     }
//   }
// )

onMounted(() => {
  // $('#createHostsModal').on('hidden.bs.modal', function () {
  //   emit('update:show', false)
  // })
})

// const fileName = ref<string>('')
// async function create() {
//   if (!fileName.value) return
//   // 중복 확인
//   const list = await window.api.hostsInvoke.GetHostsFiles()
//   if (list.includes(fileName.value)) {
//     alert(`[${fileName.value}] 파일이 이미 존재합니다.`)
//     return
//   }

//   if (
//     confirm(
//       `[${fileName.value}] 파일을 생성하시겠습니까?\n파일의 내용은 원본 hosts 파일의 내용을 복사하여 생성합니다.`
//     )
//   ) {
//     await window.api.hostsInvoke.CreateHosts(fileName.value)
//     emit('saved')
//     alert(`[${fileName.value}] 파일이 생성되었습니다.`)
//     fileName.value = ''
//     emit('update:show', false)
//   }
// }
</script>

<style></style>
