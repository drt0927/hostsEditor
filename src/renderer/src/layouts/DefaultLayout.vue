<template>
  <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="false">
    <el-menu-item index="/">Home</el-menu-item>
    <el-menu-item index="/hosts-editor">HostsEditor</el-menu-item>
  </el-menu>
  <div id="app-wrapper" class="d-flex flex-column flex-column-fluid">
    <div class="app-content flex-column-fluid">
      <!--begin::Content container-->
      <div class="app-container container-fluid">
        <RouterView></RouterView>
      </div>
      <!--end::Content container-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = computed(() => router.currentRoute.value.path)
</script>

<style lang="css">
#app-wrapper {
  max-height: 630px;
}
.app-content {
  padding-top: 10px !important;
  padding-bottom: 0px;
}
</style>
