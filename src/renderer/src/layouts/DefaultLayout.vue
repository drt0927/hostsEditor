<template>
  <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="false">
    <el-menu-item index="/">
      <img style="width: 55px" src="@/assets/icon.png" alt="Hoe Icon" />
    </el-menu-item>
    <el-menu-item v-for="r of route" :key="r.name" :index="r.path">{{ r.meta.title }}</el-menu-item>
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
const route = computed(() =>
  router.getRoutes().filter((r) => r.meta.depth === 1 && r.name !== 'Index')
)
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
