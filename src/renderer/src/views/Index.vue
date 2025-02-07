<template>
  <div>
    <ElButton v-for="r of route" :key="r.name" @click="go(r.name)">{{ r.meta.title }}</ElButton>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { computed } from 'vue'
import { RouteRecordNameGeneric, useRouter } from 'vue-router'

const router = useRouter()
const route = computed(() =>
  router.getRoutes().filter((r) => r.meta.depth === 1 && r.name !== 'Index')
)

function go(view: RouteRecordNameGeneric) {
  router.push({
    name: view
  })
}
</script>

<style></style>
