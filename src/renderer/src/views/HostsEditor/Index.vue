<template>
  <div class="row">
    <div class="col-md-2">
      <div class="row mb-1">
        <div class="col-md-12">
          <ElButton type="success" @click="createHostsFile">생성</ElButton>
          <ElButton type="danger" @click="deleteHostsFile">삭제</ElButton>
        </div>
      </div>
      <HostsFileList
        ref="hostsFileListRef"
        v-model:selected-hosts-file="selectedHostsFile"
        :current-hosts-file="currentHostsFile"
      />
    </div>
    <div class="col-md-10">
      <div class="row">
        <div class="col-md-6">
          <div class="row mb-1">
            <div class="col-md-12">
              <ElButton type="success" @click="shiftHostsFile">교체</ElButton>
              <ElButton type="primary" @click="goNexonLogin">NEXON Login</ElButton>
            </div>
          </div>
          <EditHostsFileViewer :selected-file-name="selectedHostsFile" />
        </div>
        <div class="col-md-6">
          <div class="row mb-1">
            <div class="col-md-12">
              <ElButton type="success" @click="hostsReload">Hosts Reload</ElButton>
            </div>
          </div>
          <OriginHostsFileViewer ref="originRef" />
        </div>
      </div>
    </div>
  </div>
  <Search ref="searchRef" v-model:show="searchShow" />
  <CreateHostsModal v-model:show="showCreateHostsModal" @saved="createdHostsFile" />
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import HostsFileList from '@/components/HostsEditor/HostsFileList.vue'
import EditHostsFileViewer from '@/components/HostsEditor/EditHostsFileViewer.vue'
import OriginHostsFileViewer from '@/components/HostsEditor/OriginHostsFileViewer.vue'
import CreateHostsModal from '@/components/HostsEditor/CreateHostsModal.vue'
import Search from '@/components/Search.vue'
import { ElButton, ElMessageBox } from 'element-plus'

const originRef = useTemplateRef('originRef')
const hostsFileListRef = useTemplateRef('hostsFileListRef')
const selectedHostsFile = ref<string>('')
const currentHostsFile = ref<string>('')

function hostsReload() {
  originRef.value?.getHosts()
}

const searchRef = useTemplateRef('searchRef')
const searchShow = ref<boolean>(false)

//#region " Shortcut "
window.electron.ipcRenderer.on('on-find', () => {
  searchShow.value = true
  searchRef.value?.showContainer()
})
window.electron.ipcRenderer.on('on-escape', () => {
  searchShow.value = false
})
window.electron.ipcRenderer.on('on-enter', () => {
  if (document.activeElement?.id !== 'hostsEditorTextArea') {
    searchRef.value?.search('next', false)
  }
})
window.electron.ipcRenderer.on('on-shift-enter', () => {
  if (document.activeElement?.id !== 'hostsEditorTextArea') {
    searchRef.value?.search('prev', false)
  }
})
window.electron.ipcRenderer.on('on-hosts-change', (_event, filename) => {
  window.api.hostsInvoke.SetHosts(filename)
  hostsFileListRef.value?.bindList()
})
//#endregion

onMounted(async () => {
  const current = await window.api.hostsInvoke.GetCurrentHosts()
  if (current) {
    currentHostsFile.value = current.name
    selectedHostsFile.value = current.name
  }
})

async function shiftHostsFile() {
  if (currentHostsFile.value !== selectedHostsFile.value) {
    const result = await ElMessageBox.confirm(
      `[${currentHostsFile.value}] -> [${selectedHostsFile.value}] 파일로 교체하시겠습니까?`,
      {
        cancelButtonText: '취소',
        confirmButtonText: '교체',
        type: 'warning'
      }
    )
    if (result === 'confirm') {
      const setResult = await window.api.hostsInvoke.SetHosts(selectedHostsFile.value)
      if (setResult.success) {
        await ElMessageBox.alert('hosts 파일이 변경되었습니다.')
        currentHostsFile.value = selectedHostsFile.value
      } else {
        await ElMessageBox.alert(`hosts 파일 변경에 실패했습니다.\n${setResult.error?.message}`)
      }
    }
  }
}

const showCreateHostsModal = ref<boolean>(false)
function createHostsFile() {
  /*
  //   // 중복 확인
  //   const list = await window.api.hostsInvoke.GetHostsFiles()
  //   if (list.includes(fileName.value)) {
  //     alert(`[${fileName.value}] 파일이 이미 존재합니다.`)
  //     return
  //   }
  */
  ElMessageBox.prompt(
    '생성할 파일명을 입력하세요.<br/>파일의 내용은 원본 hosts 파일의 내용을 복사하여 생성합니다.',
    'hosts 파일 생성',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '생성',
      cancelButtonText: '취소',
      inputPattern: /^[a-zA-Z0-9_-]+$/,
      inputErrorMessage: '영문, 숫자, -, _ 만 입력 가능합니다.'
    }
  ).then(async ({ value }) => {
    if (value) {
      const list = await window.api.hostsInvoke.GetHostsFiles()
      if (list.includes(value)) {
        await ElMessageBox.alert(`[${value}] 파일이 이미 존재합니다.`, { type: 'error' })
        return
      }
      const result = await window.api.hostsInvoke.CreateHosts(value)
      if (result.success) {
        await ElMessageBox.alert(`[${value}] 파일이 생성되었습니다.`, { type: 'success' })
        createdHostsFile()
      } else {
        await ElMessageBox.alert(`[${value}] 파일 생성에 실패했습니다.\n${result.error?.message}`, {
          type: 'error'
        })
      }
    }
  })
  // showCreateHostsModal.value = true
}

function createdHostsFile() {
  hostsFileListRef.value?.bindList()
}

async function deleteHostsFile() {
  const result = await ElMessageBox.confirm(
    `[${selectedHostsFile.value}] 파일을 삭제하시겠습니까?`,
    {
      cancelButtonText: '취소',
      confirmButtonText: '삭제',
      type: 'warning'
    }
  )
  if (result === 'confirm') {
    window.api.hostsInvoke.DeleteHosts(selectedHostsFile.value)
    await ElMessageBox.alert(`[${selectedHostsFile.value}] 파일이 삭제되었습니다.`, {
      type: 'success'
    })
    hostsFileListRef.value?.bindList()
  }
}

function goNexonLogin() {
  window.api.windowInvoke.Open('https://nxlogin.nexon.com/')
}
</script>

<style>
.app-content {
  padding-top: 10px !important;
  padding-bottom: 0px;
}

textarea {
  height: 535px;
  resize: none;
  line-height: initial !important;
  font-size: 12px !important;
}
</style>
