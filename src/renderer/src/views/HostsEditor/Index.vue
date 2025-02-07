<template>
  <div class="row">
    <div class="col-md-3" style="width: 250px">
      <div class="row mb-1">
        <div class="col-md-12">
          <ElButton type="success" @click="createHostsFile">생성</ElButton>
          <ElButton :disabled="deleteButtonDisabled" type="danger" @click="deleteHostsFile">
            삭제
          </ElButton>
          <ElTooltip
            raw-content
            :content="`
            <b style='font-size: 15px; color: var(--el-color-success)'>초록 배경</b>: 현재 사용중인 파일<br/>
            <b style='font-size: 15px; color: var(--el-color-primary)'>파랑 배경</b>: 선택된 파일<br/>
            <b style='font-size: 15px; color: var(--el-color-warning)'>선택된 파일 한번 더 클릭</b> 시 교체 팝업이 뜹니다.
            `"
            placement="right"
          >
            <ElButton type="primary" disabled :icon="InfoFilled">정보</ElButton>
          </ElTooltip>
        </div>
      </div>
      <HostsFileList
        ref="hostsFileListRef"
        v-model:selected-hosts-file="selectedHostsFile"
        :current-hosts-file="currentHostsFile"
        @click="HostsFileListClickHandler"
      />
    </div>
    <div class="col-md-9">
      <div class="row">
        <div class="col-md-6">
          <div class="row mb-1">
            <div class="col-md-12">
              <ElButton :disabled="deleteButtonDisabled" type="success" @click="shiftHostsFile">
                교체
              </ElButton>
              <ElButton type="primary" @click="goNexonLogin">NEXON Login</ElButton>
              <ElTooltip
                class="box-item"
                effect="dark"
                content="선택된 파일과 hosts 파일을 VSCode에서 비교합니다."
                placement="top"
              >
                <ElButton :disabled="diffButtonDisabled" type="warning" @click="goDiff">
                  VSCode Diff
                </ElButton>
              </ElTooltip>
            </div>
          </div>
          <EditHostsFileViewer
            v-model:selected-file-path="selectedHostsFilePath"
            :selected-file-name="selectedHostsFile"
          />
        </div>
        <div class="col-md-6">
          <div class="row mb-1">
            <div class="col-md-12">
              <ElButton type="success" @click="hostsReload">Hosts Reload</ElButton>
            </div>
          </div>
          <OriginHostsFileViewer
            ref="originRef"
            v-model:selected-file-path="currentHostsFilePath"
          />
        </div>
      </div>
    </div>
  </div>
  <Search ref="searchRef" v-model:show="searchShow" />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import HostsFileList from '@/components/HostsEditor/HostsFileList.vue'
import EditHostsFileViewer from '@/components/HostsEditor/EditHostsFileViewer.vue'
import OriginHostsFileViewer from '@/components/HostsEditor/OriginHostsFileViewer.vue'
import Search from '@/components/Search.vue'
import { ElButton, ElMessageBox, ElTooltip } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const originRef = useTemplateRef('originRef')
const hostsFileListRef = useTemplateRef('hostsFileListRef')
const selectedHostsFile = ref<string>('')
const selectedHostsFilePath = ref<string>('')
const currentHostsFile = ref<string>('')
const currentHostsFilePath = ref<string>('')
const deleteButtonDisabled = computed(() => currentHostsFile.value === selectedHostsFile.value)
const diffButtonDisabled = computed(() => {
  if (currentHostsFile.value === selectedHostsFile.value) return true
  if (!selectedHostsFile.value) return true
  return false
})

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
  currentHostsFile.value = filename
  originRef.value?.getHosts()
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

async function shiftConfirmExcute(filename: string) {
  if (currentHostsFile.value === selectedHostsFile.value) return
  const confirm = await ElMessageBox.confirm(
    `[${currentHostsFile.value}] -> [${filename}] 파일로 교체하시겠습니까?`,
    {
      cancelButtonText: '취소',
      confirmButtonText: '선택',
      type: 'warning'
    }
  )
  if (confirm === 'confirm') {
    const setResult = await window.api.hostsInvoke.SetHosts(filename)
    if (setResult.success) {
      await ElMessageBox.alert('hosts 파일이 변경되었습니다.')
      currentHostsFile.value = filename
    } else {
      await ElMessageBox.alert(`hosts 파일 변경에 실패했습니다.\n${setResult.error?.message}`)
    }
  }
}

async function shiftHostsFile() {
  await shiftConfirmExcute(selectedHostsFile.value)
}

async function HostsFileListClickHandler(filename: string) {
  if (selectedHostsFile.value === filename) {
    await shiftConfirmExcute(filename)
  } else {
    selectedHostsFile.value = filename
  }
}

async function createHostsFile() {
  const input = await ElMessageBox.prompt(
    `생성할 파일명을 입력하세요.<br/>
    생성된 파일의 내용은 <b style="color: orange;">원본 hosts 파일의 내용을 복사</b>합니다.`,
    'hosts 파일 생성',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '생성',
      cancelButtonText: '취소',
      inputPattern: /^[a-zA-Z0-9_-]+$/,
      inputErrorMessage: '영문, 숫자, -, _ 만 입력 가능합니다.'
    }
  )

  if (input.value) {
    const list = await window.api.hostsInvoke.GetHostsFiles()
    if (list.includes(input.value)) {
      await ElMessageBox.alert(`[${input.value}] 파일이 이미 존재합니다.`, { type: 'error' })
      return
    }
    const result = await window.api.hostsInvoke.CreateHosts(input.value)
    if (result.success) {
      await ElMessageBox.alert(`[${input.value}] 파일이 생성되었습니다.`, { type: 'success' })
      createdHostsFile()
    } else {
      await ElMessageBox.alert(
        `[${input.value}] 파일 생성에 실패했습니다.\n${result.error?.message}`,
        {
          type: 'error'
        }
      )
    }
  }
}

function createdHostsFile() {
  hostsFileListRef.value?.bindList()
}

async function deleteHostsFile() {
  if (currentHostsFile.value === selectedHostsFile.value) {
    await ElMessageBox.alert('현재 사용중인 파일은 삭제할 수 없습니다.', { type: 'error' })
    return
  }
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
  window.api.windowInvoke.OpenElectronWindow('https://nxlogin.nexon.com/')
}

function goDiff() {
  window.api.windowInvoke.ExecuteCommand(
    `code --diff ${selectedHostsFilePath.value} ${currentHostsFilePath.value}`
  )
}
</script>

<style>
textarea {
  height: 535px;
  resize: none;
  line-height: initial !important;
  font-size: 12px !important;
}
</style>
