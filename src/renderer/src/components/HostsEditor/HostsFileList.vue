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
  (event: 'click', data: string): void
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
  emit('click', data.label)
}

async function bindList() {
  const list = await window.api.hostsInvoke.GetHostsFiles()
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
  await bindList()
})

defineExpose({
  bindList
})
</script>

<style lang="css">
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: var(--el-color-primary-light-7);
}
</style>
