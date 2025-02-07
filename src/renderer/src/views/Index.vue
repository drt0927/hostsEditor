<template>
  <div>
    <ElButton @click="go('HostsEditor')">HostsEditor</ElButton>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
type ViewName = 'HostsEditor'

function go(view: ViewName) {
  router.push({
    name: view
  })
}
</script>

<style></style>
