<template>
  <el-menu :default-active="activeIndex" :router="true" mode="horizontal">
    <el-menu-item index="/">Index</el-menu-item>
    <el-menu-item index="/hosts-editor">HostsEditor</el-menu-item>
    <!-- <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item> -->
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
</style>
