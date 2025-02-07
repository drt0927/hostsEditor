<template>
  <div v-show="show" class="search-container">
    <div class="input-group">
      <input
        ref="wordInput"
        v-model="searchValue"
        type="text"
        class="form-control form-control-sm"
        placeholder="검색"
        @keyup.enter="search('next', true)"
      />
      <div class="input-group-append">
        <input
          id="matchCase"
          v-model="matchCase"
          type="checkbox"
          class="btn-check"
          autocomplete="off"
        />
        <label class="btn btn-sm btn-outline-secondary" title="Match Case" for="matchCase">
          Aa
        </label>
        <button
          class="btn btn-sm btn-outline-secondary"
          title="Previous Match (Shift+Enter)"
          @click="search('prev', false)"
        >
          ⬆️
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          title="Next Match (Enter)"
          @click="search('next', false)"
        >
          ⬇️
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          title="Close (Escape)"
          @click="closeContainer()"
        >
          ❌
        </button>
      </div>
    </div>
    {{ matchResult }}
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
interface Props {
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

const emit = defineEmits<{
  (event: 'update:show', show: boolean): void
}>()

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      showContainer()
    } else {
      closeContainer()
    }
  }
)

const searchValue = ref('')
const matchCase = ref(false)
const wordInput = ref<HTMLInputElement>()
const matchResult = ref<string>('0 of 0')

async function search(dir: 'prev' | 'next', reset: boolean) {
  if (!props.show) return
  const result = await window.api.searchInvoke.Search(
    searchValue.value,
    matchCase.value,
    dir !== 'prev',
    reset
  )
  matchResult.value = `${result.activeMatchOrdinal} of ${result.matches}`
}

function showContainer() {
  nextTick(() => wordInput.value?.focus())
}

function closeContainer() {
  window.api.searchInvoke.SearchStop()
  emit('update:show', false)
}

defineExpose({ showContainer, search })
</script>

<style>
.search-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  padding: 10px;
  background: lightgray;
  border-radius: 5px;
}
</style>
