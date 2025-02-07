<template>
  <ElTree
    :data="treeData"
    :default-expand-all="true"
    :highlight-current="true"
    node-key="label"
    :current-node-key="selectedHostsFile"
    @node-click="handleNodeClick"
  ></ElTree>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface ITree {
  label: string
}

interface IProps {
  selectedHostsFile: string
  currentHostsFile: string
}

const props = withDefaults(defineProps<IProps>(), {
  selectedHostsFile: '',
  currentHostsFile: ''
})

const emit = defineEmits<{
  (event: 'update:selectedHostsFile', data: string): void
}>()

watch(
  () => props.currentHostsFile,
  (newVal) => {
    const el = document.querySelector<HTMLDivElement>(`[data-key=${newVal}] > div`)
    if (el) {
      const arr = document.querySelectorAll<HTMLDivElement>('.el-tree-node__content')
      arr.forEach((item) => {
        item.style.backgroundColor = ''
      })
      el.style.backgroundColor = 'var(--el-color-success-light-8)'
    }
  }
)

const treeData = ref<ITree[]>([])

async function handleNodeClick(data: ITree) {
  emit('update:selectedHostsFile', data.label)
}

async function bindList() {
  const list = await window.api.hostsInvoke.GetHostsFiles()
  // treeData.value 클리어 후 다시 추가
  treeData.value.splice(0, treeData.value.length)
  treeData.value.push(
    ...list.map((item) => {
      return {
        label: item
      }
    })
  )
}

onMounted(async () => {
  window.api.hostsInvoke.SetTrayMenu()
  await bindList()
})

defineExpose({
  bindList
})
</script>

<style lang="css"></style>
